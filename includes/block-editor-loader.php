<?php
namespace Smartforms;

/**
 * Class Block_Editor_Loader
 *
 * Handles Gutenberg block loading.
 */
class Block_Editor_Loader {
	public function __construct() {
		add_action( 'init', array( $this, 'register_blocks' ) );
	}

	public function register_blocks() {
		// Register block assets
		wp_register_script(
			'smartforms-block-editor',
			plugins_url( '/blocks/form-block/index.js', dirname( __FILE__, 2 ) ),
			array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components' ),
			'1.0.0',
			true
		);

		wp_register_style(
			'smartforms-block-editor',
			plugins_url( '/blocks/form-block/editor.css', dirname( __FILE__, 2 ) ),
			array( 'wp-edit-blocks' ),
			'1.0.0'
		);

		wp_register_style(
			'smartforms-block-frontend',
			plugins_url( '/blocks/form-block/style.css', dirname( __FILE__, 2 ) ),
			array(),
			'1.0.0'
		);

		// Register the block
		register_block_type(
			'smartforms/form-field',
			array(
				'editor_script' => 'smartforms-block-editor',
				'editor_style'  => 'smartforms-block-editor',
				'style'         => 'smartforms-block-frontend',
			)
		);
	}
}
