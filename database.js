const sqlite3 = require('sqlite3').verbose()
const { open } = require('sqlite')

let db

async function initCon () {
	db = await open({
		filename: './db/links.db',
		driver: sqlite3.Database
	})
	await db.run('CREATE TABLE IF NOT EXISTS links (link TEXT UNIQUE, title TEXT)')
	await db.run('CREATE VIRTUAL TABLE IF NOT EXISTS links_fts USING fts5(link UNINDEXED, title)')
	if ((await db.all('SELECT * FROM links_fts')).length === 0) {
		await db.run('INSERT INTO links_fts SELECT * FROM links')
	}
}

async function addLink (link, title) {
	db.run('INSERT or IGNORE INTO links (link, title) VALUES (?, ?)', [link, title])
}

async function getLink (link) {
	return await db.get('SELECT * FROM links WHERE link=?', [link])
}

async function findText (text) {
	return await db.all('SELECT * FROM links_fts WHERE links_fts MATCH ?', [text])
}
module.exports = {
	addLink,
	getLink,
	initCon,
	findText
}
