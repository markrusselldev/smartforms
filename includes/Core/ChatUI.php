<?php
/**
 * Handles the rendering of the SmartForms Chat UI.
 *
 * Retrieves form JSON data (saved as post meta) and the selected theme preset styles,
 * then outputs the chat interface. The interface steps through each form question –
 * displaying the conversation as chat bubbles.
 *
 * @package SmartForms
 */

namespace SmartForms\Core;

use SmartForms\CPT\ChatUISettings;

class ChatUI {

	/**
	 * Renders the chat UI for a given form ID.
	 *
	 * @param int $form_id The ID of the form to render.
	 * @return string HTML output for the chat UI.
	 */
	public static function render( $form_id ) {
		return self::render_chat_ui( $form_id );
	}

	/**
	 * Renders the production-ready chat interface.
	 *
	 * If a valid form ID is provided and saved JSON exists, that JSON (decoded as an
	 * associative array) is used for the conversation. Otherwise, dummy data is used.
	 *
	 * @param int $form_id Optional form ID to load saved questions.
	 * @return string HTML output for the chat UI.
	 */
	public static function render_chat_ui( $form_id = 0 ) {
		// Retrieve theme preset styles.
		$theme_styles = ChatUISettings::get_instance()->get_selected_theme_styles();

		// Load saved form data from post meta.
		$form_data = array();
		if ( $form_id ) {
			$saved_json = get_post_meta( $form_id, 'smartforms_data', true );
			$form_data  = $saved_json ? json_decode( $saved_json, true ) : array();
		}

		// Fallback dummy data if no saved data exists.
		if ( empty( $form_data ) || ! isset( $form_data['fields'] ) ) {
			$form_data = array(
				'fields' => array(
					array(
						'type'              => 'text',
						'label'             => 'Text Input',
						'placeholder'       => '',
						'required'          => true,
						'helpText'          => 'Only letters, numbers, punctuation, symbols & spaces allowed.',
						'validationMessage' => '',
					),
				),
			);
		}

		// Assume that the current field is the first one for demo purposes.
		$current_field = isset( $form_data['fields'][0] ) ? $form_data['fields'][0] : array();

		// Build dynamic CSS from theme settings.
		$css = "
		#smartforms-chat-container {
			--chat-bg-color: " . esc_attr( isset( $theme_styles['smartforms_chat_container_background_color'] ) ? $theme_styles['smartforms_chat_container_background_color'] : '#ffffff' ) . ";
			--chat-border-color: " . esc_attr( isset( $theme_styles['smartforms_chat_container_border_color'] ) ? $theme_styles['smartforms_chat_container_border_color'] : '#cccccc' ) . ";
			--chat-border-style: " . esc_attr( isset( $theme_styles['smartforms_chat_container_border_style'] ) ? $theme_styles['smartforms_chat_container_border_style'] : 'solid' ) . ";
			--chat-border-width: " . absint( isset( $theme_styles['smartforms_chat_container_border_width'] ) ? $theme_styles['smartforms_chat_container_border_width'] : 1 ) . "px;
			--chat-border-radius: " . absint( isset( $theme_styles['smartforms_chat_container_border_radius'] ) ? $theme_styles['smartforms_chat_container_border_radius'] : 10 ) . "px;
			--chat-box-shadow: " . esc_attr( isset( $theme_styles['smartforms_chat_container_box_shadow'] ) ? $theme_styles['smartforms_chat_container_box_shadow'] : 'none' ) . ";
			--chat-padding: " . esc_attr( isset( $theme_styles['smartforms_chat_container_padding'] ) ? $theme_styles['smartforms_chat_container_padding'] : '10px' ) . ";
			--chat-max-width: " . esc_attr( isset( $theme_styles['smartforms_chat_container_max_width'] ) ? $theme_styles['smartforms_chat_container_max_width'] : '800px' ) . ";
			--chat-flex-direction: " . esc_attr( isset( $theme_styles['smartforms_chat_container_flex_direction'] ) ? $theme_styles['smartforms_chat_container_flex_direction'] : 'column' ) . ";
			--chat-justify-content: " . esc_attr( isset( $theme_styles['smartforms_chat_container_justify_content'] ) ? $theme_styles['smartforms_chat_container_justify_content'] : 'center' ) . ";
			--chat-align-items: " . esc_attr( isset( $theme_styles['smartforms_chat_container_align_items'] ) ? $theme_styles['smartforms_chat_container_align_items'] : 'center' ) . ";
		}
		";
		$css = "<style>" . $css . "</style>";

		ob_start();
		?>
		<?php echo $css; ?>
		<!-- Wrap the chat container in a new wrapper to limit overall height -->
		<div class="smartforms-chat-wrapper">
			<div id="smartforms-chat-container" class="smartforms-chat-container">
				<div id="smartforms-chat-header" class="smartforms-chat-header">
					<h2 class="smartforms-chat-title"><?php esc_html_e( 'Chat Interface', 'smartforms' ); ?></h2>
				</div>
				<div id="smartforms-chat-dialog" class="smartforms-chat-dialog"></div>
				<form id="smartforms-chat-form" class="smartforms-chat-form">
					<div id="smartforms-chat-input-container" class="smartforms-chat-input-container">
						<div id="smartforms-chat-input-box" class="smartforms-chat-input-box">
							<!-- The input control will be injected here by JS -->
						</div>
						<div id="smartforms-chat-submit-row" class="smartforms-chat-submit-row">
							<div id="smartforms-chat-help-container" class="smartforms-chat-help-container">
								<?php
								// Display the help text from the current field (default).
								if ( isset( $current_field['helpText'] ) && '' !== $current_field['helpText'] ) {
									echo esc_html( $current_field['helpText'] );
								} else {
									echo esc_html__( 'Enter your help text', 'smartforms' );
								}
								?>
							</div>
							<button type="button" id="smartforms-chat-submit-button" class="btn smartforms-chat-submit-button">
								<i class="<?php echo esc_attr( isset( $theme_styles['smartforms_chat_submit_button_icon'] ) ? $theme_styles['smartforms_chat_submit_button_icon'] : 'fas fa-arrow-up' ); ?> smartforms-chat-submit-icon"></i>
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
		<script>
			document.addEventListener("DOMContentLoaded", () => {
				window.formData = <?php echo wp_json_encode( $form_data ); ?>;
				window.smartformsFormId = <?php echo get_the_ID(); ?>;
			});
		</script>
		<?php
		return ob_get_clean();
	}
}

ChatUI::get_instance(); // or your equivalent initialization call.
