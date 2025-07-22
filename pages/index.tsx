import ComparisonDashboard from '../components/ComparisonDashboard'

export default function Home() {
  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-950  ">
      <h1 className="text-2x1 font-bold mb-4 text-gray-800 dark:text-white">Dashboard de Moedas</h1>
      <ComparisonDashboard />
    </div>
  )
}
