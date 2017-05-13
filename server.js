const next = require('next')
const micro = require('micro')
const iheart = require('iheart')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
  const server = micro(async (req, res) => {
    if (req.method === 'GET' && /^\/stream/.test(req.url)) {
      const id = req.url.split('/').pop() | 0
      const url = await getStreamURL(id)
      console.log(`${id} -> ${url}`)

      // Redirect
      res.statusCode = 302
      res.setHeader('Location', url)
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
  return await iheart.streamURL(stream)
}