<?php
/**
 * Registers the Button Select block for SmartForms.
 *
 * @package SmartForms
 */

namespace SmartForms;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

/**
 * Register the block using block.json.
 *
 * @return void
 */
function smartforms_register_button_select_block() {
	$block_path = plugin_dir_path( __FILE__ ) . 'build/button-select/block.json';

	if ( file_exists( $block_path ) ) {
		register_block_type_from_metadata( $block_path );
		error_log( '[DEBUG] Button Select block registered successfully from: ' . esc_url( $block_path ) );
	} else {
		error_log( '[ERROR] block.json not found at: ' . esc_url( $block_path ) );
	}
}
add_action( 'init', 'SmartForms\smartforms_register_button_select_block' );
