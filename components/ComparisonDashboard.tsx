import React, { useEffect, useState } from 'react'
import { CurrencyChart } from './CurrencyChart'
import { Select } from './Select'
import { ThemeToggle } from './ThemeToggle'

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

      {comparisons.map((pair, index) => (
        <div key={index} className="space-y-4 border-t border-gray-300 dark:border-gray-700 pt-6">
          {/* Título + Botão remover */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Comparação {index + 1}: {pair.base}/{pair.target}
            </h2>
            <button
              onClick={() => handleRemove(index)}
              className="text-sm text-red-600 hover:underline"
            >
              Remover
            </button>
          </div>

          {/* Selects */}
          <div className="flex gap-4 flex-wrap">
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
          <CurrencyChart
            baseCurrency={pair.base}
            targetCurrency={pair.target}
            period={pair.period}
          />
        </div>
      ))}
    </div>
  )
}
