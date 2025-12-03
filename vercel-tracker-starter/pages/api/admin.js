let visits = global.__VISITS ||= []
export default function handler(req, res) {
  const token = req.query.token || req.headers['x-admin-token']
  const ADMIN = process.env.ADMIN_TOKEN || 'changeme'
  if (token !== ADMIN) return res.status(401).json({ error: 'unauthorized' })
  res.json({ visits })
}
