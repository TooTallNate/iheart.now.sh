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
      const url = await getStreamURL(id)
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

async function getStreamURL (stationId) {
  const stream = (await iheart.streams(stationId))[0]
  console.log(JSON.stringify(stream))

  let url = await iheart.streamURL(stream)
  if (await isICY(url)) {
    url = `${ICY_PROXY}${url}`
  }
  return url
}

async function isICY (url) {
  const parsed = parse(url)

  const secure = 'https:' === parsed.protocol
  const host = parsed.host
  const port = parsed.port || (secure ? 443 : 80)

  const payload = [
    `GET ${parsed.path} HTTP/1.1`,
    `Host: ${parsed.host}`,
    //'User-Agent: curl',
    'Accept: *\/*',
  ].join('\r\n') + '\r\n\r\n'

  const socket = await connect(secure ? tls : net, { host, port })
  socket.write(payload)

  const firstChunk = await once(socket, 'data')
  const firstSpace = firstChunk.indexOf(0x20)
  const method = firstChunk.slice(0, firstSpace).toString('ascii').toUpperCase()

  socket.destroy()

  return 'ICY' === method
}

function connect (mod, opts) {
  return new Promise((resolve, reject) => {
    const socket = mod.connect(opts, (err) => err ? reject(err) : resolve(socket))
  })
}
