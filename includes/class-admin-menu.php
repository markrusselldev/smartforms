<?php
/**
 * Handles admin menu and related functionality.
 *
 * @package SmartForms
 */

namespace Smartforms;

/**
 * Admin menu class for SmartForms plugin.
 */
class Admin_Menu {

	/**
	 * Constructor to hook into WordPress actions.
	 */
	public function __construct() {
		add_action( 'admin_menu', [ $this, 'add_smartforms_menu' ] );
		add_action( 'admin_menu', [ $this, 'rename_first_submenu' ], 11 );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_gutenberg_assets' ] );
		// error_log( 'SmartForms: Admin_Menu constructor called.' );
	}

	/**
	 * Add SmartForms menu and submenu items.
	 *
	 * @return void
	 */
	public function add_smartforms_menu() {
		add_menu_page(
			'SmartForms',                // Page title.
			'SmartForms',                // Menu title.
			'manage_options',            // Capability.
			'smartforms',                // Menu slug.
			[ $this, 'render_dashboard' ], // Callback for the main dashboard page.
			'dashicons-feedback',        // Icon.
			20                           // Position.
		);

		add_submenu_page(
			'smartforms',                // Parent menu slug.
			'Create Form',               // Page title.
			'Create Form',               // Menu title.
			'manage_options',            // Capability.
			'smartforms-create',         // Menu slug.
			[ $this, 'render_create_form_page' ] // Callback function.
		);
		// error_log( 'SmartForms: Menu and submenu added.' );
	}

	/**
	 * Rename the first submenu item to "Dashboard."
	 *
	 * @return void
	 */
	public function rename_first_submenu() {
		global $submenu;
		if ( isset( $submenu['smartforms'] ) && isset( $submenu['smartforms'][0] ) ) {
			$submenu['smartforms'][0][0] = 'Dashboard'; // Rename the first submenu item.
			// error_log( "SmartForms: Submenu renamed to 'Dashboard'." );
		} else {
			// error_log( 'SmartForms: Submenu not found for renaming.' );
		}
	}

	/**
	 * Render the main Dashboard page.
	 *
	 * @return void
	 */
	public function render_dashboard() {
		?>
		<div class="wrap">
			<h1>SmartForms Dashboard</h1>
			<p>Welcome to SmartForms. Use the "Create Form" option to build your forms.</p>
		</div>
		<?php
		// error_log( 'SmartForms: Rendered Dashboard page.' );
	}

	/**
	 * Render the "Create Form" admin page.
	 *
	 * @return void
	 */
	public function render_create_form_page() {
		$form_id = filter_input( INPUT_GET, 'form_id', FILTER_VALIDATE_INT ) ?? 0;

		if ( $form_id ) {
			echo '<h1>Edit Form</h1>';
		} else {
			echo '<h1>Create Form</h1>';
		}

		echo '<div id="smartforms-editor"></div>'; // Gutenberg editor placeholder.
		// error_log( 'SmartForms: Rendered Create Form page.' );
	}

	/**
	 * Enqueue Gutenberg editor scripts and styles.
	 *
	 * @param string $hook_suffix The current admin page hook suffix.
	 *
	 * @return void
	 */
	public function enqueue_gutenberg_assets( $hook_suffix ) {
		if ( 'smartforms_page_smartforms-create' === $hook_suffix ) {
			wp_enqueue_script(
				'smartforms-editor',
				plugins_url( '/assets/js/smartforms-editor.js', __FILE__ ),
				[
					'wp-blocks',
					'wp-editor',
					'wp-element',
					'wp-components',
					'wp-data',
				],
				'1.0.0',
				true
			);

			wp_enqueue_style(
				'smartforms-editor',
				plugins_url( '/assets/css/smartforms-editor.css', __FILE__ ),
				[],
				'1.0.0'
			);
			// error_log( 'SmartForms: Enqueued Gutenberg assets.' );
		}
	}
}
