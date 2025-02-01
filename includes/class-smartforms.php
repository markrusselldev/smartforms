<?php
/**
 * Core plugin functionality.
 *
 * @package SmartForms
 */

namespace SmartForms;

// Ensure the required classes are included.
require_once plugin_dir_path( __FILE__ ) . 'class-block-editor-loader.php';
require_once plugin_dir_path( __FILE__ ) . 'class-smartforms-handler.php';
require_once plugin_dir_path( __FILE__ ) . 'class-admin-menu.php';
require_once plugin_dir_path( __FILE__ ) . 'cpt/form.php';

/**
 * Main SmartForms class.
 *
 * This is the central class for the SmartForms plugin. It initializes all
 * components, manages activation/deactivation hooks, and loads the CPT.
 */
class SmartForms {

	/**
	 * Singleton instance of the plugin.
	 *
	 * @var SmartForms|null
	 */
	private static $instance = null;

	/**
	 * Get or create the singleton instance.
	 *
	 * @return SmartForms The singleton instance.
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
		// Store the plugin version in the options table.
		add_option( 'smartforms_version', '1.0.0' );

		// Flush rewrite rules to ensure CPT permalinks work correctly.
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
		// Remove the stored plugin version.
		delete_option( 'smartforms_version' );

		// Flush rewrite rules to clean up CPT permalinks.
		flush_rewrite_rules();
	}

	/**
	 * Constructor.
	 *
	 * Initializes the plugin components and hooks into WordPress actions.
	 */
	private function __construct() {
		// Initialize related plugin classes.
		$this->initialize_classes();
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
		SmartForms_Handler::get_instance();

		// Initialize the Admin Menu class.
		if ( class_exists( 'SmartForms\\Admin_Menu' ) ) {
			new Admin_Menu();
		}
	}
}

// Initialize the SmartForms plugin.
SmartForms::get_instance();

// Register activation and deactivation hooks.
register_activation_hook( __FILE__, array( 'SmartForms\\SmartForms', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'SmartForms\\SmartForms', 'deactivate' ) );
