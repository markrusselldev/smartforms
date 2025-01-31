<?php
/**
 * Plugin Name: SmartForms - AI-Powered Questionnaire
 * Description: A WordPress plugin that enables users to create chatbot-style questionnaires with GPT-powered recommendations.
 * Version: 1.0.0
 * Author: Mark Russell
 * Author URI: https://markrussell.io
 * License: GPL2
 * Text Domain: smartforms
 *
 * @package SmartForms
 */

namespace SmartForms;

// Prevent direct access to the plugin file.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Autoload classes.
spl_autoload_register(
	function ( $class_name ) {
		if ( strpos( $class_name, 'SmartForms\\' ) === 0 ) {
			$relative_class = str_replace( 'SmartForms\\', '', $class_name );
			$file_path      = plugin_dir_path( __FILE__ ) . 'includes/class-' . strtolower( str_replace( '_', '-', $relative_class ) ) . '.php';

			if ( file_exists( $file_path ) ) {
				include_once $file_path;
			}
		}
	}
);

// Activation and deactivation hooks.
register_activation_hook( __FILE__, array( 'SmartForms\\SmartForms', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'SmartForms\\SmartForms', 'deactivate' ) );

// Initialize the plugin.
add_action(
	'plugins_loaded',
	function () {
		SmartForms::get_instance();
	}
);
