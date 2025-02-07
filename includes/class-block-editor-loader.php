<?php
/**
 * Handles Gutenberg block loading for SmartForms.
 *
 * @package SmartForms
 */

namespace SmartForms;

use WP_Error;

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
		add_filter( 'block_categories_all', array( $this, 'add_smartforms_block_category' ), 10, 1 );
	}

	/**
	 * Register all SmartForms blocks dynamically.
	 *
	 * Scans the `build/blocks/` directory for `block.json` files and registers them.
	 *
	 * @return void
	 */
	public function register_blocks() {
		if ( did_action( 'init' ) > 1 ) {
			return;
		}

		$blocks = array(
			'smartforms-text',
			'smartforms-number',
			'smartforms-radio',
			'smartforms-checkbox',
			'smartforms-select',
			'smartforms-slider',
			'smartforms-textarea',
			'smartforms-group',
			'smartforms-progress',
		);

		foreach ( $blocks as $block ) {
			$block_path = dirname( __DIR__ ) . '/build/blocks/' . $block;

			// Ensure block.json exists before registration.
			if ( file_exists( $block_path . '/block.json' ) ) {
				$result = register_block_type_from_metadata( $block_path );

				/**
				 * Handles block registration errors.
				 *
				 * @var WP_Error $result Ensures Intelephense recognizes this as WP_Error.
				 */
				if ( is_wp_error( $result ) ) {
					SmartForms::log_error(
						sprintf(
							'Failed to register block: %s - %s',
							esc_url( $block_path ),
							$result->get_error_message() // Intelephense needs the comment above to recognize this method.
						),
						$result
					);
				} else {
					SmartForms::log_error( '[DEBUG] Block successfully registered: ' . esc_url( $block_path ) );
				}
			} else {
				SmartForms::log_error( '[ERROR] block.json not found in: ' . esc_url( $block_path ) );
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

		if ( ! is_dir( $build_dir ) ) {
			SmartForms::log_error( '[ERROR] SmartForms build directory not found for assets: ' . esc_url( $build_dir ) );
			return;
		}

		$block_folders = scandir( $build_dir );
		if ( false === $block_folders || empty( $block_folders ) ) {
			SmartForms::log_error( '[ERROR] No compiled blocks found inside build/blocks/ directory.' );
			return;
		}

		foreach ( $block_folders as $folder ) {
			if ( '.' === $folder || '..' === $folder ) {
				continue;
			}

			$block_path  = $build_dir . $folder;
			$script_path = $block_path . '/index.js';
			$style_path  = $block_path . '/index.css';

			if ( file_exists( $script_path ) ) {
				wp_enqueue_script(
					'smartforms-' . $folder . '-editor-script',
					plugins_url( 'build/blocks/' . $folder . '/index.js', dirname( __DIR__ ) . '/smartforms.php' ),
					array( 'wp-blocks', 'wp-element', 'wp-editor' ),
					filemtime( $script_path ),
					true
				);
				wp_script_add_data( 'smartforms-' . $folder . '-editor-script', 'type', 'module' );
			}

			if ( file_exists( $style_path ) ) {
				wp_enqueue_style(
					'smartforms-' . $folder . '-editor-style',
					plugins_url( 'build/blocks/' . $folder . '/index.css', dirname( __DIR__ ) . '/smartforms.php' ),
					array(),
					filemtime( $style_path )
				);
			}
		}
	}

	/**
	 * Add the SmartForms block category for the SmartForms post type.
	 *
	 * Ensures the SmartForms category appears in the block editor.
	 *
	 * @param array $categories Existing block categories.
	 * @return array Modified block categories.
	 */
	public function add_smartforms_block_category( $categories ) {
		SmartForms::log_error( '[DEBUG] Adding SmartForms block category.' );

		$smartforms_category = array(
			'slug'  => 'smartforms',
			'title' => __( 'SmartForms Blocks', 'smartforms' ),
		);

		array_unshift( $categories, $smartforms_category );
		SmartForms::log_error( '[DEBUG] SmartForms block category moved to the top.' );

		return $categories;
	}
}
