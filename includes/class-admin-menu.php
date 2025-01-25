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
		add_action( 'admin_menu', array( $this, 'add_smartforms_menu' ) );
		add_action( 'admin_menu', array( $this, 'rename_first_submenu' ), 11 );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_gutenberg_assets' ) );
		add_action( 'admin_head', array( $this, 'set_active_menu' ) );
	}

	/**
	 * Add SmartForms menu and submenu items.
	 *
	 * @return void
	 */
	public function add_smartforms_menu() {
		add_menu_page(
			esc_html__( 'SmartForms', 'smartforms' ),
			esc_html__( 'SmartForms', 'smartforms' ),
			'manage_options',
			'smartforms',
			array( $this, 'render_dashboard' ),
			'dashicons-feedback',
			20
		);

		add_submenu_page(
			'smartforms',
			esc_html__( 'Create Form', 'smartforms' ),
			esc_html__( 'Create Form', 'smartforms' ),
			'manage_options',
			'smartforms-create',
			array( $this, 'render_create_form_page' )
		);
	}

	/**
	 * Rename the first submenu item to "Dashboard."
	 *
	 * @return void
	 */
	public function rename_first_submenu() {
		global $submenu;

		// Check if the SmartForms menu exists and has submenu items.
		if ( isset( $submenu['smartforms'] ) && isset( $submenu['smartforms'][0] ) ) {
			$submenu['smartforms'][0][0] = esc_html__( 'Dashboard', 'smartforms' ); // Rename the first submenu.
		}
	}

	/**
	 * Set the active menu and submenu.
	 *
	 * @return void
	 */
	public function set_active_menu() {
		$current_screen = get_current_screen();

		if ( $current_screen && 'smartforms_page_smartforms-create' === $current_screen->id ) {
			add_filter(
				'parent_file',
				function () {
					return 'smartforms';
				}
			);
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
			<h1><?php echo esc_html__( 'SmartForms Dashboard', 'smartforms' ); ?></h1>
			<p><?php echo esc_html__( 'Welcome to SmartForms. Use the "Create Form" option to build your forms.', 'smartforms' ); ?></p>
		</div>
		<?php
	}

	/**
	 * Render the "Create Form" admin page.
	 *
	 * @return void
	 */
	public function render_create_form_page() {
		$form_id = isset( $_GET['form_id'] ) ? absint( $_GET['form_id'] ) : 0;

		// Nonce verification.
		if ( ! isset( $_GET['_wpnonce'] ) || ! wp_verify_nonce( $_GET['_wpnonce'], 'smartforms_form_nonce' ) ) {
			wp_die( esc_html__( 'Invalid request. Nonce verification failed.', 'smartforms' ) );
		}

		if ( $form_id ) {
			echo '<h1>' . esc_html__( 'Edit Form', 'smartforms' ) . '</h1>';
		} else {
			echo '<h1>' . esc_html__( 'Create Form', 'smartforms' ) . '</h1>';
		}

		echo '<div id="smartforms-editor"></div>';
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
				array(
					'wp-blocks',
					'wp-editor',
					'wp-element',
					'wp-components',
					'wp-data',
				),
				'1.0.0',
				true
			);

			wp_enqueue_style(
				'smartforms-editor',
				plugins_url( '/assets/css/smartforms-editor.css', __FILE__ ),
				array(),
				'1.0.0'
			);
		}
	}
}
