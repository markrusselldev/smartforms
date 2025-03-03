module.exports = {
	env: {
	  browser: true,
	  es2021: true,
	  node: true,
	},
	extends: [
	  'eslint:recommended',
	  'plugin:@wordpress/eslint-plugin/recommended',
	  'plugin:prettier/recommended'
	],
	parserOptions: {
	  ecmaVersion: 12,
	  sourceType: 'module'
	},
	rules: {
	  // Add or override rules here if needed.
	}
  };
  