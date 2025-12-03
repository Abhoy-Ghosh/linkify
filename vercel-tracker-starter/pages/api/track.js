import fetch from 'node-fetch'

let visits = global.__VISITS ||= []

export default async function handler(req, res) {
  const { url } = req.query
  if (!url) {
    res.status(400).send('Missing url query')
    return
  }

  const forwarded = req.headers['x-forwarded-for'] || ''
  const ip = forwarded.split(',').shift() || req.socket.remoteAddress || ''

  let geo = { city: 'Unknown', region: 'Unknown', country: 'Unknown', latitude: null, longitude: null }
  try {
    const lookup = await fetch(`https://ipapi.co/${ip}/json/`)
    const data = await lookup.json()
    geo.city = data.city || geo.city
    geo.region = data.region || geo.region
    geo.country = data.country_name || geo.country
    geo.latitude = data.latitude || null
    geo.longitude = data.longitude || null
  } catch (e) {
    // ignore
  }

  visits.push({
    time: new Date().toISOString(),
    ip,
    geo,
    url
  })

  const redirectTo = decodeURIComponent(url)
  const html = `<!doctype html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Redirecting...</title>
  <style>body{font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial;color:#0f172a;background:#f8fafc;padding:24px} .card{max-width:720px;margin:40px auto;background:white;padding:20px;border-radius:12px;box-shadow:0 6px 22px rgba(2,6,23,0.08)} button{padding:10px 14px;border-radius:8px;border:0;cursor:pointer}</style>
</head>
<body>
  <div class="card">
    <h2 style="margin-top:0">You're being redirected</h2>
    <p>We collect your approximate location (city/region) for analytics and to show localized offers. You may optionally share precise location for a better experience.</p>
    <p><strong>Product:</strong> ${escapeHtml(redirectTo)}</p>
    <div style="display:flex;gap:10px;margin-top:12px">
      <button id="gps" style="background:#0ea5e9;color:white">Share precise location & continue</button>
      <button id="skip" style="background:#e6e7ea">Skip & continue</button>
    </div>
  </div>

  <script>
    const redirect = ${JSON.stringify(redirectTo)};
    document.getElementById('skip').onclick = () => { window.location.href = redirect }
    document.getElementById('gps').onclick = () => {
      if (!navigator.geolocation) { window.location.href = redirect; return }
      navigator.geolocation.getCurrentPosition((pos) => {
        fetch('/api/save-location', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, productUrl: redirect }) })
          .finally(() => { window.location.href = redirect })
      }, () => { window.location.href = redirect })
    }
  </script>
</body>
</html>`

  res.setHeader('Content-Type', 'text/html')
  res.status(200).send(html)
}

function escapeHtml(str){
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"'/g,'&quot;')
}
