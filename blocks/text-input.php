<?php
/**
 * Registers the Text Input block for SmartForms.
 *
 * @package SmartForms
 */

namespace Smartforms;

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Registers the block using `block.json`.
 *
 * @return void
 */
function smartforms_register_text_input_block() {
    // Debug: Log function execution.
    error_log( '[DEBUG] smartforms_register_text_input_block() is being executed.' );

    $block_path      = plugin_dir_path( __FILE__ ) . 'build/text-input';
    $block_json_path = $block_path . '/block.json';

    // Debug: Log paths for confirmation.
    error_log( '[DEBUG] Block path is: ' . $block_path );
    error_log( '[DEBUG] Block JSON path is: ' . $block_json_path );

    // Check if block.json exists.
    if ( ! file_exists( $block_json_path ) ) {
        error_log( '[ERROR] block.json does not exist at: ' . $block_json_path );
        return;
    } else {
        error_log( '[DEBUG] block.json exists at: ' . $block_json_path );
    }

    // Register the block.
    $result = register_block_type( $block_path );

    // Check the result of register_block_type.
    if ( is_wp_error( $result ) ) {
        error_log( '[ERROR] Block registration failed: ' . $result->get_error_message() );
    } elseif ( $result === null ) {
        error_log( '[ERROR] Block registration returned null for: ' . $block_path );
    } else {
        error_log( '[DEBUG] Block registered successfully: ' . $block_path );
    }
}
add_action( 'init', 'Smartforms\\smartforms_register_text_input_block' );

/**
 * Add custom category for SmartForms blocks.
 *
 * @param array $categories Existing block categories.
 * @return array Updated block categories.
 */
function smartforms_add_block_category( $categories ) {
    // Debug: Log category addition.
    error_log( '[DEBUG] Adding SmartForms block category.' );

    return array_merge(
        $categories,
        [
            [
                'slug'  => 'smartforms',
                'title' => __( 'SmartForms', 'smartforms' ),
                'icon'  => null, // Optional: Add icon if needed.
            ],
        ]
    );
}
add_filter( 'block_categories_all', 'Smartforms\\smartforms_add_block_category', 10, 2 );
