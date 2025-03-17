<?php
/**
 * ChatUISettings: Chat theme preset settings for SmartForms.
 *
 * This file registers a submenu under the SmartForms menu where users can select a chat theme preset.
 * The presets are defined in JSON files (e.g., light.json, dark.json) located in the /themes/ folder.
 *
 * A live preview of the chat interface is displayed on the right-hand side.
 *
 * @package SmartForms
 */

namespace SmartForms\CPT;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

use SmartForms\Themes\ThemeLoader;
use SmartForms\Core\ChatUI;

class ChatUISettings {

	/**
	 * Option name for storing the selected chat theme preset.
	 *
	 * @var string
	 */
	const OPTION_NAME = 'smartforms_chat_theme';

	/**
	 * Singleton instance.
	 *
	 * @var ChatUISettings|null
	 */
	private static $instance = null;

	/**
	 * Instance of ThemeLoader.
	 *
	 * @var ThemeLoader
	 */
	private $theme_loader;

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
	 * Private constructor to enforce singleton usage.
	 */
	private function __construct() {
		\SmartForms\Core\SmartForms::log_error( '[DEBUG] ChatUISettings (theme preset) constructor called.' );
		$this->theme_loader = new ThemeLoader();
		add_action( 'admin_menu', array( $this, 'add_submenu_page' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
	}

	/**
	 * Adds a submenu page under the SmartForms menu.
	 *
	 * @return void
	 */
	public function add_submenu_page() {
		add_submenu_page(
			'smartforms',
			__( 'Chat Themes', 'smartforms' ),
			__( 'Themes', 'smartforms' ),
			'manage_options',
			'smartforms-chat-themes',
			array( $this, 'render_settings_page' )
		);
	}

	/**
	 * Registers the theme preset setting.
	 *
	 * @return void
	 */
	public function register_settings() {
		register_setting(
			'smartforms_chat_theme_settings_group',
			self::OPTION_NAME,
			array( 'sanitize_callback' => array( $this, 'sanitize_settings' ) )
		);

		add_settings_section(
			'smartforms_chat_theme_section',
			__( 'Chat Theme Presets', 'smartforms' ),
			null,
			'smartforms-chat-themes'
		);

		add_settings_field(
			'theme_preset',
			__( 'Select Chat Theme', 'smartforms' ),
			array( $this, 'render_theme_field' ),
			'smartforms-chat-themes',
			'smartforms_chat_theme_section'
		);
	}

	/**
	 * Sanitizes the theme preset selection.
	 *
	 * @param string $input The selected theme key.
	 * @return string Sanitized theme key.
	 */
	public function sanitize_settings( $input ) {
		$themes = $this->theme_loader->get_themes();
		if ( isset( $themes[ $input ] ) ) {
			return sanitize_text_field( $input );
		}
		return 'light'; // Fallback default.
	}

	/**
	 * Renders the theme preset selection field.
	 *
	 * @return void
	 */
	public function render_theme_field() {
		$themes  = $this->theme_loader->get_themes();
		$current = get_option( self::OPTION_NAME, 'light' );
		?>
		<select name="<?php echo esc_attr( self::OPTION_NAME ); ?>">
			<?php foreach ( $themes as $key => $preset ) : ?>
				<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $current, $key ); ?>>
					<?php echo esc_html( $preset['label'] ); ?>
				</option>
			<?php endforeach; ?>
		</select>
		<?php
	}

	/**
	 * Retrieves the selected theme preset styles.
	 *
	 * @return array Selected theme styles.
	 */
	public function get_selected_theme_styles() {
		$theme_key = get_option( self::OPTION_NAME, 'light' );
		$preset    = $this->theme_loader->get_theme( $theme_key );
		if ( $preset && isset( $preset['styles'] ) ) {
			return $preset['styles'];
		}
		// Fallback: load 'light' preset if available.
		$preset = $this->theme_loader->get_theme( 'light' );
		return isset( $preset['styles'] ) ? $preset['styles'] : array();
	}

	/**
	 * Renders the settings page with a live preview.
	 *
	 * @return void
	 */
	public function render_settings_page() {
		?>
		<div class="wrap" style="display: flex; gap: 20px;">
			<div class="smartforms-settings-left" style="flex: 1;">
				<h1><?php esc_html_e( 'SmartForms Chat Themes', 'smartforms' ); ?></h1>
				<form method="post" action="options.php">
					<?php
					settings_fields( 'smartforms_chat_theme_settings_group' );
					do_settings_sections( 'smartforms-chat-themes' );
					submit_button();
					?>
				</form>
			</div>
			<div class="smartforms-settings-right" style="flex: 1;">
				<h2><?php esc_html_e( 'Live Preview', 'smartforms' ); ?></h2>
				<div class="smartforms-preview">
					<?php
					// Display the fallback chat UI with no form ID
					echo ChatUI::render( 0 );
					?>
				</div>
			</div>
		</div>
		<?php
	}
}

ChatUISettings::get_instance();
