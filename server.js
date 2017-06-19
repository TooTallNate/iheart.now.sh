const net = require('net')
const tls = require('tls')
const next = require('next')
const micro = require('micro')
const iheart = require('iheart')
const once = require('event-to-promise')
const { parse } = require('url')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const ICY_PROXY = 'https://icy.n8.io/'

app.prepare()
.then(() => {
  const server = micro(async (req, res) => {
    if (req.method === 'GET' && /^\/stream/.test(req.url)) {
      const id = req.url.split('/').pop() | 0
      const url = await iheart.streamURL(id)
      console.log(JSON.stringify({ id, url }))

      // Redirect
      res.statusCode = 302
      res.setHeader('Location', url)

      // Cache the redirect in the browser for 1 minute
      res.setHeader('Cache-Control', 'max-age=60')

      res.end()
    } else {
      handle(req, res)
    }
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
