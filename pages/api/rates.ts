import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { base = 'USD', target = 'BRL', start, end } = req.query

  if (!start || !end) {
    return res.status(400).json({ error: 'Parâmetros de data ausentes' })
  }

  const url = `https://api.frankfurter.app/${start}..${end}?from=${base}&to=${target}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      return res.status(500).json({ error: 'Falha ao buscar da API externa' })
    }

    const data = await response.json()

    if (!data || !data.rates) {
      return res
        .status(500)
        .json({ error: 'Resposta inválida da API externa', raw: data })
    }

    return res.status(200).json(data.rates)
  } catch (err) {
    console.error('[API ROUTE] Erro:', err)
    return res.status(500).json({ error: 'Erro inesperado no servidor' })
  }
}
