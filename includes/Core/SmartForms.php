<?php
/**
 * Core plugin functionality for SmartForms.
 *
 * @package SmartForms
 */

namespace SmartForms\Core;

// Since we're using Composer's autoloader, we no longer need manual require_once calls.
// All classes (BlockEditorLoader, SmartFormsHandler, AdminMenu, etc.) will be autoloaded.

/**
 * Main SmartForms class.
 *
 * This class initializes all components, manages activation/deactivation hooks, and centralizes logging.
 * It uses the singleton pattern so that it is only instantiated once.
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
		// Enqueue assets.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		// Initialize related plugin classes.
		$this->initialize_classes();
		// Register page template for SmartForms.
		add_filter( 'theme_page_templates', array( $this, 'register_template' ) );
		add_filter( 'template_include', array( $this, 'load_template' ) );
	}

	/**
	 * Initialize other plugin classes.
	 *
	 * Loads and initializes all necessary classes for the plugin.
	 * Each class is instantiated only once:
	 * - Singleton classes (BlockEditorLoader, SmartFormsHandler, MetaBox) are accessed via get_instance().
	 * - Other classes (AdminMenu, FormCPT, API) are instantiated with new only once here.
	 *
	 * @return void
	 */
	private function initialize_classes() {
		// Initialize the Block Editor Loader (singleton).
		\SmartForms\Core\BlockEditorLoader::get_instance();
		// Initialize the SmartForms Handler (singleton).
		\SmartForms\Core\SmartFormsHandler::get_instance();
		// Initialize the Admin Menu class (instantiated once).
		if ( class_exists( 'SmartForms\\Admin\\AdminMenu' ) ) {
			new \SmartForms\Admin\AdminMenu();
		}
		// Initialize the Custom Post Type class (instantiated once).
		if ( class_exists( 'SmartForms\\CPT\\FormCPT' ) ) {
			new \SmartForms\CPT\FormCPT();
		}
		// Initialize the MetaBox class (singleton).
		if ( class_exists( 'SmartForms\\Admin\\MetaBox' ) ) {
			\SmartForms\Admin\MetaBox::get_instance();
		}
		// Initialize the API endpoints (instantiated once).
		if ( class_exists( 'SmartForms\\Core\\API' ) ) {
			new \SmartForms\Core\API();
		}
		// Initialize the settings for our "form" custom post type.
		if ( class_exists( 'SmartForms\\CPT\\SmartFormsCPTSettings' ) ) {
			\SmartForms\CPT\SmartFormsCPTSettings::get_instance();
		}
	}

	/**
	 * Enqueue Bootstrap styles and scripts.
	 *
	 * This method ensures that Bootstrap is available for frontend rendering.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		// Enqueue Bootstrap CSS.
		wp_enqueue_style(
			'bootstrap-css',
			'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
			array(),
			'5.3.3'
		);
		// Enqueue Bootstrap JavaScript.
		wp_enqueue_script(
			'bootstrap-js',
			'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
			array(),
			'5.3.3',
			true
		);
	}

	/**
	 * Registers the SmartForms template so it appears in the page template dropdown.
	 *
	 * @param array $templates List of existing templates.
	 * @return array Updated list of templates.
	 */
	public function register_template( $templates ) {
		$templates['templates/single-smart_form.php'] = __( 'SmartForms Chat UI', 'smartforms' );
		return $templates;
	}

	/**
	 * Loads the correct template for SmartForms single posts.
	 *
	 * @param string $template The existing template path.
	 * @return string The new template path if SmartForms post type is detected.
	 */
	public function load_template( $template ) {
		if ( is_singular( 'smart_form' ) ) {
			// Since this file is now in includes/Core, go up two levels to the plugin root.
			$custom_template = dirname( __DIR__, 2 ) . '/templates/single-smart_form.php';
			if ( file_exists( $custom_template ) ) {
				return $custom_template;
			}
		}
		return $template;
	}

	/**
	 * Logs errors and debug messages with WP_DEBUG check.
	 *
	 * Ensures errors are logged only when WP_DEBUG is enabled.
	 *
	 * @param string         $message  The log message.
	 * @param \WP_Error|null $wp_error Optional WP_Error object for additional details.
	 * @return void
	 */
	public static function log_error( $message, $wp_error = null ) {
		if ( ! defined( 'WP_DEBUG' ) || ! WP_DEBUG ) {
			return;
		}
		// Sanitize the message.
		$message = is_string( $message ) ? sanitize_text_field( $message ) : wp_json_encode( $message );
		// Append WP_Error details if provided.
		if ( is_wp_error( $wp_error ) ) {
			$error_messages = implode( ' | ', $wp_error->get_error_messages() );
			$message       .= ' | WP_Error: ' . sanitize_text_field( $error_messages );
		}
		// Format log entry with timestamp.
		$log_entry = sprintf(
			'[%s] SmartForms: %s',
			wp_date( 'Y-m-d H:i:s' ),
			$message
		);
		error_log( $log_entry );
	}
}

// Initialize the SmartForms plugin.
SmartForms::get_instance();

// Register activation and deactivation hooks using the correct namespace.
register_activation_hook( dirname( __DIR__, 2 ) . '/smartforms.php', array( '\SmartForms\Core\SmartForms', 'activate' ) );
register_deactivation_hook( dirname( __DIR__, 2 ) . '/smartforms.php', array( '\SmartForms\Core\SmartForms', 'deactivate' ) );
