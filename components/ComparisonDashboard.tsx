import React, { useEffect, useState } from 'react'
import { CurrencyChart } from './CurrencyChart'
import { Select } from './Select'
import { ThemeToggle } from './ThemeToggle'
import { ErrorBoundary } from './ErrorBoundary'

const currencyOptions = [
  { label: 'USD', value: 'USD' },
  { label: 'BRL', value: 'BRL' },
  { label: 'EUR', value: 'EUR' },
  { label: 'JPY', value: 'JPY' },
]

const periodOptions = [
  { label: '7 dias', value: '7' },
  { label: '30 dias', value: '30' },
  { label: '90 dias', value: '90' },
]

type CurrencyPair = {
  base: string
  target: string
  period: string
}

export default function ComparisonDashboard() {
  const [comparisons, setComparisons] = useState<CurrencyPair[]>(() => {
    if (typeof window === 'undefined') return [{ base: 'USD', target: 'BRL', period: '7' }]

    const stored = localStorage.getItem('comparisons')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        console.error('Erro ao carregar comparações do localStorage', e)
      }
    }

    return [{ base: 'USD', target: 'BRL', period: '7' }]
  })

  useEffect(() => {
    localStorage.setItem('comparisons', JSON.stringify(comparisons))
  }, [comparisons])

  const handleAddComparisons = () => {
    if (comparisons.length >= 3) return
    setComparisons(prev => [...prev, { base: 'USD', target: 'BRL', period: '7' }])
  }

  const updateComparison = (index: number, updated: Partial<CurrencyPair>) => {
    setComparisons(prev => {
      const newComparisons = [...prev]
      newComparisons[index] = { ...newComparisons[index], ...updated }
      return newComparisons
    })
  }

  const handleRemove = (index: number) => {
    setComparisons(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between">
        <button
          onClick={handleAddComparisons}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Adicionar comparação
        </button>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comparisons.map((pair, index) => (
          <div key={index}>
            <div className="border border-gray-300 dark:border-gray-700 rounded-md p-4 space-y-4 shadow-sm bg-white dark:bg-gray-900 h-full">
              <div className="space-y-4 ">
                {/* Título + Botão remover */}
                <div className="w-full flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Comparação {index + 1}: {pair.base}/{pair.target}
                  </h2>
                  <button
                    onClick={() => handleRemove(index)}
                    className="text-sm text-red-600 hover:underline mt-2"
                  >
                    Remover
                  </button>
                </div>

                {/* Selects */}
                <div className="flex gap-4 flex-wrap items-center min-w-[250px]">
                  <Select
                    label="Moeda Base"
                    value={pair.base}
                    options={currencyOptions}
                    onChange={newBase => {
                      if (newBase === pair.target) {
                        updateComparison(index, { base: pair.target, target: pair.base })
                      } else {
                        updateComparison(index, { base: newBase })
                      }
                    }}
                  />
                  <Select
                    label="Moeda Alvo"
                    value={pair.target}
                    options={currencyOptions}
                    onChange={newTarget => {
                      if (newTarget === pair.base) {
                        updateComparison(index, { base: pair.target, target: pair.base })
                      } else {
                        updateComparison(index, { target: newTarget })
                      }
                    }}
                  />
                  <Select
                    label="Período"
                    value={pair.period}
                    options={periodOptions}
                    onChange={value => updateComparison(index, { period: value })}
                  />
                </div>

                {/* Gráfico */}
                <div className="flex justify-center">
                  <ErrorBoundary>
                    <CurrencyChart
                      baseCurrency={pair.base}
                      targetCurrency={pair.target}
                      period={pair.period}
                    />
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
