<?php
/**
 * ChatUISettings: Global Chat UI settings for SmartForms.
 *
 * This file registers a submenu under the SmartForms menu where users
 * can customize the overall appearance of the chat interface.
 *
 * @package SmartForms
 */

namespace SmartForms\CPT;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

class ChatUISettings {

	/**
	 * Option name for storing Chat UI styles.
	 *
	 * @var string
	 */
	const OPTION_NAME = 'smartforms_chat_ui_styles';

	/**
	 * Singleton instance.
	 *
	 * @var ChatUISettings|null
	 */
	private static $instance = null;

	/**
	 * Gets the singleton instance.
	 *
	 * @return ChatUISettings
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Private constructor.
	 */
	private function __construct() {
		\SmartForms\Core\SmartForms::log_error( '[DEBUG] ChatUISettings constructor called.' );
		add_action( 'admin_menu', array( $this, 'add_submenu_page' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
	}

	/**
	 * Adds a submenu page under the SmartForms menu.
	 *
	 * @return void
	 */
	public function add_submenu_page() {
		// The parent slug "smartforms" is registered in AdminMenu.php.
		add_submenu_page(
			'smartforms', // Parent slug.
			__( 'Chat UI Settings', 'smartforms' ),
			__( 'Chat UI Settings', 'smartforms' ),
			'manage_options',
			'smartforms-chat-ui-settings',
			array( $this, 'render_settings_page' )
		);
	}

	/**
	 * Registers the settings, sections, and fields.
	 *
	 * @return void
	 */
	public function register_settings() {
		register_setting(
			'smartforms_chat_ui_settings_group',
			self::OPTION_NAME,
			array( 'sanitize_callback' => array( $this, 'sanitize_settings' ) )
		);

		add_settings_section(
			'smartforms_chat_ui_settings_section',
			__( 'Global Chat UI Style Options', 'smartforms' ),
			null,
			'smartforms-chat-ui-settings'
		);

		// Chatbox Background Color.
		add_settings_field(
			'background_color',
			__( 'Chatbox Background Color', 'smartforms' ),
			array( $this, 'render_background_color_field' ),
			'smartforms-chat-ui-settings',
			'smartforms_chat_ui_settings_section'
		);

		// Chatbox Border Color.
		add_settings_field(
			'border_color',
			__( 'Chatbox Border Color', 'smartforms' ),
			array( $this, 'render_border_color_field' ),
			'smartforms-chat-ui-settings',
			'smartforms_chat_ui_settings_section'
		);

		// Chatbox Border Style.
		add_settings_field(
			'border_style',
			__( 'Chatbox Border Style', 'smartforms' ),
			array( $this, 'render_border_style_field' ),
			'smartforms-chat-ui-settings',
			'smartforms_chat_ui_settings_section'
		);

		// Chatbox Border Width.
		add_settings_field(
			'border_width',
			__( 'Chatbox Border Width (px)', 'smartforms' ),
			array( $this, 'render_border_width_field' ),
			'smartforms-chat-ui-settings',
			'smartforms_chat_ui_settings_section'
		);

		// Chatbox Border Radius.
		add_settings_field(
			'border_radius',
			__( 'Chatbox Border Radius (px)', 'smartforms' ),
			array( $this, 'render_border_radius_field' ),
			'smartforms-chat-ui-settings',
			'smartforms_chat_ui_settings_section'
		);

		// Chatbox Box Shadow.
		add_settings_field(
			'box_shadow',
			__( 'Chatbox Box Shadow', 'smartforms' ),
			array( $this, 'render_box_shadow_field' ),
			'smartforms-chat-ui-settings',
			'smartforms_chat_ui_settings_section'
		);
	}

	/**
	 * Sanitizes the settings input.
	 *
	 * @param array $input The unsanitized settings.
	 * @return array Sanitized settings.
	 */
	public function sanitize_settings( $input ) {
		$output = array();
		if ( isset( $input['background_color'] ) ) {
			$output['background_color'] = sanitize_hex_color( $input['background_color'] );
		}
		if ( isset( $input['border_color'] ) ) {
			$output['border_color'] = sanitize_hex_color( $input['border_color'] );
		}
		if ( isset( $input['border_style'] ) ) {
			$output['border_style'] = sanitize_text_field( $input['border_style'] );
		}
		if ( isset( $input['border_width'] ) ) {
			$output['border_width'] = absint( $input['border_width'] );
		}
		if ( isset( $input['border_radius'] ) ) {
			$output['border_radius'] = absint( $input['border_radius'] );
		}
		if ( isset( $input['box_shadow'] ) ) {
			$output['box_shadow'] = sanitize_text_field( $input['box_shadow'] );
		}
		return $output;
	}

	/**
	 * Renders the background color field.
	 *
	 * @return void
	 */
	public function render_background_color_field() {
		$options = get_option( self::OPTION_NAME, array( 'background_color' => '#ffffff' ) );
		?>
		<input type="color" name="<?php echo esc_attr( self::OPTION_NAME ); ?>[background_color]" value="<?php echo esc_attr( $options['background_color'] ); ?>" />
		<?php
	}

	/**
	 * Renders the border color field.
	 *
	 * @return void
	 */
	public function render_border_color_field() {
		$options = get_option( self::OPTION_NAME, array( 'border_color' => '#cccccc' ) );
		?>
		<input type="color" name="<?php echo esc_attr( self::OPTION_NAME ); ?>[border_color]" value="<?php echo esc_attr( $options['border_color'] ); ?>" />
		<?php
	}

	/**
	 * Renders the border style field.
	 *
	 * @return void
	 */
	public function render_border_style_field() {
		$options = get_option( self::OPTION_NAME, array( 'border_style' => 'solid' ) );
		?>
		<select name="<?php echo esc_attr( self::OPTION_NAME ); ?>[border_style]">
			<option value="solid" <?php selected( $options['border_style'], 'solid' ); ?>><?php esc_html_e( 'Solid', 'smartforms' ); ?></option>
			<option value="dashed" <?php selected( $options['border_style'], 'dashed' ); ?>><?php esc_html_e( 'Dashed', 'smartforms' ); ?></option>
			<option value="dotted" <?php selected( $options['border_style'], 'dotted' ); ?>><?php esc_html_e( 'Dotted', 'smartforms' ); ?></option>
			<option value="none" <?php selected( $options['border_style'], 'none' ); ?>><?php esc_html_e( 'None', 'smartforms' ); ?></option>
		</select>
		<?php
	}

	/**
	 * Renders the border width field.
	 *
	 * @return void
	 */
	public function render_border_width_field() {
		$options = get_option( self::OPTION_NAME, array( 'border_width' => 1 ) );
		?>
		<input type="number" name="<?php echo esc_attr( self::OPTION_NAME ); ?>[border_width]" value="<?php echo esc_attr( $options['border_width'] ); ?>" min="0" />
		<?php
	}

	/**
	 * Renders the border radius field.
	 *
	 * @return void
	 */
	public function render_border_radius_field() {
		$options = get_option( self::OPTION_NAME, array( 'border_radius' => 10 ) );
		?>
		<input type="number" name="<?php echo esc_attr( self::OPTION_NAME ); ?>[border_radius]" value="<?php echo esc_attr( $options['border_radius'] ); ?>" min="0" />
		<?php
	}

	/**
	 * Renders the box shadow field.
	 *
	 * @return void
	 */
	public function render_box_shadow_field() {
		$options = get_option( self::OPTION_NAME, array( 'box_shadow' => 'none' ) );
		?>
		<select name="<?php echo esc_attr( self::OPTION_NAME ); ?>[box_shadow]">
			<option value="none" <?php selected( $options['box_shadow'], 'none' ); ?>><?php esc_html_e( 'None', 'smartforms' ); ?></option>
			<option value="small" <?php selected( $options['box_shadow'], 'small' ); ?>><?php esc_html_e( 'Small', 'smartforms' ); ?></option>
			<option value="medium" <?php selected( $options['box_shadow'], 'medium' ); ?>><?php esc_html_e( 'Medium', 'smartforms' ); ?></option>
			<option value="large" <?php selected( $options['box_shadow'], 'large' ); ?>><?php esc_html_e( 'Large', 'smartforms' ); ?></option>
		</select>
		<?php
	}

	/**
	 * Renders the settings page.
	 *
	 * @return void
	 */
	public function render_settings_page() {
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'SmartForms Chat UI Settings', 'smartforms' ); ?></h1>
			<form method="post" action="options.php">
				<?php
				settings_fields( 'smartforms_chat_ui_settings_group' );
				do_settings_sections( 'smartforms-chat-ui-settings' );
				submit_button();
				?>
			</form>
		</div>
		<?php
	}
}

ChatUISettings::get_instance();
