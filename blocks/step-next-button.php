<?php
/**
 * Registers the Step Next Button block for SmartForms.
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
function smartforms_register_step_next_button_block() {
	$block_path = plugin_dir_path( __FILE__ ) . 'build/step-next-button/block.json';

	if ( file_exists( $block_path ) ) {
		register_block_type_from_metadata( $block_path );
		error_log( '[DEBUG] Step Next Button block registered successfully from: ' . esc_url( $block_path ) );
	} else {
		error_log( '[ERROR] block.json not found at: ' . esc_url( $block_path ) );
	}
}
add_action( 'init', 'SmartForms\smartforms_register_step_next_button_block' );
