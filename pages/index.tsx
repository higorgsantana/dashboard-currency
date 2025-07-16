import CurrencyChart from "../components/CurrencyChart"

export default function Home () {
  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3x1 font-bold mb-6">
        Dashboard de Moedas
      </h1>
      <CurrencyChart/>
    </main>
  )
}


