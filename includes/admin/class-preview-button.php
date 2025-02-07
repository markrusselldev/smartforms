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
 * This function modifies the default Gutenberg preview link to generate a custom
 * preview URL for the SmartForms custom post type (CPT). It ensures that forms
 * are previewed correctly within the frontend environment.
 *
 * @since 1.0.0
 *
 * @param string  $preview_link The default preview link.
 * @param WP_Post $post         The post object being previewed.
 * @return string The modified preview URL.
 */
function smartforms_override_preview_link( $preview_link, $post ) {
	if ( 'smart_form' === get_post_type( $post ) ) {
		$form_id = absint( $post->ID );
		$preview_link = home_url( '/?smartforms_preview=1&form_id=' . $form_id );

		// Ensure `preview=true` is removed.
		$preview_link = remove_query_arg( 'preview', $preview_link );

		// Debugging log to verify this runs.
		if ( class_exists( '\SmartForms\SmartForms' ) ) {
			\SmartForms\SmartForms::log_error( '[DEBUG] Final Preview Link (Override Function): ' . esc_url( $preview_link ) );
		}
	}
	return esc_url( $preview_link );
}
add_filter( 'preview_post_link', __NAMESPACE__ . '\\smartforms_override_preview_link', 10, 2 );

/**
 * Modifies the REST API response to include a custom preview link for SmartForms.
 *
 * This function ensures that the SmartForms custom post type preview link is correctly
 * provided via the WordPress REST API, preventing any automatic overrides by Gutenberg.
 *
 * @since 1.0.0
 *
 * @param WP_REST_Response $response The response object.
 * @param WP_Post          $post     The post object.
 * @return WP_REST_Response The modified response object with the preview link.
 */
add_filter(
	'rest_prepare_smart_form',
	function ( $response, $post ) {
		if ( isset( $post->ID ) ) {
			$form_id = absint( $post->ID );
			$preview_link = home_url( '/?smartforms_preview=1&form_id=' . $form_id );

			// Debugging log.
			if ( class_exists( '\SmartForms\SmartForms' ) ) {
				\SmartForms\SmartForms::log_error( '[DEBUG] REST API Modified Preview Link: ' . esc_url( $preview_link ) );
			}

			$response->data['link'] = esc_url( $preview_link );
		}
		return $response;
	},
	10,
	2
);

/**
 * Ensures the preview button appears in SmartForms CPT.
 *
 * This function adds a custom preview button to the post row actions in the WordPress admin.
 * The button links to the SmartForms preview mode for quick access.
 *
 * @since 1.0.0
 *
 * @param array $actions The existing post row actions.
 * @return array The modified actions with the preview button.
 */
function smartforms_enable_preview_button( $actions ) {
	global $post;

	if ( isset( $post->post_type ) && 'smart_form' === $post->post_type ) {
		$form_id = absint( $post->ID );
		$preview_url = home_url( '/?smartforms_preview=1&form_id=' . $form_id );

		// Debugging log.
		if ( class_exists( '\SmartForms\SmartForms' ) ) {
			\SmartForms\SmartForms::log_error( '[DEBUG] Post Row Preview Button Link: ' . esc_url( $preview_url ) );
		}

		$actions['view'] = sprintf(
			'<a href="%s" target="_blank" class="preview button">%s</a>',
			esc_url( $preview_url ),
			esc_html__( 'Preview', 'smartforms' )
		);
	}

	return $actions;
}
add_filter( 'post_row_actions', __NAMESPACE__ . '\\smartforms_enable_preview_button', 10, 1 );
add_filter( 'page_row_actions', __NAMESPACE__ . '\\smartforms_enable_preview_button', 10, 1 );
