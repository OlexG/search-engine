require('dotenv').config()

const Crawler = require('crawler')
const { addLink, initCon, getLink } = require('./database')

const limiter = function (limit) {
	let counter = 0
	return {
		increaseCount,
		checkLimit,
		limit
	}

	function increaseCount (am) {
		counter += am
	}
	function checkLimit () {
		return counter < limit
	}
}

const linkLimit = limiter(process.env.LINK_LIMIT)

function validLink (link) {
	if (link === undefined) return false
	if (link[0] !== 'h') return false
	// if (!notImage(link)) return false;
	return true
}
console.log(process.env.NUMBER_OF_CONNECTIONS);
(async function () {
	await initCon()
	const c = new Crawler({
		maxConnections: process.env.NUMBER_OF_CONNECTIONS,
		callback: async function (error, res, done) {
			if (error) {
				console.log(error)
			} else {
				const $ = res.$
				let links = []
				const link = res.options.uri
				if (!$) return
				const title = $('title').text()
				if (await getLink(link) === undefined && linkLimit.checkLimit() && title) {
					await addLink(link, title)
					linkLimit.increaseCount(1)
				}

				if (!linkLimit.checkLimit()) return

				$('a').each(function (el, value) {
					if (value.attribs.href) {
						const link = value.attribs.href.split('?')[0]
						links.push(link)
					}
				})

				links = links.filter((val, idx) => (links.indexOf(val) === idx && validLink(val)))

				c.queue(links)
			}
			done()
		}
	})

	c.queue('https://medium.com/')
})()
