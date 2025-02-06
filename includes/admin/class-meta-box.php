<?php
/**
 * Automatically generate JSON data from Gutenberg blocks when a SmartForm is saved.
 *
 * @package SmartForms
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

/**
 * Extracts block data and saves JSON into post meta.
 *
 * @param int $post_id The post ID.
 */
function smartforms_generate_json_on_save( $post_id ) {
	// Verify post type.
	if ( get_post_type( $post_id ) !== 'smart_form' ) {
		return;
	}

	// Get post content (Gutenberg block structure).
	$post_content = get_post_field( 'post_content', $post_id );
	$blocks       = parse_blocks( $post_content );

	// Convert blocks to structured JSON format.
	$form_fields = array();

	foreach ( $blocks as $block ) {
		if ( strpos( $block['blockName'], 'smartforms/' ) === 0 ) {
			$form_fields[] = array(
				'type'        => str_replace( 'smartforms/', '', $block['blockName'] ),
				'label'       => isset( $block['attrs']['label'] ) ? $block['attrs']['label'] : '',
				'placeholder' => isset( $block['attrs']['placeholder'] ) ? $block['attrs']['placeholder'] : '',
				'required'    => isset( $block['attrs']['required'] ) ? (bool) $block['attrs']['required'] : false,
			);
		}
	}

	// Store JSON in post meta.
	update_post_meta( $post_id, 'smartforms_data', json_encode( array( 'fields' => $form_fields ) ) );
}
add_action( 'save_post', 'smartforms_generate_json_on_save' );
