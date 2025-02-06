<?php
/**
 * API Endpoint to Fetch SmartForms Data.
 *
 * @package SmartForms
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

/**
 * Register the REST API route.
 */
function smartforms_register_api_routes() {
	register_rest_route(
		'smartforms/v1',
		'/form/(?P<id>\d+)',
		array(
			'methods'             => 'GET',
			'callback'            => 'smartforms_get_form_data',
			'permission_callback' => '__return_true',
		)
	);
}
add_action( 'rest_api_init', 'smartforms_register_api_routes' );

/**
 * Fetch form data for the chatbot or preview mode.
 *
 * @param WP_REST_Request $request The request object.
 * @return WP_REST_Response JSON response with form content.
 */
function smartforms_get_form_data( $request ) {
	$form_id = $request->get_param( 'id' );
	$form    = get_post( $form_id );

	if ( ! $form || 'smart_form' !== get_post_type( $form_id ) ) {
		return new WP_REST_Response( array( 'error' => 'Form not found' ), 404 );
	}

	// Fetch the JSON config from post meta.
	$form_data = get_post_meta( $form_id, 'smartforms_data', true );
	$form_json = json_decode( $form_data, true );

	if ( empty( $form_json ) ) {
		return new WP_REST_Response( array( 'error' => 'Form data missing' ), 404 );
	}

	return new WP_REST_Response( $form_json, 200 );
}
