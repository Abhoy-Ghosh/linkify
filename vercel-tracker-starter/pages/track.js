import React from 'react'

export async function getServerSideProps({ query, req }) {
  const { url } = query
  const origin = process.env.NEXT_PUBLIC_ORIGIN || `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`

  if (!url) {
    return { props: { error: 'Missing url parameter' } }
  }

  const apiUrl = `${origin}/api/track?url=${encodeURIComponent(url)}`
  const resp = await fetch(apiUrl)
  const html = await resp.text()

  return { props: { html } }
}

export default function TrackPage({ html, error }) {
  if (error) return <div style={{ padding: 20 }}>{error}</div>
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
