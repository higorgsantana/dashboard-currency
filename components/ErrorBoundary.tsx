import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Erro capturado pelo ErrorBoundary', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-600 bg-red-50 border border-red-300 rounded dark:bg-red-900 dark:text-red-100 dark:border-red-700">
          Ocorreu um erro ao carregar este gráfico. Tente novamente mais tarde.
        </div>
      )
    }

    return this.props.children
  }
}
