<?php
/**
 * Core plugin functionality for SmartForms.
 *
 * Initializes components, enqueues assets, and handles activation/deactivation.
 *
 * @package SmartForms
 */

namespace SmartForms\Core;

class SmartForms {

	/**
	 * Singleton instance of the SmartForms plugin.
	 *
	 * @var SmartForms|null
	 */
	private static $instance = null;

	/**
	 * Returns the singleton instance.
	 *
	 * @return SmartForms
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Activation hook.
	 *
	 * Adds default options and flushes rewrite rules.
	 *
	 * @return void
	 */
	public static function activate() {
		add_option( 'smartforms_version', '1.0.0' );
		flush_rewrite_rules();
	}

	/**
	 * Deactivation hook.
	 *
	 * Removes options and flushes rewrite rules.
	 *
	 * @return void
	 */
	public static function deactivate() {
		delete_option( 'smartforms_version' );
		flush_rewrite_rules();
	}

	/**
	 * Constructor.
	 *
	 * Hooks into WP actions to enqueue assets, initialize components,
	 * and register page templates.
	 */
	private function __construct() {
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		$this->initialize_classes();
		add_filter( 'theme_page_templates', array( $this, 'register_template' ) );
		add_filter( 'template_include', array( $this, 'load_template' ) );
	}

	/**
	 * Initializes other plugin classes.
	 *
	 * Instantiates classes for block editor, AJAX handler, custom post types, etc.
	 *
	 * @return void
	 */
	private function initialize_classes() {
		if ( is_admin() ) {
			\SmartForms\Core\BlockEditorLoader::get_instance();
		}
		\SmartForms\Core\SmartFormsHandler::get_instance();
		if ( class_exists( 'SmartForms\\Admin\\AdminMenu' ) ) {
			new \SmartForms\Admin\AdminMenu();
		}
		if ( class_exists( 'SmartForms\\CPT\\FormCPT' ) ) {
			new \SmartForms\CPT\FormCPT();
		}
		if ( class_exists( 'SmartForms\\Admin\\MetaBox' ) ) {
			\SmartForms\Admin\MetaBox::get_instance();
		}
		if ( class_exists( 'SmartForms\\Core\\API' ) ) {
			new \SmartForms\Core\API();
		}
		if ( class_exists( 'SmartForms\\CPT\\ChatUISettings' ) ) {
			\SmartForms\CPT\ChatUISettings::get_instance();
		}
	}

	/**
	 * Enqueues CSS and JS assets.
	 *
	 * Now enqueues JustValidate (a vanilla JS validation library) and our custom chat UI script.
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
		// Enqueue Font Awesome.
		wp_enqueue_style(
			'fontawesome',
			'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
			array(),
			'6.4.0'
		);
		// Enqueue JustValidate for form validation (vanilla JS, no jQuery).
		wp_enqueue_script(
			'just-validate',
			'https://cdn.jsdelivr.net/npm/just-validate@2.2.0/dist/just-validate.production.min.js',
			array(),
			'2.2.0',
			true
		);
		// Enqueue our Chat UI script.
		wp_enqueue_script(
			'smartforms-chatui',
			plugins_url( 'build/js/smartforms-chat.js', dirname( __FILE__, 3 ) . '/smartforms.php' ),
			array( 'wp-element', 'just-validate' ),
			'1.0.0',
			true
		);
		// Enqueue the generated Chat UI CSS file.
		wp_enqueue_style(
			'smartforms-chat',
			plugins_url( 'build/css/smartforms-chat.css', dirname( __FILE__, 3 ) . '/smartforms.php' ),
			array( 'bootstrap-css', 'fontawesome' ),
			'1.0.0'
		);
		// Localize the Chat UI script.
		wp_localize_script(
			'smartforms-chatui',
			'smartformsData',
			array(
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonce'   => wp_create_nonce( 'smartform_submit' ),
			)
		);
	}

	/**
	 * Registers a custom page template for SmartForms.
	 *
	 * @param array $templates Existing page templates.
	 * @return array Modified page templates.
	 */
	public function register_template( $templates ) {
		$templates['templates/single-smart_form.php'] = __( 'SmartForms Chat UI', 'smartforms' );
		return $templates;
	}

	/**
	 * Loads the custom template for SmartForms single posts.
	 *
	 * @param string $template The current template path.
	 * @return string New template path if applicable.
	 */
	public function load_template( $template ) {
		if ( is_singular( 'smart_form' ) ) {
			$custom_template = dirname( __DIR__, 2 ) . '/templates/single-smart_form.php';
			if ( file_exists( $custom_template ) ) {
				return $custom_template;
			}
		}
		return $template;
	}

	/**
	 * Logs messages and errors for debugging purposes.
	 *
	 * Only logs if WP_DEBUG is enabled.
	 *
	 * @param string         $message  The log message.
	 * @param \WP_Error|null $wp_error Optional WP_Error object.
	 * @return void
	 */
	public static function log_error( $message, $wp_error = null ) {
		if ( ! defined( 'WP_DEBUG' ) || ! WP_DEBUG ) {
			return;
		}
		$message = is_string( $message ) ? sanitize_text_field( $message ) : wp_json_encode( $message );
		if ( is_wp_error( $wp_error ) ) {
			$error_messages = implode( ' | ', $wp_error->get_error_messages() );
			$message       .= ' | WP_Error: ' . sanitize_text_field( $error_messages );
		}
		$log_entry = sprintf(
			'[%s] SmartForms: %s',
			wp_date( 'Y-m-d H:i:s' ),
			$message
		);
		error_log( $log_entry );
	}
}

// Initialize the plugin.
SmartForms::get_instance();

// Register activation and deactivation hooks.
register_activation_hook( dirname( __DIR__, 2 ) . '/smartforms.php', array( '\SmartForms\Core\SmartForms', 'activate' ) );
register_deactivation_hook( dirname( __DIR__, 2 ) . '/smartforms.php', array( '\SmartForms\Core\SmartForms', 'deactivate' ) );
