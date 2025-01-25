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
	}

	/**
	 * Deactivation hook for the plugin.
	 *
	 * @return void
	 */
	public static function deactivate() {
		delete_option( 'smartforms_version' );
	}

	/**
	 * Constructor.
	 *
	 * Initializes the plugin and admin-specific functionality.
	 */
	private function __construct() {
		if ( is_admin() ) {
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
		if ( class_exists( 'Smartforms\\Admin_Menu' ) ) {
			new Admin_Menu();
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
				'label'        => esc_html__( 'Forms', 'smartforms' ),
				'public'       => false,
				'show_ui'      => true,
				'show_in_menu' => false, // Prevents the "Forms" menu from appearing in the admin sidebar.
				'show_in_rest' => true,
				'supports'     => array( 'title', 'editor', 'custom-fields' ),
				'rewrite'      => false,
			)
		);
	}
}
