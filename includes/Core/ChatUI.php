<?php
/**
 * Handles the rendering of the SmartForms Chat UI.
 *
 * Retrieves form JSON data (saved as post meta) and the selected theme preset styles,
 * then outputs the chat interface. The interface steps through each form question –
 * displaying only the current question (as a bot message) in the chat dialog area.
 *
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
		return self::render_demo( $form_id );
	}

	/**
	 * Renders a demo chat interface for preview purposes.
	 *
	 * If a valid form ID is provided and saved JSON exists, that JSON (decoded as an
	 * associative array) is used for the multi-step questions. Otherwise, dummy data is used.
	 *
	 * @param int $form_id Optional form ID to load saved questions.
	 * @return string HTML output for the chat UI demo.
	 */
	public static function render_demo( $form_id = 0 ) {
		// Retrieve theme preset styles.
		$theme_styles = ChatUISettings::get_instance()->get_selected_theme_styles();

		// Load saved form data from post meta.
		$form_data = array();
		if ( $form_id ) {
			$saved_json = get_post_meta( $form_id, 'smartforms_data', true );
			$form_data  = $saved_json ? json_decode( $saved_json, true ) : array();
		}

		// Fallback to dummy data if no saved data exists.
		if ( empty( $form_data ) || ! isset( $form_data['fields'] ) ) {
			$form_data = array(
				'fields' => array(
					array(
						'type'        => 'text',
						'label'       => 'Name Input',
						'placeholder' => 'Enter your name',
						'required'    => false,
					),
					array(
						'type'        => 'number',
						'label'       => '',
						'placeholder' => '',
						'required'    => false,
					),
					array(
						'type'        => 'radio',
						'label'       => '',
						'placeholder' => '',
						'required'    => false,
					),
					array(
						'type'        => 'checkbox',
						'label'       => '',
						'placeholder' => '',
						'required'    => false,
					),
					array(
						'type'        => 'select',
						'label'       => '',
						'placeholder' => '',
						'required'    => false,
					),
					array(
						'type'        => 'slider',
						'label'       => '',
						'placeholder' => '',
						'required'    => false,
					),
					array(
						'type'        => 'textarea',
						'label'       => '',
						'placeholder' => '',
						'required'    => false,
					),
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
		$input_bg              = isset( $theme_styles['smartforms_chat_input_container_background_color'] ) ? $theme_styles['smartforms_chat_input_container_background_color'] : $bg_color;
		$input_container_style = sprintf(
			'background-color: %s; border: %dpx %s %s; border-radius: %dpx; box-shadow: %s; padding: 5px;',
			esc_attr( $input_bg ),
			isset( $theme_styles['smartforms_chat_input_container_border_width'] ) ? absint( $theme_styles['smartforms_chat_input_container_border_width'] ) : 1,
			isset( $theme_styles['smartforms_chat_input_container_border_style'] ) ? esc_attr( $theme_styles['smartforms_chat_input_container_border_style'] ) : 'solid',
			isset( $theme_styles['smartforms_chat_input_container_border_color'] ) ? esc_attr( $theme_styles['smartforms_chat_input_container_border_color'] ) : $border_color,
			isset( $theme_styles['smartforms_chat_input_container_border_radius'] ) ? absint( $theme_styles['smartforms_chat_input_container_border_radius'] ) : 5,
			isset( $theme_styles['smartforms_chat_input_container_box_shadow'] ) ? esc_attr( $theme_styles['smartforms_chat_input_container_box_shadow'] ) : '0 2px 5px rgba(0,0,0,0.1)'
		);

		// Submit button styles (unchanged markup).
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
			esc_attr( $submit_line_height ),
			esc_attr( $submit_icon_size )
		);
		
		ob_start();
		?>
		<div id="smartforms-chat-container" class="smartforms-chat-container" style="<?php echo esc_attr( $container_style ); ?>">
			<div class="smartforms-chat-header" style="<?php echo $header_style; ?>">
				<h2 class="smartforms-chat-title"><?php esc_html_e( 'Chat Preview', 'smartforms' ); ?></h2>
			</div>
			<!-- Chat dialog area (initially contains dummy messages, will be replaced by JS) -->
			<div class="smartforms-chat-dialog" id="smartforms-chat-dialog" style="width: 100%; flex: 1; height: 400px; overflow-y: auto; padding: 10px;">
				<div class="smartforms-chat-message bot" style="margin-bottom: 10px;">
					<p style="color: <?php echo esc_attr( $theme_styles['smartforms_chat_dialog_text_color'] ); ?>;">Hello! How can I help you today?</p>
				</div>
				<div class="smartforms-chat-message user" style="margin-bottom: 10px; text-align: right;">
					<p style="color: <?php echo esc_attr( $theme_styles['smartforms_chat_dialog_text_color'] ); ?>;">I need some information.</p>
				</div>
			</div>
			<div class="smartforms-chat-input-container" style="width: 100%; padding: 10px; border-top: 1px solid <?php echo esc_attr( $border_color ); ?>;">
				<div class="smartforms-chat-input-box" style="<?php echo esc_attr( $input_container_style ); ?>; display: flex; flex-direction: column; gap: 5px;">
					<!-- Initially display the normal chat textarea -->
					<textarea class="form-control" rows="4" style="border: none; width: 100%; resize: none; background-color: transparent;" placeholder="<?php esc_attr_e( 'Type your message here...', 'smartforms' ); ?>"></textarea>
					<!-- Submit button row: DO NOT modify this structure -->
					<div style="display: flex; justify-content: flex-end;">
						<button type="button" class="btn" style="<?php echo esc_attr( $submit_button_style ); ?>">
							<i class="<?php echo esc_attr( $submit_icon ); ?>" style="font-size: <?php echo esc_attr( $submit_icon_size ); ?>; line-height: <?php echo esc_attr( $submit_icon_size ); ?>;"></i>
						</button>
					</div>
				</div>
			</div>
		</div>
		<script>
		document.addEventListener("DOMContentLoaded", () => {
			// Expose form data for debugging (optional).
			const formData = <?php echo wp_json_encode( $form_data ); ?>;
			window.formData = formData;
			
			if (!formData || !formData.fields || !formData.fields.length) {
				return;
			}
			
			let currentStep = 0;
			const formResponses = {};
			
			const chatDialog = document.getElementById("smartforms-chat-dialog");
			const inputBox = document.querySelector(".smartforms-chat-input-box");
			const submitButton = document.querySelector(".smartforms-chat-input-box button");
			const botTextColor = "<?php echo esc_js( isset( $theme_styles['smartforms_chat_dialog_text_color'] ) ? $theme_styles['smartforms_chat_dialog_text_color'] : '#000000' ); ?>";
			
			// Get the computed height of the default textarea.
			const defaultTextarea = document.querySelector(".smartforms-chat-input-box textarea");
			const defaultHeight = defaultTextarea ? window.getComputedStyle(defaultTextarea).height : "100px";
			
			/**
			 * Creates an input control based on the field type.
			 * Unknown types default to a textarea.
			 * @param {Object} field - The field configuration.
			 * @returns {HTMLElement} The created input element.
			 */
			const createInputControl = (field) => {
				let control;
				switch (field.type) {
					case "select":
						control = document.createElement("select");
						control.className = "form-control";
						if (field.options && Array.isArray(field.options)) {
							field.options.forEach(opt => {
								const option = document.createElement("option");
								option.value = opt.value;
								option.textContent = opt.label;
								control.appendChild(option);
							});
						}
						break;
					case "slider":
						control = document.createElement("input");
						control.type = "range";
						control.className = "form-control";
						control.min = field.min || 0;
						control.max = field.max || 100;
						control.value = field.value || Math.floor(((field.min || 0) + (field.max || 100)) / 2);
						break;
					case "number":
						control = document.createElement("input");
						control.type = "number";
						control.className = "form-control";
						control.placeholder = field.placeholder || "";
						break;
					default:
						control = document.createElement("textarea");
						control.className = "form-control";
						control.rows = 4;
						control.placeholder = field.placeholder || "Type your answer here...";
				}
				// Force the control to have the same height as the default textarea.
				control.style.height = defaultHeight;
				control.style.minHeight = defaultHeight;
				return control;
			};
			
			/**
			 * Replaces the dynamic input control (first child of the input box) without touching the submit button row.
			 * @param {HTMLElement} newControl - The new input element.
			 */
			const replaceInputControl = (newControl) => {
				if (inputBox.firstElementChild) {
					inputBox.firstElementChild.remove();
				}
				inputBox.insertBefore(newControl, inputBox.firstElementChild);
			};
			
			/**
			 * Displays the current question in the chat dialog, clearing previous content.
			 */
			const showCurrentQuestion = () => {
				const currentField = formData.fields[currentStep];
				chatDialog.innerHTML = "";
				const botMessage = document.createElement("div");
				botMessage.classList.add("smartforms-chat-message", "bot");
				botMessage.style.marginBottom = "10px";
				const p = document.createElement("p");
				p.style.color = botTextColor;
				p.textContent = currentField.label;
				botMessage.appendChild(p);
				chatDialog.appendChild(botMessage);
				chatDialog.scrollTop = chatDialog.scrollHeight;
				const newControl = createInputControl(currentField);
				replaceInputControl(newControl);
			};
			
			// Start with the first question.
			showCurrentQuestion();
			
			submitButton.addEventListener("click", (e) => {
				e.preventDefault();
				const inputControl = inputBox.firstElementChild;
				if (!inputControl) return;
				const answer = inputControl.value;
				formResponses[currentStep] = answer;
				currentStep++;
				if (currentStep < formData.fields.length) {
					showCurrentQuestion();
				} else {
					chatDialog.innerHTML = "";
					const botMessage = document.createElement("div");
					botMessage.classList.add("smartforms-chat-message", "bot");
					botMessage.style.marginBottom = "10px";
					const p = document.createElement("p");
					p.style.color = botTextColor;
					p.textContent = "This is a dummy AI response after form submission.";
					botMessage.appendChild(p);
					chatDialog.appendChild(botMessage);
					chatDialog.scrollTop = chatDialog.scrollHeight;
					const textarea = document.createElement("textarea");
					textarea.className = "form-control";
					textarea.rows = 4;
					textarea.style.border = "none";
					textarea.style.width = "100%";
					textarea.style.resize = "none";
					textarea.style.backgroundColor = "transparent";
					textarea.placeholder = "Type your message here...";
					replaceInputControl(textarea);
				}
			});
		});
		</script>
		<?php
		return ob_get_clean();
	}
}
