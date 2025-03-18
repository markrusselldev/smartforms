<?php
/**
 * Dynamic render callback for the SmartForms Number block.
 *
 * @package SmartForms
 */

if ( ! function_exists( 'smartforms_render_number' ) ) {

	function smartforms_render_number( $attributes ) {
		$label         = isset( $attributes['label'] ) ? sanitize_text_field( $attributes['label'] ) : '';
		$help_text     = isset( $attributes['helpText'] ) ? sanitize_text_field( $attributes['helpText'] ) : '';
		$required      = ! empty( $attributes['required'] );
		$min           = isset( $attributes['min'] ) ? floatval( $attributes['min'] ) : 0;
		$max           = isset( $attributes['max'] ) ? floatval( $attributes['max'] ) : 100;
		$step          = isset( $attributes['step'] ) ? floatval( $attributes['step'] ) : 1;
		$default_value = isset( $attributes['defaultValue'] ) ? floatval( $attributes['defaultValue'] ) : 0;

		// Map fieldSize attribute to Bootstrap classes.
		$field_size = isset( $attributes['fieldSize'] ) ? $attributes['fieldSize'] : 'medium';
		$size_class = '';
		if ( 'small' === $field_size ) {
			$size_class = 'form-control-sm';
		} elseif ( 'large' === $field_size ) {
			$size_class = 'form-control-lg';
		}

		// Use the fieldAlignment attribute.
		$field_alignment = isset( $attributes['fieldAlignment'] ) ? $attributes['fieldAlignment'] : 'left';
		$bootstrap_alignment = 'text-start';
		if ( 'center' === $field_alignment ) {
			$bootstrap_alignment = 'text-center';
		} elseif ( 'right' === $field_alignment ) {
			$bootstrap_alignment = 'text-end';
		}

		ob_start();
		?>
		<div class="sf-field-wrapper">
			<?php if ( $label ) : ?>
				<label class="sf-field-label"><?php echo esc_html( $label ); ?></label>
			<?php endif; ?>
			<div class="sf-input-container <?php echo esc_attr( $bootstrap_alignment ); ?>">
				<div class="sf-number-container">
					<input
						type="number"
						class="form-control sf-number-input <?php echo esc_attr( $size_class ); ?>"
						<?php echo $required ? 'required' : ''; ?>
						min="<?php echo esc_attr( $min ); ?>"
						max="<?php echo esc_attr( $max ); ?>"
						step="<?php echo esc_attr( $step ); ?>"
						value="<?php echo esc_attr( $default_value ); ?>"
						inputmode="numeric"
						pattern="[0-9]+([.,][0-9]+)?"
					/>
				</div>
			</div>
			<?php if ( $help_text ) : ?>
				<p class="sf-field-help"><?php echo esc_html( $help_text ); ?></p>
			<?php endif; ?>
		</div>
		<?php
		return ob_get_clean();
	}
}
