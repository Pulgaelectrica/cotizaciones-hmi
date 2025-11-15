export default async function handler(req, res) {
  const { ticker, range = "1d", interval = "1m" } = req.query;

  if (!ticker) {
    return res.status(400).json({ error: "Ticker requerido" });
  }

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=${range}&interval=${interval}`;

    const response = await fetch(url);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Error al obtener datos" });
  }
}
