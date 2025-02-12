<?php
/**
 * Handles the rendering of the SmartForms Chat UI.
 *
 * @package SmartForms
 */

namespace SmartForms\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

/**
 * Class ChatUI
 *
 * Provides a static method to render the chat UI for a given form ID.
 */
class ChatUI {

	/**
	 * Render the chat UI for a given form ID.
	 *
	 * @param int $form_id The ID of the form to render.
	 * @return string The HTML output for the chat UI.
	 */
	public static function render( $form_id ) {
		$form = get_post( $form_id );

		if ( ! $form || 'smart_form' !== get_post_type( $form_id ) ) {
			return '<p>' . esc_html__( 'Form not found.', 'smartforms' ) . '</p>';
		}

		// Fetch stored form meta data (JSON config).
		$form_data = get_post_meta( $form_id, 'smartforms_data', true );
		$form_json = json_decode( $form_data, true );

		// If no JSON data is available, log the raw meta value for debugging.
		if ( empty( $form_json ) || empty( $form_json['fields'] ) ) {
			\SmartForms\Core\SmartForms::log_error( '[DEBUG] No form data available for form ID: ' . esc_html( $form_id ) . '. Raw meta: ' . $form_data );
			return '<p>' . esc_html__( 'No form fields available.', 'smartforms' ) . '</p>';
		}

		/*
		 * Retrieve per‑form styling from post meta.
		 * Here we use the per‑form width, but we use the global settings for
		 * the remaining visual properties.
		 */
		$width = get_post_meta( $form_id, '_smartforms_width', true );
		$width = $width ? $width : '400px'; // Fallback default width.

		// Get global chat UI style settings from the options table.
		$global_styles = get_option(
			'smartforms_chat_ui_styles',
			array(
				'background_color' => '#ffffff',
				'border_color'     => '#cccccc',
				'border_style'     => 'solid',
				'border_width'     => 1,
				'border_radius'    => 10,
				'box_shadow'       => 'none',
			)
		);

		$global_bg_color      = ! empty( $global_styles['background_color'] ) ? $global_styles['background_color'] : '#ffffff';
		$global_border_color  = ! empty( $global_styles['border_color'] ) ? $global_styles['border_color'] : '#cccccc';
		$global_border_style  = ! empty( $global_styles['border_style'] ) ? $global_styles['border_style'] : 'solid';
		$global_border_width  = ! empty( $global_styles['border_width'] ) ? absint( $global_styles['border_width'] ) : 1;
		$global_border_radius = ! empty( $global_styles['border_radius'] ) ? absint( $global_styles['border_radius'] ) : 10;
		$global_box_shadow    = ! empty( $global_styles['box_shadow'] ) ? $global_styles['box_shadow'] : 'none';

		// Build inline style string incorporating both per‑form and global settings.
		$inline_style = sprintf(
			'width: %s; background-color: %s; border: %dpx %s %s; border-radius: %dpx; box-shadow: %s;',
			esc_attr( $width ),
			esc_attr( $global_bg_color ),
			absint( $global_border_width ),
			esc_attr( $global_border_style ),
			esc_attr( $global_border_color ),
			absint( $global_border_radius ),
			esc_attr( $global_box_shadow )
		);

		ob_start();
		?>
		<div class="container mt-4">
			<div class="card shadow-lg p-3">
				<!-- Note that we escape the inline style output -->
				<div class="card-body" style="<?php echo esc_attr( $inline_style ); ?>">
					<h2 class="text-center"><?php echo esc_html( get_the_title( $form_id ) ); ?></h2>
					<!-- Wrap the chat UI in an HTML form for proper semantics -->
					<form method="post" action="">
						<div id="smartforms-chat-ui" data-form-id="<?php echo esc_attr( $form_id ); ?>"></div>
						<div class="d-flex justify-content-between mt-3">
							<button type="button" id="prev-btn" class="btn btn-secondary" style="display: none;"><?php esc_html_e( 'Back', 'smartforms' ); ?></button>
							<button type="button" id="next-btn" class="btn btn-primary"><?php esc_html_e( 'Next', 'smartforms' ); ?></button>
						</div>
					</form>
				</div>
			</div>
		</div>
		<script>
			document.addEventListener("DOMContentLoaded", function() {
				const chatContainer = document.getElementById("smartforms-chat-ui");
				const formId = chatContainer.getAttribute("data-form-id");
				let currentStep = 0;
				let steps = [];

				// Load form JSON dynamically.
				fetch("/wp-json/smartforms/v1/form/" + formId)
					.then(function(response) {
						return response.json();
					})
					.then(function(formData) {
						if (!formData.fields) {
							chatContainer.innerHTML = "<p class='text-danger'>Error: No form fields available.</p>";
							return;
						}

						steps = formData.fields.map(function(field, index) {
							const stepDiv = document.createElement("div");
							stepDiv.classList.add("smartforms-chat-step", "mb-3", "d-none");
							stepDiv.id = "step-" + index;

							let inputElement;
							switch (field.type) {
								case "radio":
									inputElement = document.createElement("div");
									if (Array.isArray(field.options)) {
										field.options.forEach(function(option) {
											inputElement.innerHTML += 
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
									inputElement = document.createElement("select");
									inputElement.classList.add("form-select");
									if (Array.isArray(field.options)) {
										field.options.forEach(function(option) {
											const optionElem = document.createElement("option");
											optionElem.value = option;
											optionElem.textContent = option;
											inputElement.appendChild(optionElem);
										});
									} else {
										console.warn("Field \"" + field.label + "\" is missing options. Skipping.");
									}
									break;

								case "slider":
									inputElement = document.createElement("input");
									inputElement.type = "range";
									inputElement.classList.add("form-range");
									inputElement.min = field.min || 0;
									inputElement.max = field.max || 100;
									inputElement.step = field.step || 1;
									break;

								default:
									inputElement = document.createElement("input");
									inputElement.type = "text";
									inputElement.classList.add("form-control");
									inputElement.placeholder = field.placeholder || "";
									break;
							}

							const labelElem = document.createElement("label");
							labelElem.textContent = field.label;
							labelElem.classList.add("form-label");

							stepDiv.appendChild(labelElem);
							stepDiv.appendChild(inputElement);
							chatContainer.appendChild(stepDiv);

							return stepDiv;
						});

						if (steps.length > 0) {
							steps[0].classList.remove("d-none");
						}

						function updateButtons() {
							const prevButton = document.getElementById("prev-btn");
							const nextButton = document.getElementById("next-btn");
							prevButton.style.display = currentStep > 0 ? "inline-block" : "none";
							nextButton.innerText = currentStep === steps.length - 1 ? "Submit" : "Next";
						}

						updateButtons();
					})
					.catch(function(error) {
						console.error("Error loading form data:", error);
						chatContainer.innerHTML = "<p class='text-danger'>Error loading form.</p>";
					});

				const prevButton = document.getElementById("prev-btn");
				const nextButton = document.getElementById("next-btn");

				nextButton.addEventListener("click", function() {
					if (currentStep < steps.length - 1) {
						steps[currentStep].classList.add("d-none");
						currentStep++;
						steps[currentStep].classList.remove("d-none");
						updateButtons();
					} else {
						alert("Form submitted! (Simulated)");
					}
				});

				prevButton.addEventListener("click", function() {
					if (currentStep > 0) {
						steps[currentStep].classList.add("d-none");
						currentStep--;
						steps[currentStep].classList.remove("d-none");
						updateButtons();
					}
				});
			});
		</script>
		<?php
		return ob_get_clean();
	}
}
