<?php
/**
 * Core plugin functionality.
 *
 * Handles plugin initialization, activation, and admin setup.
 *
 * @package SmartForms
 */

namespace Smartforms;

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
			// Uncomment the following line if logging is needed in a development environment.
			// error_log( 'SmartForms: Singleton instance created.' );
		}
		return self::$instance;
	}

	/**
	 * Activation hook for the plugin.
	 *
	 * @return void
	 */
	public static function activate() {
		add_option( 'smartforms_version', '1.0.0' );
		// Uncomment the following line if logging is needed in a development environment.
		// error_log( 'SmartForms: Plugin activated.' );
	}

	/**
	 * Deactivation hook for the plugin.
	 *
	 * @return void
	 */
	public static function deactivate() {
		delete_option( 'smartforms_version' );
		// Uncomment the following line if logging is needed in a development environment.
		// error_log( 'SmartForms: Plugin deactivated.' );
	}

	/**
	 * Constructor.
	 *
	 * Initializes the plugin and admin-specific functionality.
	 */
	private function __construct() {
		// Uncomment the following line if logging is needed in a development environment.
		// error_log( 'SmartForms: Constructor called.' );

		if ( is_admin() ) {
			// Uncomment the following line if logging is needed in a development environment.
			// error_log( 'SmartForms: Admin environment detected.' );

			add_action( 'init', array( $this, 'initialize_admin' ) );
			add_action( 'init', array( $this, 'register_custom_post_type' ) );
		}
	}

	/**
	 * Initialize admin functionality.
	 *
	 * @return void
	 */
	public function initialize_admin() {
		// Uncomment the following line if logging is needed in a development environment.
		// error_log( 'SmartForms: Initializing admin functionality.' );

		if ( class_exists( 'Smartforms\Admin_Menu' ) ) {
			new Admin_Menu();
		} else {
			// Uncomment the following line if logging is needed in a development environment.
			// error_log( 'SmartForms: Admin_Menu class not found.' );
		}
	}

	/**
	 * Register the custom post type for forms.
	 *
	 * @return void
	 */
	public function register_custom_post_type() {
		register_post_type(
			'smart_form',
			array(
				'label'    => 'Forms',
				'public'   => false,
				'show_ui'  => false, // Hide it from the default admin menu.
				'supports' => array( 'title', 'editor' ),
				'rewrite'  => false,
			)
		);

		// Uncomment the following line if logging is needed in a development environment.
		// error_log( "SmartForms: Custom post type 'smart_form' registered." );
	}
}
