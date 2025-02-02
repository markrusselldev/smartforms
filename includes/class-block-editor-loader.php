<?php
/**
 * Handles Gutenberg block loading for SmartForms.
 *
 * @package SmartForms
 */

namespace SmartForms;

/**
 * Block Editor Loader Class.
 *
 * Dynamically registers Gutenberg blocks inside the SmartForms editor.
 */
class Block_Editor_Loader {

	/**
	 * Singleton instance.
	 *
	 * @var Block_Editor_Loader|null
	 */
	private static $instance = null;

	/**
	 * Get or create the singleton instance.
	 *
	 * @return Block_Editor_Loader The singleton instance.
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
	 * Hooks into WordPress actions and filters to load blocks inside the SmartForms editor.
	 */
	private function __construct() {
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_assets' ) );
		add_action( 'init', array( $this, 'register_blocks' ) );
		add_filter( 'block_categories_all', array( $this, 'add_smartforms_block_category' ), 10, 2 );
	}

	/**
	 * Register all SmartForms blocks dynamically.
	 *
	 * Scans the `build/blocks/` directory for `block.json` files and registers them.
	 *
	 * @return void
	 */
	public function register_blocks() {
		$blocks_dir = plugin_dir_path( __FILE__ ) . '../build/blocks/';

		// Ensure the directory exists.
		if ( ! is_dir( $blocks_dir ) ) {
			error_log( '[ERROR] SmartForms blocks directory not found: ' . esc_url( $blocks_dir ) );
			return;
		}

		// Get all block folders inside `build/blocks/`.
		$block_folders = scandir( $blocks_dir );

		if ( false === $block_folders || empty( $block_folders ) ) {
			error_log( '[ERROR] No valid blocks found inside build/blocks/ directory.' );
			return;
		}

		// Register each block found.
		foreach ( $block_folders as $folder ) {
			if ( '.' === $folder || '..' === $folder ) {
				continue;
			}

			$block_path = $blocks_dir . $folder;

			if ( is_dir( $block_path ) && file_exists( $block_path . '/block.json' ) ) {
				$result = register_block_type_from_metadata( $block_path );

				// Ensure `$result` is an instance of `WP_Error` before calling `get_error_message()`.
				if ( is_wp_error( $result ) ) {
					/**
					 * Handles block registration errors.
					 *
					 * Ensures the error is properly logged if block registration fails.
					 *
					 * @var \WP_Error $result WordPress error object containing details of the error.
					 */
					error_log(
						sprintf(
							'[ERROR] Failed to register block: %s - %s',
							esc_url( $block_path ),
							esc_html( $result->get_error_message() )
						)
					);
				} else {
					error_log( '[DEBUG] Block successfully registered: ' . esc_url( $block_path ) );
				}
			} else {
				error_log( '[ERROR] block.json not found in: ' . esc_url( $block_path ) );
			}
		}
	}

	/**
	 * Enqueue block editor scripts and styles for SmartForms blocks.
	 *
	 * Ensures that each block's JavaScript and CSS files are properly enqueued.
	 *
	 * @return void
	 */
	public function enqueue_block_assets() {
		$build_dir = plugin_dir_path( __FILE__ ) . '../build/blocks/';

		// Ensure the directory exists.
		if ( ! is_dir( $build_dir ) ) {
			error_log( '[ERROR] SmartForms build directory not found for assets: ' . esc_url( $build_dir ) );
			return;
		}

		// Scan each block folder inside build/blocks/ and enqueue assets if they exist.
		$block_folders = scandir( $build_dir );

		if ( false === $block_folders || empty( $block_folders ) ) {
			error_log( '[ERROR] No compiled blocks found inside build/blocks/ directory.' );
			return;
		}

		foreach ( $block_folders as $folder ) {
			if ( '.' === $folder || '..' === $folder ) {
				continue;
			}

			$block_path  = $build_dir . $folder;
			$script_path = $block_path . '/index.js';
			$style_path  = $block_path . '/index.css';

			// Enqueue JavaScript.
			if ( file_exists( $script_path ) ) {
				wp_enqueue_script(
					'smartforms-' . $folder . '-editor-script',
					plugins_url( 'build/blocks/' . $folder . '/index.js', __FILE__ ),
					array( 'wp-blocks', 'wp-element', 'wp-editor' ),
					filemtime( $script_path ),
					false
				);
				wp_script_add_data( 'smartforms-' . $folder . '-editor-script', 'type', 'module' );
				error_log( '[DEBUG] Enqueued JS: ' . esc_url( $script_path ) );
			}

			// Enqueue CSS.
			if ( file_exists( $style_path ) ) {
				wp_enqueue_style(
					'smartforms-' . $folder . '-editor-style',
					plugins_url( 'build/blocks/' . $folder . '/index.css', __FILE__ ),
					array(),
					filemtime( $style_path )
				);
				error_log( '[DEBUG] Enqueued CSS: ' . esc_url( $style_path ) );
			}
		}
	}

	/**
	 * Add the SmartForms block category for the SmartForms post type.
	 *
	 * Ensures the SmartForms category appears in the block editor.
	 *
	 * @param array  $categories Existing block categories.
	 * @param object $context    The current editor context.
	 * @return array Modified block categories.
	 */
	public function add_smartforms_block_category( $categories, $context ) {
		error_log( '[DEBUG] Adding SmartForms block category.' );

		$smartforms_category = array(
			'slug'  => 'smartforms',
			'title' => __( 'SmartForms Blocks', 'smartforms' ),
		);

		array_unshift( $categories, $smartforms_category );
		error_log( '[DEBUG] SmartForms block category moved to the top.' );

		return $categories;
	}
} // End of class.
