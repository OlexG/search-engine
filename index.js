const express = require('express')
const { findText, initCon } = require('./database');
(async function () {
	await initCon()

	const app = express()

	app.use(express.static('public'))
	app.use(express.json())
	app.use(express.urlencoded({
		extended: true
	}))

	app.post('/search', async function (req, res) {
		res.send(await findText(req.body.text))
	})

	app.listen(3000, () => {
		console.log('listening at http://localhost:3000')
	})
})()
