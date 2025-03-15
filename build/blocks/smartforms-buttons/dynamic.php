<?php
/**
 * Dynamic render callback for the SmartForms Button Group block.
 *
 * Renders the button group on the frontend using block attributes.
 * Now the output is wrapped with the RenderFieldWrapper helper function to standardize
 * the HTML structure, while preserving the original markup for options, layout, and help text.
 *
 * @package SmartForms
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

function smartforms_render_button_group( $attributes ) {
	// Sanitize and assign attributes.
	$label             = isset( $attributes['label'] ) ? sanitize_text_field( $attributes['label'] ) : '';
	$required          = isset( $attributes['required'] ) ? (bool) $attributes['required'] : false;
	$raw_help_text     = isset( $attributes['helpText'] ) ? trim( $attributes['helpText'] ) : '';
	$display_help_text = sanitize_text_field( $raw_help_text );
	$options           = isset( $attributes['options'] ) && is_array( $attributes['options'] )
		? $attributes['options']
		: array();
	$group_id          = isset( $attributes['groupId'] ) ? sanitize_text_field( $attributes['groupId'] ) : '';
	$multiple          = isset( $attributes['multiple'] ) ? (bool) $attributes['multiple'] : false;
	$layout            = isset( $attributes['layout'] ) && ! empty( $attributes['layout'] )
		? sanitize_text_field( $attributes['layout'] )
		: 'horizontal';

	// Build the input HTML for the button group.
	ob_start();
	?>
	<div class="sf-buttons-group sf-buttons-group--<?php echo esc_attr( $layout ); ?>" data-group-id="<?php echo esc_attr( $group_id ); ?>" data-layout="<?php echo esc_attr( $layout ); ?>">
		<?php foreach ( $options as $option ) : ?>
			<button type="button" class="btn btn-primary" data-value="<?php echo esc_attr( $option['value'] ); ?>">
				<?php echo esc_html( $option['label'] ); ?>
			</button>
		<?php endforeach; ?>
	</div>
	<input type="hidden" name="<?php echo esc_attr( $group_id ); ?>" <?php echo ( $required && ! $multiple ? 'required' : '' ); ?> />
	<?php
	$input_html = ob_get_clean();

	// Use the unified field wrapper helper for frontend rendering.
	return render_field_wrapper( $label, $input_html, $display_help_text );
}
