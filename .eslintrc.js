module.exports = {
	env: {
	  browser: true,
	  es2021: true,
	  node: true,
	},
	extends: [
	  'eslint:recommended',
	  'plugin:@wordpress/eslint-plugin/recommended',
	  'plugin:prettier/recommended' // Disables conflicting rules and integrates Prettier
	],
	parserOptions: {
	  ecmaVersion: 12,
	  sourceType: 'module'
	},
	rules: {
	  // Customize any additional rules here.
	}
  };
  