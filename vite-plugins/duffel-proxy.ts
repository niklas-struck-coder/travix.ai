import type { Plugin, Connect } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

const DUFFEL_BASE_URL = 'https://api.duffel.com'
const DUFFEL_VERSION = 'v2'
const PROXY_PREFIX = '/api/duffel/'

/**
 * Dev-only server-side proxy so the Duffel secret key never reaches the
 * browser. The frontend calls /api/duffel/<duffel-path>; this middleware
 * forwards the request to api.duffel.com with the Authorization header
 * attached server-side, and relays the response back untouched.
 */
export function duffelProxyPlugin(apiKey: string | undefined): Plugin {
  return {
    name: 'duffel-proxy',
    configureServer(server) {
      server.middlewares.use(PROXY_PREFIX, createHandler(apiKey))
    },
    configurePreviewServer(server) {
      server.middlewares.use(PROXY_PREFIX, createHandler(apiKey))
    },
  }
}

function createHandler(apiKey: string | undefined): Connect.NextHandleFunction {
  return (req, res) => {
    void handleRequest(req, res, apiKey)
  }
}

async function readBody(req: IncomingMessage): Promise<Buffer | undefined> {
  if (req.method === 'GET' || req.method === 'HEAD') return undefined
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(chunk as Buffer)
  }
  return chunks.length > 0 ? Buffer.concat(chunks) : undefined
}

async function handleRequest(req: IncomingMessage, res: ServerResponse, apiKey: string | undefined) {
  if (!apiKey) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(
      JSON.stringify({
        errors: [{ message: 'DUFFEL_API_KEY is not set. Add it to .env.local and restart the dev server.' }],
      }),
    )
    return
  }

  // Connect strips the /api/duffel mount prefix from req.url before this
  // handler runs, so req.url is already the path relative to Duffel's API root.
  const targetUrl = `${DUFFEL_BASE_URL}${req.url ?? ''}`

  try {
    const body = await readBody(req)
    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Duffel-Version': DUFFEL_VERSION,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body,
    })

    res.statusCode = upstream.status
    res.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'application/json')
    const text = await upstream.text()
    res.end(text)
  } catch (error) {
    res.statusCode = 502
    res.setHeader('Content-Type', 'application/json')
    res.end(
      JSON.stringify({
        errors: [{ message: `Duffel proxy request failed: ${error instanceof Error ? error.message : 'unknown error'}` }],
      }),
    )
  }
}
