<?php
/**
 * API Endpoint to Fetch SmartForms Data.
 *
 * @package SmartForms
 */

namespace SmartForms;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

/**
 * Registers the REST API routes for SmartForms.
 *
 * @return void
 */
function smartforms_register_api_routes() {
	register_rest_route(
		'smartforms/v1',
		'/form/(?P<id>\d+)',
		array(
			'methods'             => 'GET',
			'callback'            => __NAMESPACE__ . '\\smartforms_get_form_data',
			'permission_callback' => '__return_true',
		)
	);
}
add_action( 'rest_api_init', __NAMESPACE__ . '\\smartforms_register_api_routes' );

/**
 * Fetches form data for preview mode.
 *
 * @param WP_REST_Request $request The request object.
 * @return WP_REST_Response|WP_Error JSON response with form content or WP_Error.
 */
function smartforms_get_form_data( WP_REST_Request $request ) {
	$form_id = $request->get_param( 'id' );

	// Validate form ID.
	if ( empty( $form_id ) || ! is_numeric( $form_id ) ) {
		$error = new WP_Error(
			'invalid_form_id',
			esc_html__( 'Invalid form ID.', 'smartforms' ),
			array( 'status' => 400 )
		);
		SmartForms::log_error( 'Invalid form ID provided: ' . esc_html( $form_id ), $error );
		return $error;
	}

	$form = get_post( (int) $form_id );

	// Check if the form exists and has the correct post type.
	if ( ! $form || 'smart_form' !== get_post_type( (int) $form_id ) ) {
		$error = new WP_Error(
			'form_not_found',
			esc_html__( 'Form not found.', 'smartforms' ),
			array( 'status' => 404 )
		);
		SmartForms::log_error( 'Form not found for ID: ' . esc_html( $form_id ), $error );
		return $error;
	}

	// Fetch form JSON config.
	$form_data = get_post_meta( (int) $form_id, 'smartforms_data', true );

	// Decode JSON data safely.
	$form_json = json_decode( $form_data, true );
	if ( empty( $form_json ) ) {
		$error = new WP_Error(
			'form_data_missing',
			esc_html__( 'Form data missing.', 'smartforms' ),
			array( 'status' => 404 )
		);
		SmartForms::log_error( 'No JSON data found for form ID: ' . esc_html( $form_id ), $error );
		return $error;
	}

	SmartForms::log_error( '[DEBUG] Returning form data for ID: ' . esc_html( $form_id ) );

	return new WP_REST_Response( $form_json, 200 );
}
