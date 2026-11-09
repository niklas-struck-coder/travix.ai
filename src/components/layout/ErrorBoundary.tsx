import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('Unerwarteter Fehler in der Anwendung:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background p-6 text-center text-muted-foreground"
        >
          <AlertTriangle className="size-8 text-destructive" strokeWidth={1.5} />
          <p className="font-medium text-foreground">Diese Seite konnte nicht geladen werden</p>
          <p className="max-w-sm text-sm">
            Etwas ist schiefgelaufen. Lade die Seite neu oder gehe zurück zur Startseite.
          </p>
          <div className="mt-2 flex gap-2">
            <Button className="bg-teal text-navy hover:bg-teal/90" onClick={() => window.location.reload()}>
              Seite neu laden
            </Button>
            <Button asChild variant="outline">
              <a href="/">Zur Startseite</a>
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
