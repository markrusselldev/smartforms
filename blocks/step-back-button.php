<?php
/**
 * Registers the Step Back Button block for SmartForms.
 *
 * @package SmartForms
 */

namespace Smartforms;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

/**
 * Register the block using block.json.
 *
 * @return void
 */
function smartforms_register_step_back_button_block() {
	$block_path = plugin_dir_path( __FILE__ ) . 'build/step-back-button/block.json';

	if ( file_exists( $block_path ) ) {
		register_block_type_from_metadata( $block_path );
		error_log( '[DEBUG] Step Back Button block registered successfully from: ' . esc_url( $block_path ) );
	} else {
		error_log( '[ERROR] block.json not found at: ' . esc_url( $block_path ) );
	}
}
add_action( 'init', 'Smartforms\smartforms_register_step_back_button_block' );
