<?php
/**
 * Handles the rendering of the SmartForms Chat UI.
 *
 * @package SmartForms
 */

namespace SmartForms;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

/**
 * Render the chat UI for a given form ID.
 *
 * @param int $form_id The ID of the form to render.
 * @return string The HTML output for the chat UI.
 */
function smartforms_render_chat_ui( $form_id ) {
	$form = get_post( $form_id );

	if ( ! $form || 'smart_form' !== get_post_type( $form_id ) ) {
		return '<p>' . esc_html__( 'Form not found.', 'smartforms' ) . '</p>';
	}

	// Fetch stored form meta data (JSON config).
	$form_data = get_post_meta( $form_id, 'smartforms_data', true );
	$form_json = json_decode( $form_data, true );

	if ( empty( $form_json ) || empty( $form_json['fields'] ) ) {
		return '<p>' . esc_html__( 'No form data available.', 'smartforms' ) . '</p>';
	}

	ob_start();
	?>

	<div class="container mt-4">
		<div class="card shadow-lg p-3">
			<div class="card-body">
				<h2 class="text-center"><?php echo esc_html( get_the_title( $form_id ) ); ?></h2>
				<div id="smartforms-chat-ui" data-form-id="<?php echo esc_attr( $form_id ); ?>"></div>
				
				<div class="d-flex justify-content-between mt-3">
					<button id="prev-btn" class="btn btn-secondary" style="display: none;"><?php esc_html_e( 'Back', 'smartforms' ); ?></button>
					<button id="next-btn" class="btn btn-primary"><?php esc_html_e( 'Next', 'smartforms' ); ?></button>
				</div>
			</div>
		</div>
	</div>

	<script>
		document.addEventListener("DOMContentLoaded", function() {
			const chatContainer = document.getElementById("smartforms-chat-ui");
			const formId = chatContainer.getAttribute("data-form-id");
			let currentStep = 0;
			let steps = [];

			// Load form JSON dynamically
			fetch(`/wp-json/smartforms/v1/form/${formId}`)
				.then(response => response.json())
				.then(formData => {
					if (!formData.fields) {
						chatContainer.innerHTML = "<p class='text-danger'>Error: No form fields available.</p>";
						return;
					}

					steps = formData.fields.map((field, index) => {
						const stepDiv = document.createElement("div");
						stepDiv.classList.add("smartforms-chat-step", "mb-3", "d-none");
						stepDiv.id = "step-" + index;

						let inputElement;
						switch (field.type) {
							case "radio":
								inputElement = document.createElement("div");

								// ✅ FIX: Ensure `options` exists before looping over it
								if (Array.isArray(field.options)) {
									field.options.forEach(option => {
										inputElement.innerHTML += `
											<div class="form-check">
												<input class="form-check-input" type="radio" name="step-${index}" value="${option}">
												<label class="form-check-label">${option}</label>
											</div>
										`;
									});
								} else {
									console.warn(`Field "${field.label}" is missing options. Skipping.`);
								}
								break;
								
							case "select":
								inputElement = document.createElement("select");
								inputElement.classList.add("form-select");

								// ✅ FIX: Ensure `options` exists before looping over it
								if (Array.isArray(field.options)) {
									field.options.forEach(option => {
										const optionElem = document.createElement("option");
										optionElem.value = option;
										optionElem.textContent = option;
										inputElement.appendChild(optionElem);
									});
								} else {
									console.warn(`Field "${field.label}" is missing options. Skipping.`);
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
					updateButtons();
				})
				.catch(error => {
					console.error("Error loading form data:", error);
					chatContainer.innerHTML = "<p class='text-danger'>Error loading form.</p>";
				});

			const prevButton = document.getElementById("prev-btn");
			const nextButton = document.getElementById("next-btn");

			function updateButtons() {
				prevButton.style.display = currentStep > 0 ? "inline-block" : "none";
				nextButton.innerText = currentStep === steps.length - 1 ? "Submit" : "Next";
			}

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
