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
	}

	/**
	 * Add SmartForms menu and submenu items.
	 *
	 * @return void
	 */
	public function add_smartforms_menu() {
		// Add the top-level menu (SmartForms Dashboard).
		add_menu_page(
			esc_html__( 'SmartForms', 'smartforms' ),
			esc_html__( 'SmartForms', 'smartforms' ),
			'manage_options',
			'smartforms',
			array( $this, 'render_dashboard' ),
			'dashicons-feedback',
			20
		);

		// Add the Dashboard submenu (this duplicates the top-level menu for submenus).
		add_submenu_page(
			'smartforms',
			esc_html__( 'Dashboard', 'smartforms' ),
			esc_html__( 'Dashboard', 'smartforms' ),
			'manage_options',
			'smartforms',
			array( $this, 'render_dashboard' )
		);

		// Add the Create Form submenu.
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

		// If a form ID is provided, redirect to the block editor for that form.
		if ( $form_id ) {
			wp_redirect( admin_url( 'post.php?post=' . $form_id . '&action=edit' ) );
			exit;
		}

		// Otherwise, list all forms with options to create, edit, or delete.
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Create Form', 'smartforms' ); ?></h1>
			<p>
				<a href="<?php echo esc_url( admin_url( 'post-new.php?post_type=smart_form' ) ); ?>" class="button button-primary">
					<?php esc_html_e( 'New Form', 'smartforms' ); ?>
				</a>
			</p>
			<table class="wp-list-table widefat fixed striped">
				<thead>
					<tr>
						<th><?php esc_html_e( 'Title', 'smartforms' ); ?></th>
						<th><?php esc_html_e( 'Date', 'smartforms' ); ?></th>
						<th><?php esc_html_e( 'Actions', 'smartforms' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php
					$forms = get_posts(
						array(
							'post_type'      => 'smart_form',
							'post_status'    => 'publish',
							'posts_per_page' => -1,
						)
					);

					if ( ! empty( $forms ) ) {
						foreach ( $forms as $form ) {
							?>
							<tr>
								<td><?php echo esc_html( $form->post_title ); ?></td>
								<td><?php echo esc_html( get_the_date( '', $form ) ); ?></td>
								<td>
									<a href="<?php echo esc_url( admin_url( 'post.php?post=' . $form->ID . '&action=edit' ) ); ?>" class="button">
										<?php esc_html_e( 'Edit', 'smartforms' ); ?>
									</a>
									<a href="<?php echo esc_url( admin_url( 'admin-post.php?action=smartforms_delete_form&form_id=' . $form->ID ) ); ?>" class="button button-secondary" onclick="return confirm('<?php esc_attr_e( 'Are you sure you want to delete this form?', 'smartforms' ); ?>');">
										<?php esc_html_e( 'Delete', 'smartforms' ); ?>
									</a>
								</td>
							</tr>
							<?php
						}
					} else {
						?>
						<tr>
							<td colspan="3"><?php esc_html_e( 'No forms found.', 'smartforms' ); ?></td>
						</tr>
						<?php
					}
					?>
				</tbody>
			</table>
		</div>
		<?php
	}
}
