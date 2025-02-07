<?php
/**
 * Automatically generate JSON data from Gutenberg blocks when a SmartForm is saved.
 *
 * @package SmartForms
 */

namespace SmartForms\Admin;

use WP_Error;
use SmartForms\SmartForms;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

/**
 * Extracts block data and saves JSON into post meta.
 *
 * @param int $post_id The post ID.
 * @return void|WP_Error Returns WP_Error on failure.
 */
function smartforms_generate_json_on_save( $post_id ) {
	// Verify post type.
	if ( 'smart_form' !== get_post_type( $post_id ) ) {
		return;
	}

	// Prevent autosave interference.
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	// Check for a valid post status.
	$post_status = get_post_status( $post_id );
	if ( 'auto-draft' === $post_status || 'trash' === $post_status ) {
		return;
	}

	// Get post content (Gutenberg block structure).
	$post_content = get_post_field( 'post_content', $post_id );
	$blocks       = parse_blocks( $post_content );

	// Convert blocks to structured JSON format.
	$form_fields = array();

	foreach ( $blocks as $block ) {
		if ( isset( $block['blockName'] ) && strpos( $block['blockName'], 'smartforms/' ) === 0 ) {
			$form_fields[] = array(
				'type'        => str_replace( 'smartforms/', '', sanitize_text_field( $block['blockName'] ) ),
				'label'       => isset( $block['attrs']['label'] ) ? sanitize_text_field( $block['attrs']['label'] ) : '',
				'placeholder' => isset( $block['attrs']['placeholder'] ) ? sanitize_text_field( $block['attrs']['placeholder'] ) : '',
				'required'    => isset( $block['attrs']['required'] ) ? (bool) $block['attrs']['required'] : false,
			);
		}
	}

	// Encode JSON safely.
	$json_data = wp_json_encode( array( 'fields' => $form_fields ) );

	if ( false === $json_data ) {
		SmartForms::log_error( '[ERROR] Failed to encode form data JSON for Form ID: ' . esc_html( $post_id ) );

		return new WP_Error(
			'json_encoding_failed',
			esc_html__( 'Failed to encode form data JSON.', 'smartforms' )
		);
	}

	// Store JSON in post meta.
	update_post_meta( $post_id, 'smartforms_data', $json_data );

	SmartForms::log_error( '[DEBUG] Form data JSON saved for Form ID: ' . esc_html( $post_id ) );
}
add_action( 'save_post', __NAMESPACE__ . '\\smartforms_generate_json_on_save' );
