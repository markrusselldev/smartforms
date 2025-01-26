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
	 * Sets up the plugin, such as adding default options.
	 *
	 * @return void
	 */
	public static function activate() {
		// Set a default option for plugin version.
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
		// Remove plugin version option.
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
		// Initialize the admin menu.
		new Admin_Menu();

		// Initialize the form handler.
		new SmartForms_Handler();

		// Register the custom post type.
		add_action( 'init', array( $this, 'register_custom_post_type' ) );
	}

	/**
	 * Register the custom post type for forms.
	 *
	 * @return void
	 */
	public static function register_custom_post_type() {
		register_post_type(
			'smart_form',
			array(
				'label'        => esc_html__( 'Forms', 'smartforms' ),
				'public'       => false,
				'show_ui'      => true,
				'show_in_menu' => false, // We'll manage the menu ourselves.
				'show_in_rest' => true,
				'supports'     => array( 'title', 'editor', 'custom-fields' ),
				'rewrite'      => false,
			)
		);
	}
}
