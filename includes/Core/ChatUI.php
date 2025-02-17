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

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

use SmartForms\CPT\ChatUISettings;

class ChatUI {

	/**
	 * Renders the chat UI for a given form ID.
	 *
	 * @param int $form_id The ID of the form to render.
	 * @return string HTML output for the chat UI.
	 */
	public static function render( $form_id ) {
		// Renaming our method from "demo" to "chat_ui" for production.
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

		// Fallback to dummy data if no saved data exists.
		// Note: We've updated the dummy data to include a default helpText.
		if ( empty( $form_data ) || ! isset( $form_data['fields'] ) ) {
			$form_data = array(
				'fields' => array(
					array(
						'type'             => 'text',
						'label'            => 'Name Input',
						'placeholder'      => 'Enter your name',
						'required'         => false,
						'defaultValue'     => '',
						'id'               => 'text-' . uniqid(),
						'helpText'         => 'Only letters, numbers, punctuation, symbols & spaces allowed.',
						'validationMessage'=> ''
					),
					// Additional dummy fields can be added here.
				),
			);
		}

		// Container layout properties.
		$bg_color        = isset( $theme_styles['smartforms_chat_container_background_color'] ) ? $theme_styles['smartforms_chat_container_background_color'] : '#ffffff';
		$border_color    = isset( $theme_styles['smartforms_chat_container_border_color'] ) ? $theme_styles['smartforms_chat_container_border_color'] : '#cccccc';
		$border_style    = isset( $theme_styles['smartforms_chat_container_border_style'] ) ? $theme_styles['smartforms_chat_container_border_style'] : 'solid';
		$border_width    = isset( $theme_styles['smartforms_chat_container_border_width'] ) ? absint( $theme_styles['smartforms_chat_container_border_width'] ) : 1;
		$border_radius   = isset( $theme_styles['smartforms_chat_container_border_radius'] ) ? absint( $theme_styles['smartforms_chat_container_border_radius'] ) : 10;
		$box_shadow      = isset( $theme_styles['smartforms_chat_container_box_shadow'] ) ? $theme_styles['smartforms_chat_container_box_shadow'] : 'none';
		$padding         = isset( $theme_styles['smartforms_chat_container_padding'] ) ? $theme_styles['smartforms_chat_container_padding'] : '10px';
		$max_width       = isset( $theme_styles['smartforms_chat_container_max_width'] ) ? $theme_styles['smartforms_chat_container_max_width'] : '800px';
		$flex_direction  = isset( $theme_styles['smartforms_chat_container_flex_direction'] ) ? $theme_styles['smartforms_chat_container_flex_direction'] : 'column';
		$justify_content = isset( $theme_styles['smartforms_chat_container_justify_content'] ) ? $theme_styles['smartforms_chat_container_justify_content'] : 'center';
		$align_items     = isset( $theme_styles['smartforms_chat_container_align_items'] ) ? $theme_styles['smartforms_chat_container_align_items'] : 'center';

		$container_style = sprintf(
			'display: flex; flex-direction: %s; justify-content: %s; align-items: %s; max-width: %s; margin: 20px auto; background-color: %s; border: %dpx %s %s; border-radius: %dpx; box-shadow: %s; padding: %s;',
			esc_attr( $flex_direction ),
			esc_attr( $justify_content ),
			esc_attr( $align_items ),
			esc_attr( $max_width ),
			esc_attr( $bg_color ),
			$border_width,
			esc_attr( $border_style ),
			esc_attr( $border_color ),
			$border_radius,
			esc_attr( $box_shadow ),
			esc_attr( $padding )
		);

		// Header styling.
		$header_text_color  = isset( $theme_styles['smartforms_chat_header_text_color'] ) ? $theme_styles['smartforms_chat_header_text_color'] : '#000000';
		$header_font_family = isset( $theme_styles['smartforms_chat_header_font_family'] ) ? $theme_styles['smartforms_chat_header_font_family'] : 'sans-serif';
		$header_font_size   = isset( $theme_styles['smartforms_chat_header_font_size'] ) ? $theme_styles['smartforms_chat_header_font_size'] : '18px';
		$header_style       = sprintf(
			'width: 100%%; padding: 10px; border-bottom: 1px solid %s; color: %s; font-family: %s; font-size: %s;',
			esc_attr( $border_color ),
			esc_attr( $header_text_color ),
			esc_attr( $header_font_family ),
			esc_attr( $header_font_size )
		);

		// Input container styles.
		$input_container_style = sprintf(
			'background-color: %s; border: %dpx %s %s; border-radius: %dpx; box-shadow: %s; padding: 5px;',
			esc_attr( $theme_styles['smartforms_chat_input_container_background_color'] ) ? esc_attr( $theme_styles['smartforms_chat_input_container_background_color'] ) : esc_attr( $bg_color ),
			isset( $theme_styles['smartforms_chat_input_container_border_width'] ) ? absint( $theme_styles['smartforms_chat_input_container_border_width'] ) : 1,
			isset( $theme_styles['smartforms_chat_input_container_border_style'] ) ? esc_attr( $theme_styles['smartforms_chat_input_container_border_style'] ) : 'solid',
			isset( $theme_styles['smartforms_chat_input_container_border_color'] ) ? esc_attr( $theme_styles['smartforms_chat_input_container_border_color'] ) : esc_attr( $border_color ),
			isset( $theme_styles['smartforms_chat_input_container_border_radius'] ) ? absint( $theme_styles['smartforms_chat_input_container_border_radius'] ) : 5,
			isset( $theme_styles['smartforms_chat_input_container_box_shadow'] ) ? esc_attr( $theme_styles['smartforms_chat_input_container_box_shadow'] ) : '0 2px 5px rgba(0,0,0,0.1)'
		);

		// Submit button styles.
		$submit_size          = isset( $theme_styles['smartforms_chat_submit_button_size'] ) ? $theme_styles['smartforms_chat_submit_button_size'] : '36px';
		$submit_bg            = isset( $theme_styles['smartforms_chat_submit_button_background_color'] ) ? $theme_styles['smartforms_chat_submit_button_background_color'] : '#007bff';
		$submit_text          = isset( $theme_styles['smartforms_chat_submit_button_text_color'] ) ? $theme_styles['smartforms_chat_submit_button_text_color'] : '#ffffff';
		$submit_border        = isset( $theme_styles['smartforms_chat_submit_button_border_color'] ) ? $theme_styles['smartforms_chat_submit_button_border_color'] : '#007bff';
		$submit_border_style  = isset( $theme_styles['smartforms_chat_submit_button_border_style'] ) ? $theme_styles['smartforms_chat_submit_button_border_style'] : 'solid';
		$submit_border_width  = isset( $theme_styles['smartforms_chat_submit_button_border_width'] ) ? absint( $theme_styles['smartforms_chat_submit_button_border_width'] ) : 1;
		$submit_border_radius = isset( $theme_styles['smartforms_chat_submit_button_border_radius'] ) ? $theme_styles['smartforms_chat_submit_button_border_radius'] : '50%';
		$submit_icon          = isset( $theme_styles['smartforms_chat_submit_button_icon'] ) ? $theme_styles['smartforms_chat_submit_button_icon'] : 'fas fa-arrow-up';
		$submit_font_size     = $submit_size;
		$submit_line_height   = $submit_size;
		if ( isset( $theme_styles['smartforms_chat_submit_icon_size'] ) && ! empty( $theme_styles['smartforms_chat_submit_icon_size'] ) ) {
			$submit_icon_size = $theme_styles['smartforms_chat_submit_icon_size'];
		} else {
			$submit_size_numeric = intval( preg_replace( '/\D/', '', $submit_size ) );
			$submit_icon_size    = ( $submit_size_numeric * 0.8 ) . 'px';
		}
		
		$submit_button_style = sprintf(
			'background-color: %s; color: %s; border: %dpx %s %s; border-radius: %s; width: %s; height: %s; font-size: %s; line-height: %s; display: flex; align-items: center; justify-content: center;',
			esc_attr( $submit_bg ),
			esc_attr( $submit_text ),
			$submit_border_width,
			esc_attr( $submit_border_style ),
			esc_attr( $submit_border ),
			esc_attr( $submit_border_radius ),
			esc_attr( $submit_size ),
			esc_attr( $submit_size ),
			esc_attr( $submit_font_size ),
			esc_attr( $submit_line_height )
		);

		// Start output buffering.
		ob_start();
		?>
		<div id="smartforms-chat-container" class="smartforms-chat-container" style="<?php echo esc_attr( $container_style ); ?>">
			<div class="smartforms-chat-header" style="<?php echo $header_style; ?>">
				<h2 class="smartforms-chat-title"><?php esc_html_e( 'Chat Interface', 'smartforms' ); ?></h2>
			</div>
			<!-- Chat dialog area -->
			<div class="smartforms-chat-dialog" id="smartforms-chat-dialog" style="width: 100%; flex: 1; height: 400px; overflow-y: auto; padding: 10px;">
			</div>
			<!-- Wrap the input area in a form for JustValidate. Explicitly set the form's width to 100% -->
			<form id="smartforms-chat-form" style="width: 100%;">
				<div class="smartforms-chat-input-container" style="width: 100%; padding: 10px; border-top: 1px solid <?php echo esc_attr( $border_color ); ?>;">
					<div class="smartforms-chat-input-box" style="<?php echo esc_attr( $input_container_style ); ?>; display: flex; flex-direction: column; gap: 5px;">
						<!-- The initial input control will be replaced by JavaScript based on the current question -->
						<textarea id="smartforms-current-input" class="form-control" rows="4" style="border: none; width: 100%; resize: none; background-color: transparent;" placeholder="<?php esc_attr_e( 'Type your answer here...', 'smartforms' ); ?>"></textarea>
						<!-- Submit button row: DO NOT modify this structure -->
						<div style="display: flex; justify-content: flex-end;">
							<button type="button" class="btn" style="<?php echo esc_attr( $submit_button_style ); ?>">
								<i class="<?php echo esc_attr( $submit_icon ); ?>" style="font-size: <?php echo esc_attr( $submit_icon_size ); ?>; line-height: <?php echo esc_attr( $submit_icon_size ); ?>;"></i>
							</button>
						</div>
					</div>
				</div>
			</form>
		</div>
		<script>
			// Expose form data and the current form ID globally.
			document.addEventListener("DOMContentLoaded", () => {
				window.formData = <?php echo wp_json_encode( $form_data ); ?>;
				window.smartformsFormId = <?php echo get_the_ID(); ?>;
			});
		</script>
		<?php
		return ob_get_clean();
	}
}
