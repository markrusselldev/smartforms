<?php
/**
 * Handles custom post type display settings for SmartForms.
 *
 * @package SmartForms
 */

namespace SmartForms\CPT;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

/**
 * Class SmartFormsCPTSettings
 *
 * Manages display settings specific to the smart_form custom post type.
 */
class SmartFormsCPTSettings {

	/**
	 * The singleton instance.
	 *
	 * @var SmartFormsCPTSettings|null
	 */
	private static $instance = null;

	/**
	 * Retrieves the singleton instance.
	 *
	 * @return SmartFormsCPTSettings
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Private constructor to enforce singleton usage.
	 */
	private function __construct() {
		add_action( 'add_meta_boxes', array( $this, 'register_meta_box' ) );
		add_action( 'save_post_smart_form', array( $this, 'save_meta_box_data' ) );
	}

	/**
	 * Registers the settings meta box for the smart_form CPT.
	 *
	 * @return void
	 */
	public function register_meta_box() {
		add_meta_box(
			'smartforms_cpt_settings',                            // Meta box ID.
			esc_html__( 'Form Display Settings', 'smartforms' ),  // Title.
			array( $this, 'render_meta_box' ),                    // Callback.
			'smart_form',                                         // Screen.
			'side',                                               // Context.
			'high'                                                // Priority.
		);
	}

	/**
	 * Renders the meta box content.
	 *
	 * @param \WP_Post $post The current post object.
	 * @return void
	 */
	public function render_meta_box( $post ) {
		wp_nonce_field( 'smartforms_save_cpt_settings', 'smartforms_cpt_meta_nonce' );
		// Retrieve stored values and use spaces for mid‑line alignment.
		$form_width    = get_post_meta( $post->ID, '_smartforms_width', true );
		$form_width    = $form_width ? $form_width : '400px';
		$border_radius = get_post_meta( $post->ID, '_smartforms_border_radius', true );
		$border_radius = $border_radius ? $border_radius : 10;
		$box_shadow    = get_post_meta( $post->ID, '_smartforms_box_shadow', true );
		$box_shadow    = $box_shadow ? $box_shadow : 'none';
		?>
		<p>
			<label for="smartforms-width"><?php esc_html_e( 'Form Width (px)', 'smartforms' ); ?></label>
			<input type="text" id="smartforms-width" name="smartforms_width" value="<?php echo esc_attr( $form_width ); ?>" class="widefat">
		</p>
		<p>
			<label for="smartforms-border-radius"><?php esc_html_e( 'Border Radius (px)', 'smartforms' ); ?></label>
			<input type="number" id="smartforms-border-radius" name="smartforms_border_radius" value="<?php echo esc_attr( $border_radius ); ?>" class="widefat">
		</p>
		<p>
			<label for="smartforms-box-shadow"><?php esc_html_e( 'Box Shadow', 'smartforms' ); ?></label>
			<select id="smartforms-box-shadow" name="smartforms_box_shadow" class="widefat">
				<option value="none" <?php selected( $box_shadow, 'none' ); ?>><?php esc_html_e( 'None', 'smartforms' ); ?></option>
				<option value="small" <?php selected( $box_shadow, 'small' ); ?>><?php esc_html_e( 'Small', 'smartforms' ); ?></option>
				<option value="medium" <?php selected( $box_shadow, 'medium' ); ?>><?php esc_html_e( 'Medium', 'smartforms' ); ?></option>
				<option value="large" <?php selected( $box_shadow, 'large' ); ?>><?php esc_html_e( 'Large', 'smartforms' ); ?></option>
			</select>
		</p>
		<?php
	}

	/**
	 * Saves the meta box data when the post is saved.
	 *
	 * @param int $post_id The ID of the post being saved.
	 * @return void
	 */
	public function save_meta_box_data( $post_id ) {
		if ( ! isset( $_POST['smartforms_cpt_meta_nonce'] ) ||
			! wp_verify_nonce( $_POST['smartforms_cpt_meta_nonce'], 'smartforms_save_cpt_settings' ) ) {
			return;
		}

		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		if ( isset( $_POST['smartforms_width'] ) ) {
			update_post_meta( $post_id, '_smartforms_width', sanitize_text_field( $_POST['smartforms_width'] ) );
		}

		if ( isset( $_POST['smartforms_border_radius'] ) ) {
			update_post_meta( $post_id, '_smartforms_border_radius', absint( $_POST['smartforms_border_radius'] ) );
		}

		if ( isset( $_POST['smartforms_box_shadow'] ) ) {
			update_post_meta( $post_id, '_smartforms_box_shadow', sanitize_text_field( $_POST['smartforms_box_shadow'] ) );
		}
	}
}

// Initialize the CPT settings class via its singleton.
SmartFormsCPTSettings::get_instance();
