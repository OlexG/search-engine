module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true
	},
	extends: [
		'standard'
	],
	parserOptions: {
		ecmaVersion: 12
	},
	rules: {
		indent: ['error', 'tab'],
		'no-tabs': ['error', { allowIndentationTabs: true }]
	}
}
