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
	if ( isset( $_GET['smartforms_preview'] ) && isset( $_GET['form_id'] ) ) {
		$form_id = absint( $_GET['form_id'] );
		$form    = get_post( $form_id );

		if ( ! $form || 'smart_form' !== get_post_type( $form_id ) ) {
			wp_die( __( 'Form not found.', 'smartforms' ) );
		}

		// Fetch stored form meta data (JSON config).
		$form_data = get_post_meta( $form_id, 'smartforms_data', true );
		$form_json = json_decode( $form_data, true );

		?>
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title><?php echo esc_html( $form->post_title ); ?> - Preview</title>
			<style>
				body { font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto; }
				.smartforms-preview-container { display: none; }
				.smartforms-preview-container.active { display: block; }
				.smartforms-buttons { margin-top: 20px; text-align: center; }
			</style>
		</head>
		<body>
			<h2><?php echo esc_html( $form->post_title ); ?></h2>
			<div id="smartforms-preview">
				<?php if ( ! empty( $form_json['fields'] ) ) : ?>
					<?php foreach ( $form_json['fields'] as $index => $field ) : ?>
						<div class="smartforms-preview-container" id="step-<?php echo esc_attr( $index ); ?>">
							<label><?php echo esc_html( $field['label'] ); ?></label>
							<input type="<?php echo esc_attr( $field['type'] ); ?>"
								   placeholder="<?php echo esc_attr( $field['placeholder'] ); ?>">
						</div>
					<?php endforeach; ?>
				<?php else : ?>
					<p><?php esc_html_e( 'No fields found in this form.', 'smartforms' ); ?></p>
				<?php endif; ?>
			</div>

			<div class="smartforms-buttons">
				<button id="prev-btn" style="display: none;">Back</button>
				<button id="next-btn">Next</button>
			</div>

			<script>
				let currentStep = 0;
				let steps = document.querySelectorAll(".smartforms-preview-container");
				if (steps.length > 0) {
					steps[0].classList.add("active");
				}

				document.getElementById("next-btn").addEventListener("click", function() {
					if (currentStep < steps.length - 1) {
						steps[currentStep].classList.remove("active");
						currentStep++;
						steps[currentStep].classList.add("active");
					}
					document.getElementById("prev-btn").style.display = (currentStep > 0) ? "inline-block" : "none";
				});

				document.getElementById("prev-btn").addEventListener("click", function() {
					if (currentStep > 0) {
						steps[currentStep].classList.remove("active");
						currentStep--;
						steps[currentStep].classList.add("active");
					}
					document.getElementById("prev-btn").style.display = (currentStep > 0) ? "inline-block" : "none";
				});
			</script>
		</body>
		</html>
		<?php
		exit;
	}
}

add_action( 'init', 'smartforms_preview_mode' );
