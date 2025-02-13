<?php
/**
 * Handles the rendering of the SmartForms Chat UI.
 *
 * Provides a static method to render the chat interface for a given form ID.
 * Global style settings are retrieved from a nested options array (stored under
 * the option key "smartforms_chat_ui_styles") and applied to various parts of the UI.
 *
 * @package SmartForms
 */

namespace SmartForms\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

class ChatUI {

	/**
	 * Renders the chat UI for a given form ID.
	 *
	 * Retrieves form JSON data and global style settings, then outputs the chat UI.
	 *
	 * @param int $form_id The ID of the form to render.
	 * @return string HTML output for the chat UI.
	 */
	public static function render( $form_id ) {
		$form = get_post( $form_id );
		if ( ! $form || 'smart_form' !== get_post_type( $form_id ) ) {
			return '<p>' . esc_html__( 'Form not found.', 'smartforms' ) . '</p>';
		}

		// Retrieve the stored form JSON data.
		$form_data = get_post_meta( $form_id, 'smartforms_data', true );
		$form_json = json_decode( $form_data, true );
		if ( empty( $form_json ) || empty( $form_json['fields'] ) ) {
			\SmartForms\Core\SmartForms::log_error(
				'[DEBUG] No form data available for form ID: ' . esc_html( $form_id ) . '. Raw meta: ' . $form_data
			);
			return '<p>' . esc_html__( 'No form fields available.', 'smartforms' ) . '</p>';
		}

		// Retrieve per-form styling.
		$width = get_post_meta( $form_id, '_smartforms_width', true );
		$width = ! empty( $width ) ? $width : '400px';

		/*
		 * Define the default global styles.
		 * This nested structure includes settings for:
		 *   - Chat container
		 *   - Chat dialog
		 *   - Form
		 *   - Fields (each field type can have its own defaults)
		 *   - Button
		 */
		$default_styles = array(
			'chat_container' => array(
				'background_color' => '#ffffff',
				'border'           => array(
					'color'  => '#cccccc',
					'style'  => 'solid',
					'width'  => 1,      // pixels
					'radius' => 10,     // pixels
				),
				'box_shadow'       => 'none',
				'padding'          => '10px',
				'margin'           => '10px',
				'layout'           => array(
					'type'            => 'flex',
					'flex_direction'  => 'column',
					'justify_content' => 'center',
					'align_items'     => 'center',
				),
				'theme'            => 'bootstrap-default',
			),
			'chat_dialog'    => array(
				'background_color' => '#f8f9fa',
				'text_color'       => '#333333',
				'font_family'      => 'Helvetica, Arial, sans-serif',
				'font_size'        => '14px',
				'padding'          => '8px',
				'border'           => array(
					'color'  => '#dddddd',
					'style'  => 'solid',
					'width'  => 1,
					'radius' => 5,
				),
			),
			'form'           => array(
				'background_color' => '#ffffff',
				'font_family'      => 'Helvetica, Arial, sans-serif',
				'font_size'        => '14px',
				'text_color'       => '#333333',
				'padding'          => '15px',
			),
			'fields'         => array(
				'checkbox' => array(
					'background_color' => '#ffffff',
					'border'           => array(
						'color'  => '#cccccc',
						'style'  => 'solid',
						'width'  => 1,
						'radius' => 3,
					),
					'padding'    => '5px',
					'margin'     => '5px',
					'font_size'  => 'inherit',
					'text_color' => '#000000',
				),
				'progress' => array(
					'background_color' => '#eeeeee',
					'text_color'       => '#000000',
					'padding'          => '5px',
				),
				'slider'   => array(
					'background_color' => '#ffffff',
					'border'           => array(
						'color'  => '#cccccc',
						'style'  => 'solid',
						'width'  => 1,
						'radius' => 5,
					),
					'padding'    => '5px',
					'margin'     => '5px',
					'text_color' => '#000000',
				),
				'group'    => array(
					'background_color' => '#ffffff',
					'border'           => array(
						'color'  => '#cccccc',
						'style'  => 'solid',
						'width'  => 1,
						'radius' => 5,
					),
					'padding'    => '10px',
					'margin'     => '5px',
					'text_color' => '#000000',
				),
				'radio'    => array(
					'background_color' => '#ffffff',
					'border'           => array(
						'color'  => '#cccccc',
						'style'  => 'solid',
						'width'  => 1,
						'radius' => 5,
					),
					'padding'    => '5px',
					'margin'     => '5px',
					'text_color' => '#000000',
				),
				'text'     => array(
					'background_color' => '#ffffff',
					'border'           => array(
						'color'  => '#cccccc',
						'style'  => 'solid',
						'width'  => 1,
						'radius' => 3,
					),
					'padding'    => '5px',
					'margin'     => '5px',
					'text_color' => '#000000',
				),
				'number'   => array(
					'background_color' => '#ffffff',
					'border'           => array(
						'color'  => '#cccccc',
						'style'  => 'solid',
						'width'  => 1,
						'radius' => 3,
					),
					'padding'    => '5px',
					'margin'     => '5px',
					'text_color' => '#000000',
				),
				'select'   => array(
					'background_color' => '#ffffff',
					'border'           => array(
						'color'  => '#cccccc',
						'style'  => 'solid',
						'width'  => 1,
						'radius' => 3,
					),
					'padding'    => '5px',
					'margin'     => '5px',
					'text_color' => '#000000',
				),
				'textarea' => array(
					'background_color' => '#ffffff',
					'border'           => array(
						'color'  => '#cccccc',
						'style'  => 'solid',
						'width'  => 1,
						'radius' => 3,
					),
					'padding'    => '5px',
					'margin'     => '5px',
					'text_color' => '#000000',
				),
			),
			'button'         => array(
				'background_color' => '#007bff',
				'text_color'       => '#ffffff',
				'border'           => array(
					'color'  => '#007bff',
					'style'  => 'solid',
					'width'  => 1,
					'radius' => 4,
				),
				'hover'            => array(
					'background_color' => '#0056b3',
					'text_color'       => '#ffffff',
				),
			),
		);

		// Retrieve global styles from the option.
		$global_styles = get_option( 'smartforms_chat_ui_styles', $default_styles );
		$chat_cont     = isset( $global_styles['chat_container'] ) ? $global_styles['chat_container'] : $default_styles['chat_container'];

		// Extract chat container style values.
		$bg_color   = ! empty( $chat_cont['background_color'] ) ? $chat_cont['background_color'] : '#ffffff';
		$border     = isset( $chat_cont['border'] ) ? $chat_cont['border'] : array();
		$b_color    = isset( $border['color'] ) ? $border['color'] : '#cccccc';
		$b_style    = isset( $border['style'] ) ? $border['style'] : 'solid';
		$b_width    = isset( $border['width'] ) ? absint( $border['width'] ) : 1;
		$b_radius   = isset( $border['radius'] ) ? absint( $border['radius'] ) : 10;
		$box_shadow = ! empty( $chat_cont['box_shadow'] ) ? $chat_cont['box_shadow'] : 'none';
		$padding    = ! empty( $chat_cont['padding'] ) ? $chat_cont['padding'] : '10px';
		$margin     = ! empty( $chat_cont['margin'] ) ? $chat_cont['margin'] : '10px';

		// Build the inline style string for the chat container.
		$inline_style = sprintf(
			'width: %s; background-color: %s; border: %dpx %s %s; border-radius: %dpx; box-shadow: %s; padding: %s; margin: %s;',
			esc_attr( $width ),
			esc_attr( $bg_color ),
			$b_width,
			esc_attr( $b_style ),
			esc_attr( $b_color ),
			$b_radius,
			esc_attr( $box_shadow ),
			esc_attr( $padding ),
			esc_attr( $margin )
		);

		ob_start();
		?>
<div id="smartforms-chat-container" class="smartforms-chat-container" style="<?php echo esc_attr( $inline_style ); ?>">
	<div class="smartforms-chat-header">
		<h2 class="smartforms-chat-title"><?php echo esc_html( get_the_title( $form_id ) ); ?></h2>
	</div>
	<div class="smartforms-chat-dialog" id="smartforms-chat-dialog">
		<div class="smartforms-chat-content" id="smartforms-chat-ui" data-form-id="<?php echo esc_attr( $form_id ); ?>">
			<!-- Chat messages and form fields load here dynamically -->
		</div>
		<div class="smartforms-chat-form" style="<?php echo esc_attr( self::build_form_inline_style( $global_styles, $default_styles ) ); ?>">
			<!-- Form container styling applied here -->
		</div>
	</div>
	<div class="smartforms-chat-footer">
		<button type="button" id="prev-btn" class="btn btn-secondary" style="display: none;"><?php esc_html_e( 'Back', 'smartforms' ); ?></button>
		<button type="button" id="next-btn" class="btn btn-primary"><?php esc_html_e( 'Next', 'smartforms' ); ?></button>
	</div>
</div>
<script>
document.addEventListener("DOMContentLoaded", function() {
	const chat_ui = document.getElementById("smartforms-chat-ui");
	const form_id = chat_ui.getAttribute("data-form-id");
	let current_step = 0;
	let steps = [];

	fetch("/wp-json/smartforms/v1/form/" + form_id)
		.then(function(response) {
			return response.json();
		})
		.then(function(form_data) {
			if (! form_data.fields) {
				chat_ui.innerHTML = "<p class='text-danger'>Error: No form fields available.</p>";
				return;
			}
			steps = form_data.fields.map(function(field, index) {
				const step = document.createElement("div");
				step.classList.add("smartforms-chat-step", "mb-3", "d-none");
				step.id = "step-" + index;
				let input_el;
				switch (field.type) {
					case "radio":
						input_el = document.createElement("div");
						if (Array.isArray(field.options)) {
							field.options.forEach(function(option) {
								input_el.innerHTML += 
									'<div class="form-check">' +
										'<input class="form-check-input" type="radio" name="step-' + index + '" value="' + option + '">' +
										'<label class="form-check-label">' + option + '</label>' +
									'</div>';
							});
						} else {
							console.warn("Field \"" + field.label + "\" is missing options. Skipping.");
						}
						break;
					case "select":
						input_el = document.createElement("select");
						input_el.classList.add("form-select");
						if (Array.isArray(field.options)) {
							field.options.forEach(function(option) {
								const opt = document.createElement("option");
								opt.value = option;
								opt.textContent = option;
								input_el.appendChild(opt);
							});
						} else {
							console.warn("Field \"" + field.label + "\" is missing options. Skipping.");
						}
						break;
					case "slider":
						input_el = document.createElement("input");
						input_el.type = "range";
						input_el.classList.add("form-range");
						input_el.min = field.min || 0;
						input_el.max = field.max || 100;
						input_el.step = field.step || 1;
						break;
					default:
						input_el = document.createElement("input");
						input_el.type = "text";
						input_el.classList.add("form-control");
						input_el.placeholder = field.placeholder || "";
						break;
				}
				const label_el = document.createElement("label");
				label_el.textContent = field.label;
				label_el.classList.add("form-label");
				step.appendChild(label_el);
				step.appendChild(input_el);
				chat_ui.appendChild(step);
				return step;
			});
			if (steps.length > 0) {
				steps[0].classList.remove("d-none");
			}
			function update_buttons() {
				const prev_btn = document.getElementById("prev-btn");
				const next_btn = document.getElementById("next-btn");
				prev_btn.style.display = current_step > 0 ? "inline-block" : "none";
				next_btn.innerText = current_step === steps.length - 1 ? "Submit" : "Next";
			}
			update_buttons();
		})
		.catch(function(error) {
			console.error("Error loading form data:", error);
			chat_ui.innerHTML = "<p class='text-danger'>Error loading form.</p>";
		});
	
	document.getElementById("next-btn").addEventListener("click", function() {
		if (current_step < steps.length - 1) {
			steps[current_step].classList.add("d-none");
			current_step++;
			steps[current_step].classList.remove("d-none");
			update_buttons();
		} else {
			alert("Form submitted! (Simulated)");
		}
	});
	document.getElementById("prev-btn").addEventListener("click", function() {
		if (current_step > 0) {
			steps[current_step].classList.add("d-none");
			current_step--;
			steps[current_step].classList.remove("d-none");
			update_buttons();
		}
	});
});
</script>
<?php
		return ob_get_clean();
	}

