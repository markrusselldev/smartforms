<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

/**
 * Dynamic render callback for the SmartForms Number Input block.
 *
 * Uses the shared FieldWrapper to produce the consistent markup:
 * <div class="sf-field-wrapper">
 *   <label class="sf-field-label">[label]</label>
 *   <div class="sf-input-container">
 *     <div class="sf-number-container">
 *       <input type="number" class="form-control sf-number-input" ... />
 *     </div>
 *   </div>
 *   <p class="sf-field-help">[helpText]</p>
 * </div>
 *
 * @param array $attributes Block attributes.
 * @return string HTML output.
 */
function smartforms_render_number( $attributes ) {
	$label         = isset( $attributes['label'] ) ? sanitize_text_field( $attributes['label'] ) : '';
	$required      = isset( $attributes['required'] ) ? (bool) $attributes['required'] : false;
	$min           = isset( $attributes['min'] ) ? floatval( $attributes['min'] ) : 0;
	$max           = isset( $attributes['max'] ) ? floatval( $attributes['max'] ) : 100;
	$step          = isset( $attributes['step'] ) ? floatval( $attributes['step'] ) : 1;
	$default_value = isset( $attributes['defaultValue'] ) ? floatval( $attributes['defaultValue'] ) : 0;
	$help_text     = isset( $attributes['helpText'] ) ? sanitize_text_field( $attributes['helpText'] ) : '';

	// Build the input field markup.
	ob_start();
	?>
	<div class="sf-number-container">
		<input type="number"
			class="form-control sf-number-input"
			min="<?php echo esc_attr( $min ); ?>"
			max="<?php echo esc_attr( $max ); ?>"
			step="<?php echo esc_attr( $step ); ?>"
			value="<?php echo esc_attr( $default_value ); ?>"
			inputmode="numeric"
			pattern="[0-9]+([.,][0-9]+)?"
			<?php echo $required ? 'required' : ''; ?>
		/>
	</div>
	<?php
	$input_html = ob_get_clean();

	// Directly use the shared FieldWrapper function for a consistent structure.
	return render_field_wrapper( $label, $input_html, $help_text );
}
