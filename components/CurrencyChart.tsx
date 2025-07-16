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

const availableCurrencies = ['USD', 'EUR', 'BRL', 'GBP', 'JPY', 'AUD', 'CAD']

export default function CurrencyChart() {
  const [period, setPeriod] = useState('7')
  const [baseCurrency, setBaseCurrency] = useState('USD')
  const [targetCurrency, setTargetCurrency] = useState('BRL')
  const [labels, setLabels] = useState<string[]>([])
  const [values, setValues] = useState<number[]>([])
  const [minRate, setMinRate] = useState<number | null>(null)
  const [maxRate, setMaxRate] = useState<number | null>(null)

  function handleCurrencyChange(type: 'base' | 'target', newValue: string) {
    if (type === 'base') {
      if (newValue === targetCurrency) setTargetCurrency(baseCurrency)
      setBaseCurrency(newValue)
    } else {
      if (newValue === baseCurrency) setBaseCurrency(targetCurrency)
      setTargetCurrency(newValue)
    }
  }

  type Option = { label: string; value: string }

  type SelectProps = {
    label: string
    value: string
    onChange: (v: string) => void
    options: Option[]
  }

  const periodOptions: Option[] = [
    { label: '7 dias', value: '7' },
    { label: '30 dias', value: '30' },
    { label: '90 dias', value: '90' },
  ]

  const currencyOptions: Option[] = [
    { label: 'USD', value: 'USD' },
    { label: 'BRL', value: 'BRL' },
    { label: 'EUR', value: 'EUR' },
    { label: 'GBP', value: 'GBP' },
    { label: 'JPY', value: 'JPY' },
    { label: 'AUD', value: 'AUD' },
    { label: 'CAD', value: 'CAD' },
  ]

  function Select({ label, value, onChange, options }: SelectProps) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        >
          {options.map(({ label, value: val }) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  const firstDate = labels[0]
  const lastIndex = labels.length - 1
  const lastDate = labels[lastIndex]
  const lastRate = values[lastIndex]
  const firstRate = values[0]

  const variation =
    firstRate !== undefined && lastRate !== undefined
      ? ((lastRate - firstRate) / firstRate) * 100
      : undefined

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

        setLabels(dates)
        setValues(vals)

        setMinRate(Math.min(...vals))
        setMaxRate(Math.max(...vals))
      })
      .catch(err => {
        console.error('Erro ao carregar gráfico', err)
      })
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
    <>
      {/* Selects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <Select label="Período" value={period} onChange={setPeriod} options={periodOptions} />
        <Select
          label="Moeda base"
          value={baseCurrency}
          onChange={val => handleCurrencyChange('base', val)}
          options={currencyOptions}
        />
        <Select
          label="Moeda alvo"
          value={targetCurrency}
          onChange={val => handleCurrencyChange('target', val)}
          options={currencyOptions}
        />
      </div>

      {/* Gráfico */}
      <div
        className="bg-white p-6 rounded-2x1 shadow-md border border-gray-100
        dark:bg-gray-900 dark:border-gray-700 transition-colors"
      >
        {labels.length === 0 ? (
          <p>Carregando gráfico...</p>
        ) : (
          <>
            <div className="mb-4">
              {lastRate !== undefined && lastDate && (
                <p className="text-sm text-gray-600 mb-4 font-medium">
                  1 {baseCurrency} = {lastRate.toFixed(2)} {targetCurrency} (em{' '}
                  {new Date(lastDate).toLocaleDateString('pt-BR')})
                </p>
              )}

              {variation !== undefined && (
                <p
                  className={`text-sm mb-4 ${
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
            </div>
            {/* key força Chart.js a recriar quando moedas mudam */}
            <Line key={`${baseCurrency}-${targetCurrency}`} data={data} options={options} />
          </>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-700 space-y-1">
        <p>
          Periodo exibido:{' '}
          {firstDate && lastDate && (
            <>
              {new Date(firstDate).toLocaleDateString('pt-BR')} até{' '}
              {new Date(lastDate).toLocaleDateString('pt-BR')}
            </>
          )}
        </p>
      </div>
    </>
  )
}
