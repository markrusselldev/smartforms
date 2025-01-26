<?php
/**
 * Handles form actions like saving and deleting.
 *
 * @package SmartForms
 */

namespace Smartforms;

/**
 * Class SmartForms_Handler
 *
 * Handles saving, deleting, and other actions for forms.
 */
class SmartForms_Handler {

	/**
	 * Constructor to hook into WordPress actions.
	 */
	public function __construct() {
		add_action( 'admin_post_smartforms_delete_form', array( $this, 'handle_form_deletion' ) );
		add_filter( 'redirect_post_location', array( $this, 'redirect_after_block_editor' ), 10, 2 );
	}

	/**
	 * Handle form deletion.
	 *
	 * Deletes a form based on its ID. Verifies nonce before performing the action.
	 *
	 * @return void
	 */
	public function handle_form_deletion() {
		// Verify nonce and permissions.
		if ( ! isset( $_GET['_wpnonce'] ) || ! wp_verify_nonce( $_GET['_wpnonce'], 'smartforms_delete_form' ) ) {
			wp_die( esc_html__( 'Invalid request. Nonce verification failed.', 'smartforms' ) );
		}

		$form_id = isset( $_GET['form_id'] ) ? absint( $_GET['form_id'] ) : 0;

		if ( $form_id ) {
			wp_delete_post( $form_id, true );
		}

		// Redirect back to the "Create Form" page.
		wp_safe_redirect( admin_url( 'admin.php?page=smartforms-create' ) );
		exit;
	}

	/**
	 * Redirect "Back to WordPress" button to the "Create Form" admin page.
	 *
	 * Modifies the redirect location after saving or publishing a form in the block editor.
	 *
	 * @param string $location The default redirect URL.
	 * @param int    $post_id  The ID of the current post being edited.
	 * @return string The modified redirect URL.
	 */
	public function redirect_after_block_editor( $location, $post_id ) {
		if ( get_post_type( $post_id ) === 'smart_form' ) {
			// Redirect back to the plugin's "Create Form" page.
			$location = admin_url( 'admin.php?page=smartforms-create' );
		}
		return $location;
	}
}
