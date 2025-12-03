let visits = global.__VISITS ||= []
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { latitude, longitude, productUrl } = req.body || {}
  visits.push({ time: new Date().toISOString(), type: 'gps', latitude, longitude, productUrl })
  res.json({ ok: true })
}
