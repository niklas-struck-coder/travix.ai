// Inlines the built JS/CSS into the HTML so the page works from file:// (double-click).
import fs from 'node:fs'
import path from 'node:path'
const [dir, out] = process.argv.slice(2)
const htmlFile = fs.readdirSync(dir).find((f) => f.endsWith('.html'))
let html = fs.readFileSync(path.join(dir, htmlFile), 'utf8')
html = html.replace(/<link rel="modulepreload"[^>]*>\s*/g, '')
html = html.replace(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+\.css)"[^>]*>/g, (_, f) => `<style>${fs.readFileSync(path.join(dir, f), 'utf8')}</style>`)
html = html.replace(/<script type="module"[^>]*src="\.\/(assets\/[^"]+\.js)"[^>]*><\/script>/g, (_, f) => {
  const js = fs.readFileSync(path.join(dir, f), 'utf8').replace(/<\/script/gi, '<\\/script')
  return `<script type="module">${js}</script>`
})
// move inline module scripts to the end of <body> so #root / #app exists
const scripts = []
html = html.replace(/<script type="module">[\s\S]*?<\/script>/g, (m) => { scripts.push(m); return '' })
html = html.replace('</body>', () => scripts.join('\n') + '\n</body>')
fs.writeFileSync(out, html)
console.log('wrote', out, (fs.statSync(out).size / 1024 / 1024).toFixed(2), 'MB')
