<?php
/**
 * Handles frontend asset enqueuing for SmartForms blocks.
 *
 * @package SmartForms
 */

namespace SmartForms\Core;

/**
 * Block Frontend Assets Class.
 *
 * Enqueues the frontend stylesheet (style-index.css) for each SmartForms block.
 */
class BlockFrontendAssets {

	/**
	 * Singleton instance.
	 *
	 * @var BlockFrontendAssets|null
	 */
	private static $instance = null;

	/**
	 * Get or create the singleton instance.
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
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ) );
	}

	/**
	 * Enqueue frontend styles for SmartForms blocks.
	 *
	 * Enqueues the frontend stylesheet (style-index.css) for each block.
	 *
	 * @return void
	 */
	public function enqueue_frontend_assets() {
		// Build the filesystem path to the blocks directory.
		$build_dir = plugin_dir_path( SMARTFORMS_PLUGIN_FILE ) . 'build/blocks/';

		// Get the plugin root URL.
		$plugin_root_url = plugin_dir_url( SMARTFORMS_PLUGIN_FILE );

		if ( ! is_dir( $build_dir ) ) {
			\SmartForms\Core\SmartForms::log_error( '[ERROR] SmartForms build directory not found for frontend assets: ' . esc_url( $build_dir ) );
			return;
		}

		$block_folders = scandir( $build_dir );
		if ( false === $block_folders || empty( $block_folders ) ) {
			\SmartForms\Core\SmartForms::log_error( '[ERROR] No compiled blocks found inside build/blocks/ directory for frontend assets.' );
			return;
		}

		// Enqueue each block's frontend stylesheet.
		foreach ( $block_folders as $folder ) {
			if ( '.' === $folder || '..' === $folder ) {
				continue;
			}

			// Build the full filesystem path to the frontend style.
			$frontend_style_path = $build_dir . $folder . '/style-index.css';
			if ( file_exists( $frontend_style_path ) ) {
				wp_enqueue_style(
					'smartforms-' . $folder . '-frontend-style',
					plugins_url( 'build/blocks/' . $folder . '/style-index.css', SMARTFORMS_PLUGIN_FILE ),
					array(),
					filemtime( $frontend_style_path )
				);
			}
		}
	}
}
