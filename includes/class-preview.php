<?php
/**
 * SmartForms Preview Mode.
 *
 * @package SmartForms
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

/**
 * Generate a standalone preview mode for a SmartForm.
 */
function smartforms_preview_mode() {
	if ( isset( $_GET['smartforms_preview'] ) ) {
		$form_id = isset( $_GET['form_id'] ) ? absint( $_GET['form_id'] ) : 0;

		// Validate form ID.
		if ( empty( $form_id ) ) {
			$error = new WP_Error(
				'invalid_form_id',
				esc_html__( 'Invalid form ID.', 'smartforms' )
			);
			\SmartForms\SmartForms::log_error( 'Invalid form ID for preview.', $error ); 
			wp_die( esc_html( $error->get_error_message() ), 400 );
		}

		$form = get_post( $form_id );

		// Check if the form exists and has the correct post type.
		if ( ! $form || 'smart_form' !== get_post_type( $form_id ) ) {
			$error = new WP_Error(
				'form_not_found',
				esc_html__( 'Form not found.', 'smartforms' )
			);
			\SmartForms\SmartForms::log_error( 'Form not found for preview. ID: ' . $form_id, $error );
			wp_die( esc_html( $error->get_error_message() ), 404 );
		}

		// Fetch stored form meta data (JSON config).
		$form_data = get_post_meta( $form_id, 'smartforms_data', true );
		$form_json = json_decode( $form_data, true );

		if ( empty( $form_json ) || empty( $form_json['fields'] ) ) {
			$error = new WP_Error(
				'form_data_missing',
				esc_html__( 'No form data available.', 'smartforms' )
			);
			\SmartForms\SmartForms::log_error( 'No form data found for preview. ID: ' . $form_id, $error );
			wp_die( esc_html( $error->get_error_message() ), 500 );
		}

		\SmartForms\SmartForms::log_error( 'Loading preview for Form ID: ' . $form_id );

		?>
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title><?php echo esc_html( get_the_title( $form_id ) ); ?> - <?php esc_html_e( 'Preview', 'smartforms' ); ?></title>
			<style>
				body { font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; }
				.smartforms-preview-container { display: none; }
				.smartforms-preview-container.active { display: block; }
				.smartforms-buttons { margin-top: 20px; text-align: center; }
				.smartforms-buttons button { padding: 10px 15px; font-size: 16px; margin: 5px; }
			</style>
		</head>
		<body>
			<h2><?php echo esc_html( get_the_title( $form_id ) ); ?></h2>
			<div id="smartforms-preview">
				<?php foreach ( $form_json['fields'] as $index => $field ) : ?>
					<div class="smartforms-preview-container" id="step-<?php echo esc_attr( $index ); ?>">
						<label><?php echo esc_html( $field['label'] ); ?></label>
						<input 
							type="<?php echo esc_attr( $field['type'] ); ?>"
							placeholder="<?php echo esc_attr( isset( $field['placeholder'] ) ? $field['placeholder'] : '' ); ?>"
						>
					</div>
				<?php endforeach; ?>
			</div>

			<div class="smartforms-buttons">
				<button id="prev-btn" style="display: none;"><?php esc_html_e( 'Back', 'smartforms' ); ?></button>
				<button id="next-btn"><?php esc_html_e( 'Next', 'smartforms' ); ?></button>
			</div>

			<script>
				document.addEventListener("DOMContentLoaded", function() {
					let currentStep = 0;
					let steps = document.querySelectorAll(".smartforms-preview-container");
					let prevButton = document.getElementById("prev-btn");
					let nextButton = document.getElementById("next-btn");

					if (steps.length > 0) {
						steps[0].classList.add("active");
					}

					function updateButtons() {
						prevButton.style.display = (currentStep > 0) ? "inline-block" : "none";
						nextButton.innerText = (currentStep === steps.length - 1) ? "Submit" : "Next";
					}

					nextButton.addEventListener("click", function() {
						if (currentStep < steps.length - 1) {
							steps[currentStep].classList.remove("active");
							currentStep++;
							steps[currentStep].classList.add("active");
							updateButtons();
						} else {
							alert("Form submitted! (Simulated)");
						}
					});

					prevButton.addEventListener("click", function() {
						if (currentStep > 0) {
							steps[currentStep].classList.remove("active");
							currentStep--;
							steps[currentStep].classList.add("active");
							updateButtons();
						}
					});

					updateButtons();
				});
			</script>
		</body>
		</html>
		<?php
		exit;
	}
}
add_action( 'template_redirect', 'smartforms_preview_mode' );
