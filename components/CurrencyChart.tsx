import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { fetchExchangeRates } from '../utils/fetchExchangeRates'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

type Props = {
  baseCurrency: string
  targetCurrency: string
  period: string
}

export function CurrencyChart({ baseCurrency, targetCurrency, period }: Props) {
  const [labels, setLabels] = useState<string[]>([])
  const [values, setValues] = useState<number[]>([])
  const [variation, setVariation] = useState<number | undefined>(undefined)
  const [firstDate, setFirstDate] = useState<string | null>(null)
  const [lastDate, setLastDate] = useState<string | null>(null)

  useEffect(() => {
    const today = new Date()
    const endDate = today.toISOString().split('T')[0]
    const start = new Date()
    const days = parseInt(period, 10) || 7
    start.setDate(today.getDate() - days + 1)
    const startDate = start.toISOString().split('T')[0]

    fetchExchangeRates(baseCurrency, targetCurrency, startDate, endDate)
      .then(rates => {
        const dates = Object.keys(rates).sort()
        const vals = dates.map(date => rates[date][targetCurrency])
        const first = vals[0]
        const last = vals[vals.length - 1]
        const variationPercent = first && last ? ((last - first) / first) * 100 : undefined

        setLabels(dates)
        setValues(vals)
        setFirstDate(dates[0] || null)
        setLastDate(dates[dates.length - 1] || null)
        setVariation(variationPercent)
      })
      .catch(console.error)
  }, [baseCurrency, targetCurrency, period])

  const data = {
    labels,
    datasets: [
      {
        label: `${baseCurrency}/${targetCurrency}`,
        data: values,
        borderColor: '#3B82F6',
        tension: 0.2,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: true,
        text: `Variação ${baseCurrency}/${targetCurrency} - Últimos ${period} dias`,
      },
    },
  }

  return (
    <div
      className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md
     border border-gray-200 dark:border-gray-700 w-full max-w-2xl"
    >
      {labels.length === 0 ? (
        <p>Carregando gráfico...</p>
      ) : (
        <>
          <div className="mb-4 space-y-1">
            {variation !== undefined && (
              <p
                className={`text-sm font-medium ${
                  variation > 0
                    ? 'text-green-600'
                    : variation < 0
                      ? 'text-red-600'
                      : 'text-gray-700'
                }`}
              >
                Variação no período: {variation.toFixed(2)}%
              </p>
            )}
            {firstDate && lastDate && (
              <p className="text-sm text-gray-600">
                Período: {new Date(firstDate).toLocaleDateString('pt-BR')} até{' '}
                {new Date(lastDate).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
          {/* key força Chart.js a recriar quando moedas mudam */}
          <Line key={`${baseCurrency}-${targetCurrency}`} data={data} options={options} />
        </>
      )}
    </div>
  )
}
