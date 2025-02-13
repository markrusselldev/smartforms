<?php
/**
 * PHP CS Fixer configuration for the SmartForms plugin.
 *
 * This configuration uses PSR-12 as a base and adds additional rules to approximate
 * WordPress coding standards for plugin development.
 *
 * It enforces:
 * - PSR-12 (as a base)
 * - Tab indentation (via "indentation_type", relying on .editorconfig)
 * - Long array syntax (array())
 * - Single space around binary operators
 * - Blank lines before return/throw/continue/break statements
 * - Removal of unused imports and ordering of use statements
 *
 * @package SmartForms
 */

$finder = PhpCsFixer\Finder::create()
	->in(__DIR__)
	->exclude('vendor')
	->exclude('node_modules')
	->exclude('assets')
	->exclude('templates')
	->exclude('tests')
	->name('*.php');

$config = new PhpCsFixer\Config();

return $config
	->setRiskyAllowed(true)
	->setRules([
		'@PSR12'                         => true,
		'indentation_type'               => true,
		'array_syntax'                   => ['syntax' => 'long'],
		'binary_operator_spaces'         => ['default' => 'single_space'],
		'blank_line_before_statement'    => [
			'statements' => ['return', 'throw', 'continue', 'break'],
		],
		'no_unused_imports'              => true,
		'ordered_imports'                => true,
	])
	->setFinder($finder);