	/**
	 * Builds the inline style string for the form container.
	 *
	 * @param array $global_styles  The global styles array.
	 * @param array $default_styles The default styles array.
	 * @return string Inline style for the form container.
	 */
	private static function build_form_inline_style( $global_styles, $default_styles ) {
		$form_styles = isset( $global_styles['form'] )
			? $global_styles['form']
			: $default_styles['form'];
		$bg_color    = ! empty( $form_styles['background_color'] )
			? $form_styles['background_color']
			: '#ffffff';
		$font_family = ! empty( $form_styles['font_family'] )
			? $form_styles['font_family']
			: 'Helvetica, Arial, sans-serif';
		$font_size   = ! empty( $form_styles['font_size'] )
			? $form_styles['font_size']
			: '14px';
		$text_color  = ! empty( $form_styles['text_color'] )
			? $form_styles['text_color']
			: '#333333';
		$padding     = ! empty( $form_styles['padding'] )
			? $form_styles['padding']
			: '15px';
		return sprintf(
			'background-color: %s; font-family: %s; font-size: %s; color: %s; padding: %s;',
			esc_attr( $bg_color ),
			esc_attr( $font_family ),
			esc_attr( $font_size ),
			esc_attr( $text_color ),
			esc_attr( $padding )
		);
	}
}
