<?php
/**
 * Plugin Name: SmartForms - AI-Powered Questionnaire
 * Description: A WordPress plugin that enables users to create chatbot-style questionnaires with GPT-powered recommendations.
 * Version: 1.0.0
 * Author: Mark Russell
 * Author URI: https://markrussell.io
 * License: GPL2
 * Text Domain: smartforms
 */

namespace Smartforms;

// Prevent direct access to the plugin file.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Autoload classes.
spl_autoload_register(
	function ( $class_name ) {
		if ( strpos( $class_name, 'Smartforms\\' ) === 0 ) {
			$relative_class = str_replace( 'Smartforms\\', '', $class_name );
			$file_path      = plugin_dir_path( __FILE__ ) . 'includes/class-' . strtolower( str_replace( '_', '-', $relative_class ) ) . '.php';

			if ( file_exists( $file_path ) ) {
				include_once $file_path;
				// error_log( "SmartForms: Included $file_path" );
			} else {
				// error_log( "SmartForms: Autoloader failed to load $file_path" );
			}
		}
	}
);

// Activation and deactivation hooks.
register_activation_hook( __FILE__, [ 'Smartforms\\Smartforms', 'activate' ] );
register_deactivation_hook( __FILE__, [ 'Smartforms\\Smartforms', 'deactivate' ] );

// Initialize the plugin.
add_action(
	'plugins_loaded',
	function () {
		Smartforms::get_instance();
	}
);
