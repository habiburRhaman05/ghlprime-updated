// Returns HTTP 410 Gone for retired legacy URLs.
// Routed via vercel.json rewrite for /free-scripts.
export default function handler(req, res) {
  res.status(410)
  res.setHeader('Cache-Control', 'public, max-age=86400')
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>410 Gone — GHL Prime</title>
  <meta name="robots" content="noindex" />
</head>
<body>
  <h1>410 Gone</h1>
  <p>This page has been permanently removed. Please visit <a href="https://ghlprime.com/">ghlprime.com</a>.</p>
</body>
</html>`)
}