<?php
/**
 * Handles SmartForms processing and submissions.
 *
 * @package SmartForms
 */

namespace SmartForms\Core;

use WP_Error;
use SmartForms\Core\SmartForms; // Import the core SmartForms class for logging.

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
	 * Processes SmartForm submissions.
	 *
	 * @return void
	 */
	public function process_form_submission() {
		// Verify nonce security.
		if ( ! isset( $_POST['smartform_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['smartform_nonce'] ) ), 'smartform_submit' ) ) {
			$error = new \WP_Error( 'invalid_nonce', __( 'Security check failed.', 'smartforms' ), array( 'status' => 403 ) );
			\SmartForms\Core\SmartForms::log_error( 'Invalid nonce detected during form submission.', $error );
			wp_send_json_error( $error->get_error_message(), 403 );
		}

		// Validate and sanitize inputs.
		$form_id    = isset( $_POST['form_id'] ) ? intval( $_POST['form_id'] ) : 0;
		$user_input = isset( $_POST['form_data'] ) ? array_map( 'sanitize_text_field', wp_unslash( $_POST['form_data'] ) ) : array();

		if ( empty( $form_id ) || empty( $user_input ) ) {
			$error = new \WP_Error( 'invalid_submission', __( 'Invalid form submission.', 'smartforms' ), array( 'status' => 400 ) );
			\SmartForms\Core\SmartForms::log_error( 'Invalid form submission detected.', $error );
			wp_send_json_error( $error->get_error_message(), 400 );
		}

		// Process form submission (this can be customized for saving to database, emailing, etc.).
		$submission_data = array(
			'form_id'   => $form_id,
			'user_data' => $user_input,
		);

		// Log successful form submission.
		\SmartForms\Core\SmartForms::log_error( 'Form submitted successfully. Form ID: ' . $form_id );

		// Send success response.
		wp_send_json_success(
			array(
				'message' => __( 'Form submitted successfully.', 'smartforms' ),
				'data'    => $submission_data,
			)
		);
	}
}
