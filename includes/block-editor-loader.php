<?php
/**
 * Handles Gutenberg block loading.
 *
 * @package SmartForms
 */

namespace Smartforms;

/**
 * Block Editor Loader Class
 */
class Block_Editor_Loader {

	/**
	 * Constructor to hook into WordPress actions.
	 */
	public function __construct() {
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_assets' ) );
	}

	/**
	 * Enqueue Gutenberg block editor assets.
	 *
	 * @return void
	 */
	public function enqueue_block_assets() {
		// Enqueue block editor JavaScript.
		wp_enqueue_script(
			'smartforms-block-editor',
			plugins_url( '/blocks/form-block/index.js', __DIR__ . '/..' ),
			array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components' ),
			'1.0.0',
			true
		);

		// Enqueue block editor styles.
		wp_enqueue_style(
			'smartforms-block-editor',
			plugins_url( '/blocks/form-block/editor.css', __DIR__ . '/..' ),
			array( 'wp-edit-blocks' ),
			'1.0.0'
		);

		// Enqueue frontend styles for the block.
		wp_enqueue_style(
			'smartforms-block-frontend',
			plugins_url( '/blocks/form-block/style.css', __DIR__ . '/..' ),
			array(),
			'1.0.0'
		);
	}
}

new Block_Editor_Loader();
