<?php
/**
 * Handles the rendering of the SmartForms Chat UI.
 *
 * Retrieves form JSON data (saved as post meta) and the selected theme preset styles,
 * then outputs the chat interface. The interface steps through each form question –
 * displaying only the current question (as a bot message) in the chat dialog area.
 * Once all questions are answered, a dummy AI response is appended and the input area
 * reverts to a standard chat textarea.
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
	 * associative array) is used for the multi-step questions. Otherwise, dummy data is used.
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

		// Assume the current field is the first one for default help text.
		$current_field = isset( $form_data['fields'][0] ) ? $form_data['fields'][0] : array();

		// Build dynamic CSS using heredoc for clarity.
		$chat_bg_color   = esc_attr( $theme_styles['smartforms_chat_container_background_color'] ?? '#ffffff' );
		$border_color    = esc_attr( $theme_styles['smartforms_chat_container_border_color'] ?? '#cccccc' );
		$border_style    = esc_attr( $theme_styles['smartforms_chat_container_border_style'] ?? 'solid' );
		$border_width    = absint( $theme_styles['smartforms_chat_container_border_width'] ?? 1 );
		$border_radius   = absint( $theme_styles['smartforms_chat_container_border_radius'] ?? 10 );
		$box_shadow      = esc_attr( $theme_styles['smartforms_chat_container_box_shadow'] ?? 'none' );
		$padding         = esc_attr( $theme_styles['smartforms_chat_container_padding'] ?? '10px' );
		$max_width       = esc_attr( $theme_styles['smartforms_chat_container_max_width'] ?? '800px' );
		$flex_direction  = esc_attr( $theme_styles['smartforms_chat_container_flex_direction'] ?? 'column' );
		$justify_content = esc_attr( $theme_styles['smartforms_chat_container_justify_content'] ?? 'center' );
		$align_items     = esc_attr( $theme_styles['smartforms_chat_container_align_items'] ?? 'center' );

		$css = <<<CSS
<style>
#smartforms-chat-container {
	--chat-bg-color: {$chat_bg_color};
	--chat-border-color: {$border_color};
	--chat-border-style: {$border_style};
	--chat-border-width: {$border_width}px;
	--chat-border-radius: {$border_radius}px;
	--chat-box-shadow: {$box_shadow};
	--chat-padding: {$padding};
	--chat-max-width: {$max_width};
	--chat-flex-direction: {$flex_direction};
	--chat-justify-content: {$justify_content};
	--chat-align-items: {$align_items};
}
</style>
CSS;

		// Conditionally add classes based on context.
		$wrapper_class = 'smartforms-chat-wrapper';
		if ( is_admin() ) {
			$wrapper_class .= ' admin-display';
		} elseif ( is_admin_bar_showing() ) {
			$wrapper_class .= ' admin-bar-present';
		}

		ob_start();
		?>
		<?php echo $css; ?>
		<div class="<?php echo esc_attr( $wrapper_class ); ?>">
			<div id="smartforms-chat-container" class="smartforms-chat-container">
				<div id="smartforms-chat-header" class="smartforms-chat-header">
					<h2 class="smartforms-chat-title"><?php esc_html_e( 'Chat Interface', 'smartforms' ); ?></h2>
				</div>
				<div id="smartforms-chat-dialog" class="smartforms-chat-dialog"></div>
				<form id="smartforms-chat-form" class="smartforms-chat-form">
					<div id="smartforms-chat-input-container" class="smartforms-chat-input-container">
						<div id="smartforms-chat-input-box" class="smartforms-chat-input-box">
							<textarea id="smartforms-current-input" class="form-control smartforms-chat-input" rows="4" placeholder="<?php esc_attr_e( 'Type your answer here...', 'smartforms' ); ?>"></textarea>
						</div>
						<div id="smartforms-chat-submit-row" class="smartforms-chat-submit-row">
							<div id="smartforms-chat-help-container" class="smartforms-chat-help-container">
								<?php
								if ( isset( $current_field['helpText'] ) && '' !== $current_field['helpText'] ) {
									echo esc_html( $current_field['helpText'] );
								} else {
									echo esc_html__( 'Enter your help text', 'smartforms' );
								}
								?>
							</div>
							<button type="button" id="smartforms-chat-submit-button" class="btn smartforms-chat-submit-button">
								<i class="<?php echo esc_attr( $theme_styles['smartforms_chat_submit_button_icon'] ?? 'fas fa-arrow-up' ); ?> smartforms-chat-submit-icon"></i>
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
