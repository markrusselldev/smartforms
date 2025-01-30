<?php
/**
 * Handles SmartForms processing and submissions.
 *
 * @package SmartForms
 */

namespace Smartforms;

/**
 * Class Smartforms_Handler
 *
 * Processes SmartForms submissions via AJAX.
 */
class Smartforms_Handler {

	/**
	 * Singleton instance.
	 *
	 * @var Smartforms_Handler|null
	 */
	private static $instance = null;

	/**
	 * Get or create the singleton instance.
	 *
	 * @return Smartforms_Handler The singleton instance.
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
			wp_send_json_error(
				array(
					'message' => __( 'Security check failed.', 'smartforms' ),
				),
				403
			);
		}

		// Validate and sanitize inputs.
		$form_id    = isset( $_POST['form_id'] ) ? intval( $_POST['form_id'] ) : 0;
		$user_input = isset( $_POST['form_data'] ) ? array_map( 'sanitize_text_field', wp_unslash( $_POST['form_data'] ) ) : array();

		if ( empty( $form_id ) || empty( $user_input ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'Invalid form submission.', 'smartforms' ),
				),
				400
			);
		}

		// Process form submission (this can be customized for saving to database, emailing, etc.).
		$submission_data = array(
			'form_id'   => $form_id,
			'user_data' => $user_input,
		);

		// Send success response.
		wp_send_json_success(
			array(
				'message' => __( 'Form submitted successfully.', 'smartforms' ),
				'data'    => $submission_data,
			)
		);
	}
}
