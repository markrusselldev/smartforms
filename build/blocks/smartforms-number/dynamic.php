<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

/**
 * Dynamic render callback for the SmartForms Number Input block.
 *
 * Outputs a Bootstrap-styled number input field with HTML5 validations,
 * displaying both the editable label and help text.
 *
 * @param array $attributes Block attributes.
 * @return string HTML markup for the number input field.
 */
function smartforms_render_number( $attributes ) {
	$label         = isset( $attributes['label'] ) ? sanitize_text_field( $attributes['label'] ) : '';
	$required      = ( isset( $attributes['required'] ) && true === $attributes['required'] ) ? 'required' : '';
	$placeholder   = ( isset( $attributes['placeholder'] ) && '' !== $attributes['placeholder'] ) ? sanitize_text_field( $attributes['placeholder'] ) : '';
	$min           = isset( $attributes['min'] ) ? floatval( $attributes['min'] ) : 0;
	$max           = isset( $attributes['max'] ) ? floatval( $attributes['max'] ) : 100;
	$step          = isset( $attributes['step'] ) ? floatval( $attributes['step'] ) : 1;
	$default_value = isset( $attributes['defaultValue'] ) ? floatval( $attributes['defaultValue'] ) : 0;
	$help_text     = isset( $attributes['helpText'] ) ? sanitize_text_field( $attributes['helpText'] ) : '';
	
	$input_placeholder = '' !== $placeholder ? $placeholder : (string) $default_value;
	
	ob_start();
	?>
	<div class="wp-block-smartforms-number sf-number-block">
		<?php if ( '' !== $label ) : ?>
			<label class="sf-field-label"><?php echo esc_html( $label ); ?></label>
		<?php endif; ?>
		<div class="sf-number-container">
			<input type="number"
				class="form-control sf-number-input"
				placeholder="<?php echo esc_attr( $input_placeholder ); ?>"
				min="<?php echo esc_attr( $min ); ?>"
				max="<?php echo esc_attr( $max ); ?>"
				step="<?php echo esc_attr( $step ); ?>"
				value="<?php echo esc_attr( $default_value ); ?>"
				inputmode="numeric"
				pattern="[0-9]+([.,][0-9]+)?"
				<?php echo $required; ?> />
		</div>
		<?php if ( '' !== $help_text ) : ?>
			<p class="sf-field-help"><?php echo esc_html( $help_text ); ?></p>
		<?php endif; ?>
	</div>
	<?php
	return ob_get_clean();
}
