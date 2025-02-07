<?php
/**
 * Modifies the Preview button in the Gutenberg editor for SmartForms.
 *
 * @package SmartForms
 */

namespace SmartForms\Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

/**
 * Overrides the preview link for SmartForms.
 *
 * @param string  $preview_link Default preview link.
 * @param WP_Post $post The post object.
 * @return string Modified preview URL.
 */
function smartforms_override_preview_link( $preview_link, $post ) {
	if ( 'smart_form' === get_post_type( $post ) ) {
		$preview_link = home_url( '/?smartforms_preview=1&form_id=' . $post->ID );

		// Log the override using the centralized logging function.
		if ( class_exists( '\SmartForms\SmartForms' ) ) {
			\SmartForms\SmartForms::log_error( '[DEBUG] SmartForms preview link overridden: ' . esc_url( $preview_link ) );
		}
	}
	return esc_url( $preview_link );
}
add_filter( 'preview_post_link', __NAMESPACE__ . '\\smartforms_override_preview_link', 10, 2 );

/**
 * Ensures the preview button appears in SmartForms CPT.
 *
 * @param array $actions Post row actions.
 * @return array Modified actions.
 */
function smartforms_enable_preview_button( $actions ) {
	global $post;

	if ( isset( $post->post_type ) && 'smart_form' === $post->post_type ) {
		$preview_url = home_url( '/?smartforms_preview=1&form_id=' . $post->ID );

		// Ensure escaping for URL and attributes.
		$actions['view'] = sprintf(
			'<a href="%s" target="_blank" class="preview button">%s</a>',
			esc_url( $preview_url ),
			esc_html__( 'Preview', 'smartforms' )
		);

		// Log the preview button addition using the centralized logging function.
		if ( class_exists( '\SmartForms\SmartForms' ) ) {
			\SmartForms\SmartForms::log_error( '[DEBUG] SmartForms preview button added: ' . esc_url( $preview_url ) );
		}
	}

	return $actions;
}
add_filter( 'post_row_actions', __NAMESPACE__ . '\\smartforms_enable_preview_button', 10, 1 );
add_filter( 'page_row_actions', __NAMESPACE__ . '\\smartforms_enable_preview_button', 10, 1 );
