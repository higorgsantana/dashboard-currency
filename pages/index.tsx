import Head from 'next/head'
import dynamic from 'next/dynamic'

const ComparisonDashboard = dynamic(() => import('../components/ComparisonDashboard'), {
  ssr: false,
})

export default function Home() {
  return (
    <>
      <Head>
        <title> Dashboard de Moedas</title>
        <meta name="description" content="Compare moedas em tempo real com gráficos dinâmicos" />
      </Head>

      <main className="min-h-screen bg-gray-100 dark:bg-gray-950 py-10 px-4">
        <div className="max-w-6x1 mx-auto">
          <h1 className="text-3x1 font-bold text-gray-900 dark:text-white mb-8 text-center">
            Dashboard de Moedas
          </h1>
          <ComparisonDashboard />
        </div>
      </main>
    </>
  )
}
