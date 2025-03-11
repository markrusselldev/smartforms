<?php
/**
 * Dynamic render callback for the SmartForms Button Group block.
 *
 * Renders the button group on the frontend using block attributes.
 * Uses only the new BEM‑style classes and reads the layout solely from attributes.
 *
 * @package SmartForms
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

function smartforms_render_button_group( $attributes ) {
	// Sanitize and assign attributes.
	$label         = isset( $attributes['label'] ) ? sanitize_text_field( $attributes['label'] ) : '';
	$required      = isset( $attributes['required'] ) ? (bool) $attributes['required'] : false;
	$raw_help_text = isset( $attributes['helpText'] ) ? trim( $attributes['helpText'] ) : '';
	$display_help_text = sanitize_text_field( $raw_help_text );
	$options       = isset( $attributes['options'] ) && is_array( $attributes['options'] ) ? $attributes['options'] : array();
	$group_id      = isset( $attributes['groupId'] ) ? sanitize_text_field( $attributes['groupId'] ) : '';
	$multiple      = isset( $attributes['multiple'] ) ? (bool) $attributes['multiple'] : false;
	// Read layout strictly from attributes (default "horizontal")
	$layout = isset( $attributes['layout'] ) && ! empty( $attributes['layout'] )
		? sanitize_text_field( $attributes['layout'] )
		: 'horizontal';
	$bem_class = 'sf-buttons-group--' . $layout;
  
	ob_start();
	?>
	<div class="wp-block-smartforms-buttons">
		<label class="sf-buttons-main-label"><?php echo esc_html( $label ); ?></label>
		<div class="sf-buttons-group <?php echo esc_attr( $bem_class ); ?>"
			data-group-id="<?php echo esc_attr( $group_id ); ?>"
			data-layout="<?php echo esc_attr( $layout ); ?>"
		>
			<?php foreach ( $options as $option ) : ?>
				<button type="button" class="btn btn-primary" data-value="<?php echo esc_attr( $option['value'] ); ?>">
					<?php echo esc_html( $option['label'] ); ?>
				</button>
			<?php endforeach; ?>
		</div>
		<!-- Only apply the required attribute in single-selection mode -->
		<input type="hidden" name="<?php echo esc_attr( $group_id ); ?>" <?php echo ( $required && ! $multiple ? 'required' : '' ); ?> />
		<p class="sf-buttons-help-text" style="color: #999;">
			<?php echo esc_html( $display_help_text ); ?>
		</p>
	</div>
	<?php
	return ob_get_clean();
}
