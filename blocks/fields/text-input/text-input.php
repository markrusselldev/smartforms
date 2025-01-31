<?php
/**
 * Dynamic rendering for the Text Input block.
 *
 * Generates the HTML output for the Text Input block on the front end.
 *
 * @package SmartForms
 */

/**
 * Render callback for the Text Input block.
 *
 * @param array $attributes The block attributes.
 * @return string HTML output for the block.
 */
function smartforms_render_text_input( $attributes ) {
	$placeholder  = isset( $attributes['placeholder'] ) ? $attributes['placeholder'] : __( 'Enter text...', 'smartforms' );
	$value        = isset( $attributes['value'] ) ? $attributes['value'] : '';
	$label        = isset( $attributes['label'] ) ? $attributes['label'] : __( 'Text Input Field', 'smartforms' );
	$required     = ! empty( $attributes['required'] ) ? ' required' : '';
	$custom_class = isset( $attributes['customClass'] ) ? $attributes['customClass'] : '';

	ob_start();
	?>
	<div class="smartforms-text-input <?php echo esc_attr( $custom_class ); ?>">
		<?php if ( '' !== $label ) : ?>
			<label><?php echo esc_html( $label ); ?></label>
		<?php endif; ?>
		<input type="text"
			placeholder="<?php echo esc_attr( $placeholder ); ?>"
			value="<?php echo esc_attr( $value ); ?>"<?php echo esc_attr( $required ); ?> />
	</div>
	<?php
	return ob_get_clean();
}

register_block_type(
	__DIR__,
	array(
		'render_callback' => 'smartforms_render_text_input',
	)
);
