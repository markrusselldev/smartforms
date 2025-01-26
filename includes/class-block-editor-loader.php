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
 * Ensures that Gutenberg blocks and related assets for SmartForms are loaded.
 */
class Block_Editor_Loader {

	/**
	 * Singleton instance.
	 *
	 * @var Block_Editor_Loader|null
	 */
	private static $instance = null;

	/**
	 * Static counter for debugging initialization.
	 *
	 * @var int
	 */
	private static $load_count = 0;

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
	 * Constructor to hook into WordPress actions and filters.
	 *
	 * Initializes the loader by adding the required actions and filters.
	 */
	private function __construct() {
		// Increment the static counter for debugging.
		self::$load_count++;
		error_log( 'Block Editor Loader initialized. Count: ' . self::$load_count );

		// Hook into WordPress to enqueue block assets.
		add_action( 'init', array( $this, 'register_blocks' ) );

		// Add a custom block category for SmartForms blocks.
		add_filter( 'block_categories_all', array( $this, 'add_smartforms_block_category' ), 10, 2 );
	}

	/**
	 * Register blocks using block.json files.
	 *
	 * Automatically registers all blocks in the /blocks/ directory.
	 *
	 * @return void
	 */
	public function register_blocks() {
		// Debug log for block registration.
		error_log( 'Registering SmartForms blocks.' );

		$blocks_dir = plugin_dir_path( __DIR__ ) . 'blocks/';
		$blocks     = scandir( $blocks_dir );

		foreach ( $blocks as $block ) {
			$block_json = $blocks_dir . $block . '/block.json';
			if ( file_exists( $block_json ) ) {
				register_block_type( $block_json );
				error_log( 'Block registered: ' . esc_html( $block ) );
			}
		}
	}

	/**
	 * Add a custom block category for SmartForms blocks.
	 *
	 * Registers a custom block category to group all SmartForms blocks.
	 *
	 * @param array  $categories Existing block categories.
	 * @param object $post       The current post object.
	 * @return array Modified block categories.
	 */
	public function add_smartforms_block_category( $categories, $post ) {
		// Debug log to include request context.
		error_log( 'SmartForms block category is being added.' );

		// Add the SmartForms Blocks category at the top of the list.
		return array_merge(
			array(
				array(
					'slug'  => 'smartforms',
					'title' => esc_html__( 'SmartForms Blocks', 'smartforms' ),
				),
			),
			$categories
		);
	}
}

// Instantiate the Block Editor Loader class.
Block_Editor_Loader::get_instance();
