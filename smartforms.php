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

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Include Composer autoloader.
if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	require_once __DIR__ . '/vendor/autoload.php';
}

// Initialize the SmartForms plugin using the core namespace.
\SmartForms\Core\SmartForms::get_instance();

// Register activation and deactivation hooks.
register_activation_hook( __FILE__, array( '\SmartForms\Core\SmartForms', 'activate' ) );
register_deactivation_hook( __FILE__, array( '\SmartForms\Core\SmartForms', 'deactivate' ) );
