const iheart = require('iheart');
const { run } = require('micro');
const { parse } = require('url');

async function handler (req, res) {
  const { query: { id: _id, redirect = false } } = parse(req.url, true);
  if (!_id) {
    res.statusCode = 400;
    return {
      error: 'Missing `id` query argument'
    };
  }
  const id = parseInt(_id, 10);
  const url = await iheart.streamURL(id);

  console.log(JSON.stringify({ id, url, redirect }));

  if (redirect) {
    res.statusCode = 302;
    res.setHeader('Location', url);

    // Attempt to cache the redirect in the browser for 1 minute
    res.setHeader('Cache-Control', 'max-age=60');

    res.end();
  } else {
    return { id, url };
  }
}

module.exports = (req, res) => run(req, res, handler);
