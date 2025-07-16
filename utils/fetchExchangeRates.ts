export async function fetchExchangeRates(
  base: string,
  target: string,
  startDate: string,
  endDate: string
) {
  const url = `/api/rates?base=${base}&target=${target}&start=${startDate}&end=${endDate}`

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error('Erro na requisição à API')
  }

  const data = await res.json()

  if (!data) {
    throw new Error('Resposta inválida da API')
  }

  return data
}
