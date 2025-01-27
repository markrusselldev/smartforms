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
			}
		}
	}
);

// Activation and deactivation hooks.
register_activation_hook(
	__FILE__,
	array( 'Smartforms\\Smartforms', 'activate' )
);

register_deactivation_hook(
	__FILE__,
	array( 'Smartforms\\Smartforms', 'deactivate' )
);

// Initialize the plugin.
add_action(
	'plugins_loaded',
	function () {
		Smartforms::get_instance();
	}
);

/**
 * Adds the SmartForms block category, but only for the 'smartform' post type.
 *
 * @param array                  $categories Existing block categories.
 * @param WP_Block_Editor_Context $block_editor_context Editor context object.
 * @return array Updated block categories.
 */
add_filter(
	'block_categories_all',
	function ( $categories, $block_editor_context = null ) {
		if ( isset( $block_editor_context->post ) && 'smartform' === $block_editor_context->post->post_type ) {
			$categories[] = array(
				'slug'  => 'smartforms',
				'title' => __( 'SmartForms', 'smartforms' ),
				'icon'  => null,
			);

			// Log the successful addition of the category.
			error_log( '[DEBUG] SmartForms block category added for post type: ' . $block_editor_context->post->post_type );
		} else {
			// Log when the category is not added.
			error_log( '[DEBUG] SmartForms block category not added. Post type: ' . ( $block_editor_context->post->post_type ?? 'undefined' ) );
		}
		return $categories;
	},
	10,
	2
);

/**
 * Restricts available blocks to SmartForms blocks for the 'smartform' post type.
 *
 * @param array|bool             $allowed_block_types Existing allowed block types.
 * @param WP_Block_Editor_Context $block_editor_context Editor context object.
 * @return array|bool Updated allowed block types.
 */
add_filter(
	'allowed_block_types_all',
	function ( $allowed_block_types, $block_editor_context = null ) {
		if ( isset( $block_editor_context->post ) && 'smartform' === $block_editor_context->post->post_type ) {
			$allowed_blocks = array( 'smartforms/text-input' );

			// Log restricting blocks for the SmartForms post type.
			error_log( '[DEBUG] Restricting blocks to SmartForms blocks: ' . implode( ', ', $allowed_blocks ) );

			return $allowed_blocks;
		}

		// Log allowing all blocks for other post types.
		error_log( '[DEBUG] Allowing all blocks. Post type: ' . ( $block_editor_context->post->post_type ?? 'undefined' ) );
		return $allowed_block_types;
	},
	10,
	2
);

/**
 * Registers the Text Input block for SmartForms.
 *
 * @return void
 */
add_action(
	'init',
	function () {
		$block_path      = plugin_dir_path( __FILE__ ) . 'build/text-input';
		$block_json_path = $block_path . '/block.json';

		if ( file_exists( $block_json_path ) ) {
			$result = register_block_type( $block_path );

			// Log errors if block registration fails.
			if ( is_wp_error( $result ) ) {
				error_log( '[ERROR] Block registration failed: ' . $result->get_error_message() );
			} elseif ( null === $result ) {
				error_log( '[ERROR] Block registration returned null for: ' . $block_path );
			} else {
				error_log( '[DEBUG] Block registered successfully: ' . $block_path );
			}
		} else {
			// Log missing block.json.
			error_log( '[ERROR] block.json does not exist at: ' . $block_json_path );
		}
	}
);
