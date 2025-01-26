<?php
/**
 * Core plugin functionality.
 *
 * @package SmartForms
 */

namespace Smartforms;

// Ensure the Block Editor Loader class is included.
require_once plugin_dir_path( __FILE__ ) . 'class-block-editor-loader.php';

/**
 * Main SmartForms class.
 */
class Smartforms {

	/**
	 * Singleton instance of the plugin.
	 *
	 * @var Smartforms|null
	 */
	private static $instance = null;

	/**
	 * Get or create the singleton instance.
	 *
	 * @return Smartforms The singleton instance.
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Activation hook for the plugin.
	 *
	 * Sets up the plugin, such as adding default options.
	 *
	 * @return void
	 */
	public static function activate() {
		add_option( 'smartforms_version', '1.0.0' );

		// Register the custom post type to flush rewrite rules on activation.
		self::register_custom_post_type();
		flush_rewrite_rules();
	}

	/**
	 * Deactivation hook for the plugin.
	 *
	 * Cleans up the plugin, such as removing options.
	 *
	 * @return void
	 */
	public static function deactivate() {
		delete_option( 'smartforms_version' );

		// Flush rewrite rules to clean up the custom post type.
		flush_rewrite_rules();
	}

	/**
	 * Constructor.
	 *
	 * Initializes the plugin components and hooks.
	 */
	private function __construct() {
		// Register the custom post type.
		add_action( 'init', array( $this, 'register_custom_post_type' ) );

		// Initialize the admin menu.
		new Admin_Menu();

		// Initialize the form handler.
		new SmartForms_Handler();

		// Initialize the block editor loader.
		//new Block_Editor_Loader();
		Block_Editor_Loader::get_instance();
	}

	/**
	 * Register the custom post type for forms.
	 *
	 * Ensures the custom post type is properly linked to the SmartForms menu.
	 *
	 * @return void
	 */
	public static function register_custom_post_type() {
		register_post_type(
			'smart_form',
			array(
				'labels' => array(
					'name'               => esc_html__( 'SmartForms', 'smartforms' ),
					'singular_name'      => esc_html__( 'Form', 'smartforms' ),
					'add_new'            => esc_html__( 'Add New Form', 'smartforms' ),
					'add_new_item'       => esc_html__( 'Add New Form', 'smartforms' ),
					'edit_item'          => esc_html__( 'Edit Form', 'smartforms' ),
					'new_item'           => esc_html__( 'New Form', 'smartforms' ),
					'view_item'          => esc_html__( 'View Form', 'smartforms' ),
					'view_items'         => esc_html__( 'View Forms', 'smartforms' ),
					'search_items'       => esc_html__( 'Search Forms', 'smartforms' ),
					'all_items'          => esc_html__( 'Forms', 'smartforms' ), // Renamed to Forms.
					'not_found'          => esc_html__( 'No forms found.', 'smartforms' ),
					'not_found_in_trash' => esc_html__( 'No forms found in Trash.', 'smartforms' ),
				),
				'public'       => false,
				'show_ui'      => true,
				'show_in_menu' => 'smartforms', // Attach the custom post type under the SmartForms menu.
				'show_in_rest' => true, // Enable REST API for the block editor.
				'supports'     => array( 'title', 'editor', 'custom-fields' ),
				'rewrite'      => false,
			)
		);
	}
}
