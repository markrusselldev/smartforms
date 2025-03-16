<?php
/**
 * Handles frontend asset enqueuing for SmartForms blocks.
 *
 * @package SmartForms
 */

namespace SmartForms\Core;

use SmartForms\Core\SmartForms;

class BlockFrontendAssets {

	/**
	 * Singleton instance.
	 *
	 * @var BlockFrontendAssets|null
	 */
	private static $instance = null;

	/**
	 * Returns the singleton instance.
	 *
	 * @return BlockFrontendAssets The singleton instance.
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 *
	 * Hooks into the frontend assets enqueue action.
	 */
	private function __construct() {
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ), 999 );
	}

	/**
	 * Enqueues frontend styles and scripts for SmartForms blocks.
	 *
	 * It scans the build/blocks/ directory for each block’s CSS and a frontend JS file,
	 * enqueuing them as necessary.
	 *
	 * @return void
	 */
	public function enqueue_frontend_assets() {
		// Build the filesystem path to the blocks directory.
		$build_dir = plugin_dir_path( SMARTFORMS_PLUGIN_FILE ) . 'build/blocks/';

		// Get the plugin root URL.
		$plugin_root_url = plugin_dir_url( SMARTFORMS_PLUGIN_FILE );

		if ( ! is_dir( $build_dir ) ) {
			SmartForms::log_error( '[ERROR] SmartForms build directory not found for frontend assets: ' . esc_url( $build_dir ) );
			return;
		}

		$block_folders = scandir( $build_dir );
		if ( false === $block_folders || empty( $block_folders ) ) {
			SmartForms::log_error( '[ERROR] No compiled blocks found inside build/blocks/ directory for frontend assets.' );
			return;
		}

		// Enqueue each block's frontend stylesheet and script if available.
		foreach ( $block_folders as $folder ) {
			if ( '.' === $folder || '..' === $folder ) {
				continue;
			}

			// Enqueue frontend stylesheet if it exists.
			$frontend_style_path = $build_dir . $folder . '/style-index.css';
			if ( file_exists( $frontend_style_path ) ) {
				wp_enqueue_style(
					'smartforms-' . $folder . '-frontend-style',
					plugins_url( 'build/blocks/' . $folder . '/style-index.css', SMARTFORMS_PLUGIN_FILE ),
					array( 'bootstrap-css' ), // Ensuring Bootstrap loads first.
					filemtime( $frontend_style_path )
				);
			}

			// Enqueue frontend JavaScript if it exists.
			$frontend_js_path = $build_dir . $folder . '/frontend.js';
			if ( file_exists( $frontend_js_path ) ) {
				wp_enqueue_script(
					'smartforms-' . $folder . '-frontend-script',
					plugins_url( 'build/blocks/' . $folder . '/frontend.js', SMARTFORMS_PLUGIN_FILE ),
					array(), // Add dependencies here if needed.
					filemtime( $frontend_js_path ),
					true
				);
			}
		}
	}
}

BlockFrontendAssets::get_instance();
