<?php
/**
 * Handles SmartForms processing and submissions.
 *
 * @package SmartForms
 */

namespace SmartForms\Core;

use WP_Error;
use SmartForms\Core\SmartForms;

/**
 * Class SmartFormsHandler
 *
 * Processes SmartForms submissions via AJAX.
 */
class SmartFormsHandler {

	/**
	 * Singleton instance.
	 *
	 * @var SmartFormsHandler|null
	 */
	private static $instance = null;

	/**
	 * Get or create the singleton instance.
	 *
	 * @return SmartFormsHandler The singleton instance.
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 *
	 * Hooks into WordPress actions and filters.
	 */
	private function __construct() {
		add_action( 'init', array( $this, 'register_ajax_handlers' ) );
	}

	/**
	 * Register AJAX handlers for processing SmartForms submissions.
	 *
	 * Hooks into both public (non-logged-in) and authenticated AJAX requests.
	 *
	 * @return void
	 */
	public function register_ajax_handlers() {
		add_action( 'wp_ajax_nopriv_process_smartform', array( $this, 'process_form_submission' ) );
		add_action( 'wp_ajax_process_smartform', array( $this, 'process_form_submission' ) );
	}

	/**
	 * Processes SmartForm submissions with field validation.
	 *
	 * @return void
	 */
	public function process_form_submission() {
		// Verify nonce security.
		if ( ! isset( $_POST['smartform_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['smartform_nonce'] ) ), 'smartform_submit' ) ) {
			$error = new WP_Error( 'invalid_nonce', __( 'Security check failed.', 'smartforms' ), array( 'status' => 403 ) );
			SmartForms::log_error( 'Invalid nonce detected during form submission.', $error );
			wp_send_json_error( $error->get_error_message(), 403 );
		}

		// Validate and sanitize inputs.
		$form_id = isset( $_POST['form_id'] ) ? intval( $_POST['form_id'] ) : 0;

		// Since form_data is JSON-encoded, decode it first.
		$form_data_raw = isset( $_POST['form_data'] ) ? wp_unslash( $_POST['form_data'] ) : '';
		$user_input    = json_decode( $form_data_raw, true );
		if ( ! is_array( $user_input ) ) {
			$user_input = array();
		} else {
			$user_input = array_map( 'sanitize_text_field', $user_input );
		}

		if ( empty( $form_id ) || empty( $user_input ) ) {
			$error = new WP_Error( 'invalid_submission', __( 'Invalid form submission.', 'smartforms' ), array( 'status' => 400 ) );
			SmartForms::log_error( 'Invalid form submission detected.', $error );
			wp_send_json_error( $error->get_error_message(), 400 );
		}

		// Retrieve the saved form configuration.
		$saved_json      = get_post_meta( $form_id, 'smartforms_data', true );
		$form_definition = $saved_json ? json_decode( $saved_json, true ) : array();
		$fields          = isset( $form_definition['fields'] ) ? $form_definition['fields'] : array();

		$errors = array();

		// Validate each field.
		foreach ( $fields as $field ) {
			$field_id = isset( $field['id'] ) ? $field['id'] : '';
			// Check required fields.
			if ( isset( $field['required'] ) && $field['required'] ) {
				// If the field value is missing or empty, record an error.
				if ( ! isset( $user_input[ $field_id ] ) || trim( $user_input[ $field_id ] ) === '' ) {
					$message = ! empty( $field['validationMessage'] )
						? $field['validationMessage']
						: sprintf( __( '%s is required.', 'smartforms' ), $field['label'] );
					$errors[] = $message;
				}
			}
			// Additional validation (e.g. regex patterns) per field type can be added here.
		}

		// If validation errors exist, return an error response.
		if ( ! empty( $errors ) ) {
			$error = new WP_Error( 'validation_failed', implode( ' ', $errors ), array( 'status' => 400 ) );
			SmartForms::log_error( 'Form submission validation failed for Form ID: ' . esc_html( $form_id ), $error );
			wp_send_json_error( $errors, 400 );
		}

		// Process form submission (e.g. saving to the database or sending an email).
		$submission_data = array(
			'form_id'   => $form_id,
			'user_data' => $user_input,
		);

		SmartForms::log_error( 'Form submitted successfully. Form ID: ' . $form_id );

		wp_send_json_success(
			array(
				'message' => __( 'Form submitted successfully.', 'smartforms' ),
				'data'    => $submission_data,
			)
		);
	}
}
