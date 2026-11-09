import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from '@/routes'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
