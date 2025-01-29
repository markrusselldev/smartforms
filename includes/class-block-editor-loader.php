<?php
/**
 * Handles Gutenberg block loading for SmartForms.
 *
 * @package SmartForms
 */

namespace Smartforms;

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
		add_action( 'enqueue_block_editor_assets', array( $this, 'conditionally_register_blocks' ) );
		add_filter( 'block_categories_all', array( $this, 'add_smartforms_block_category' ), 10, 2 );
	}

	/**
	 * Conditionally register blocks only inside SmartForms post type editor.
	 *
	 * @return void
	 */
	public function conditionally_register_blocks() {
		$screen = get_current_screen();

		if ( $screen && isset( $screen->post_type ) && 'smart_form' === $screen->post_type ) {
			$this->register_blocks();
		}
	}

	/**
	 * Register all SmartForms blocks dynamically.
	 *
	 * Scans the build directory for blocks and registers them.
	 *
	 * @return void
	 */
	private function register_blocks() {
		$blocks_dir = plugin_dir_path( __FILE__ ) . '../build/';

		// Log the directory being scanned.
		error_log( '[DEBUG] Registering blocks from directory: ' . esc_url( $blocks_dir ) );

		// Check if the build directory exists.
		if ( ! is_dir( $blocks_dir ) ) {
			error_log( '[ERROR] SmartForms build directory not found: ' . esc_url( $blocks_dir ) );
			return;
		}

		// Scan for subdirectories in the build directory.
		$block_folders = glob( $blocks_dir . '*', GLOB_ONLYDIR );

		// Register each block based on its block.json file.
		foreach ( $block_folders as $block_folder ) {
			$block_json_path = $block_folder . '/block.json';

			if ( file_exists( $block_json_path ) ) {
				$result = register_block_type_from_metadata( $block_json_path );

				/**
				 * Check if $result is a WP_Error before calling get_error_message().
				 *
				 * @var \WP_Error $result
				 */
				if ( is_wp_error( $result ) ) {
					error_log(
						'[ERROR] Failed to register block: ' . esc_url( $block_folder ) .
						' - ' . esc_html( $result->get_error_message() )
					);
				} else {
					error_log( '[DEBUG] Block successfully registered: ' . esc_url( $block_json_path ) );
				}
			} else {
				// Log if block.json is not found.
				error_log( '[ERROR] block.json not found in: ' . esc_url( $block_folder ) );
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

		// Define the SmartForms category.
		$smartforms_category = array(
			'slug'  => 'smartforms',
			'title' => __( 'SmartForms Blocks', 'smartforms' ),
		);

		// Prepend the SmartForms category to the categories list.
		array_unshift( $categories, $smartforms_category );

		// Log the updated categories list for debugging.
		error_log( '[DEBUG] SmartForms block category moved to the top.' );

		return $categories;
	}
} // End of class
