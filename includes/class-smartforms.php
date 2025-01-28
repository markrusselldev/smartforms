<?php
/**
 * Core plugin functionality.
 *
 * @package SmartForms
 */

namespace Smartforms;

// Ensure the required classes are included.
require_once plugin_dir_path( __FILE__ ) . 'class-block-editor-loader.php';
require_once plugin_dir_path( __FILE__ ) . 'class-smartforms-handler.php';
require_once plugin_dir_path( __FILE__ ) . 'class-admin-menu.php';

/**
 * Main SmartForms class.
 *
 * This is the central class for the SmartForms plugin. It initializes all
 * components, registers custom post types, and manages activation and
 * deactivation hooks.
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
	 * Adds default options and flushes rewrite rules.
	 *
	 * @return void
	 */
	public static function activate() {
		add_option( 'smartforms_version', '1.0.0' );

		// Register the custom post type to ensure it's available during activation.
		self::register_custom_post_type();
		flush_rewrite_rules();
	}

	/**
	 * Deactivation hook for the plugin.
	 *
	 * Cleans up options and flushes rewrite rules.
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
	 * Initializes the plugin components and hooks into WordPress actions.
	 */
	private function __construct() {
		// Register the custom post type.
		add_action( 'init', array( $this, 'register_custom_post_type' ) );

		// Initialize related plugin classes.
		$this->initialize_classes();
	}

	/**
	 * Register the custom post type for SmartForms.
	 *
	 * Creates a custom post type for managing forms in the plugin.
	 *
	 * @return void
	 */
	public static function register_custom_post_type() {
		register_post_type(
			'smart_form',
			array(
				'labels'       => array(
					'name'               => esc_html__( 'SmartForms', 'smartforms' ),
					'singular_name'      => esc_html__( 'Form', 'smartforms' ),
					'add_new'            => esc_html__( 'Add New Form', 'smartforms' ),
					'add_new_item'       => esc_html__( 'Add New Form', 'smartforms' ),
					'edit_item'          => esc_html__( 'Edit Form', 'smartforms' ),
					'new_item'           => esc_html__( 'New Form', 'smartforms' ),
					'view_item'          => esc_html__( 'View Form', 'smartforms' ),
					'view_items'         => esc_html__( 'View Forms', 'smartforms' ),
					'search_items'       => esc_html__( 'Search Forms', 'smartforms' ),
					'all_items'          => esc_html__( 'Forms', 'smartforms' ),
					'not_found'          => esc_html__( 'No forms found.', 'smartforms' ),
					'not_found_in_trash' => esc_html__( 'No forms found in Trash.', 'smartforms' ),
				),
				'public'       => false,
				'show_ui'      => true,
				'show_in_menu' => 'smartforms',
				'show_in_rest' => true,
				'supports'     => array( 'title', 'editor', 'custom-fields' ),
				'rewrite'      => false,
			)
		);
	}

	/**
	 * Initialize other plugin classes.
	 *
	 * Loads and initializes all necessary classes for the plugin.
	 *
	 * @return void
	 */
	private function initialize_classes() {
		// Initialize the Block Editor Loader class.
		Block_Editor_Loader::get_instance();

		// Initialize the SmartForms Handler class.
		Smartforms_Handler::get_instance();

		// Initialize the Admin Menu class.
		if ( class_exists( 'Smartforms\\Admin_Menu' ) ) {
			new Admin_Menu();
		}
	}
}

// Initialize the SmartForms plugin.
Smartforms::get_instance();

// Register activation and deactivation hooks.
register_activation_hook( __FILE__, array( 'Smartforms\\Smartforms', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'Smartforms\\Smartforms', 'deactivate' ) );
