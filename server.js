(async () => {
	// server.js
	const fetch = require('node-fetch')
	const jsonServer = require('json-server')
	const puppeteer = require('puppeteer')

	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.52 Safari/537.17')

	const server = jsonServer.create()
	const router = jsonServer.router('db.json')
	const middlewares = jsonServer.defaults()
	 
	// Set default middlewares (logger, static, cors and no-cache)
	server.use(middlewares)
	 
	// Add custom routes before JSON Server router
	server.get('/echo', (req, res) => {
	  res.jsonp(req.query)
	})
	 
	// To handle POST, PUT and PATCH you need to use a body-parser
	// You can use the one used by JSON Server
	server.use(jsonServer.bodyParser)
	server.use(async (req, res, next) => {
	  if (req.method === 'POST') {
		req.body.createdAt = Date.now()
	  }
	  if (req.method == 'GET') {
			switch(req.path)
			{
				case '/api/TikTok/TeemoStreams/Followers':
					//var output = await getHTMLText('https://www.tiktok.com/@teemostreams?lang=en')
					await page.goto('https://www.tiktok.com/@teemostreams?lang=en')
					var output = await page.content()
					var pattern = /<strong title="Followers">([^<]*)<\/strong>/i
					var result = output.match(pattern)
					output = result[1]
					res.send(output)
					break
				case '/api/StreamHeroes/DeathAngelDE/CardsCollected':
					//var output = await getHTMLText('https://app.streamheroes.gg/streamer/deathangelde')
					await page.goto('https://app.streamheroes.gg/streamer/deathangelde')
					var output = await page.content()
					console.log(output)
					var pattern = /<div[^>]*>([^<]*)<\/div>\s*<div[^>]*>\s*gesammelte Karten/i
					var result = output.match(pattern)
					output = result[1]
					res.send(output)
					break
			}
		}
		// Continue to JSON Server router
		next()
	})
	 
	// Use default router
	server.use(jsonServer.rewriter({"/api/*": "/$1"}))
	server.use(router)
	server.listen(3000, () => {
	  console.log('JSON Server is running')
	})
})();