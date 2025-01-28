<?php
/**
 * Handles form processing for SmartForms.
 *
 * @package SmartForms
 */

namespace Smartforms;

/**
 * Smartforms_Handler Class.
 *
 * This class manages form processing logic for the SmartForms plugin, including
 * handling form submissions, validating and sanitizing data, and redirecting
 * after block editor actions.
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
	 * Initializes the form processing logic.
	 */
	private function __construct() {
		// Hook for handling form submissions.
		add_action( 'admin_post_process_form', array( $this, 'process_form_submission' ) );

		// Hook for redirecting after block editor actions.
		add_action( 'admin_init', array( $this, 'redirect_after_block_editor' ) );
	}

	/**
	 * Process a form submission.
	 *
	 * Handles form data, performs validations, and redirects back to the admin page.
	 *
	 * @return void
	 */
	public function process_form_submission() {
		// Log the form submission for debugging purposes.
		error_log( '[DEBUG] Processing form submission.' );

		// Example form submission handling logic.
		if ( isset( $_POST['smartforms_nonce'] ) && wp_verify_nonce( $_POST['smartforms_nonce'], 'smartforms_submit' ) ) {
			// Sanitize and process form data here.
			error_log( '[DEBUG] Form data successfully processed.' );
		} else {
			error_log( '[ERROR] Invalid nonce or missing form data.' );
		}

		// Redirect back to the SmartForms admin page.
		wp_redirect( admin_url( 'admin.php?page=smartforms' ) );
		exit;
	}

	/**
	 * Redirect after using the block editor.
	 *
	 * Ensures users are redirected to the appropriate page after editing a block.
	 *
	 * @return void
	 */
	public function redirect_after_block_editor() {
		if ( isset( $_GET['post'] ) && isset( $_GET['action'] ) && 'edit' === $_GET['action'] ) {
			$post_id = intval( $_GET['post'] );

			// Check if the post belongs to the 'smartform' post type.
			if ( 'smartform' === get_post_type( $post_id ) ) {
				wp_safe_redirect( admin_url( 'admin.php?page=smartforms' ) );
				exit;
			}
		}
	}

	/**
	 * Example method for validating form data.
	 *
	 * This method could be used for additional server-side validation.
	 *
	 * @param array $form_data The form data to validate.
	 * @return bool True if validation passes, false otherwise.
	 */
	public function validate_form_data( $form_data ) {
		// Add your validation logic here.
		error_log( '[DEBUG] Validating form data.' );
		return true; // Example: Always returns true for now.
	}

	/**
	 * Example method for sanitizing form data.
	 *
	 * Ensures that data is properly sanitized before processing or saving.
	 *
	 * @param array $form_data The form data to sanitize.
	 * @return array The sanitized form data.
	 */
	public function sanitize_form_data( $form_data ) {
		// Add your sanitization logic here.
		error_log( '[DEBUG] Sanitizing form data.' );
		return array_map( 'sanitize_text_field', $form_data );
	}
}
