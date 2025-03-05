<?php
/**
 * Dynamic render callback for the SmartForms Button Group block.
 *
 * Renders the button group on the frontend using block attributes.
 * If no helpText is provided by the user, a default help message is computed based on the "multiple" attribute:
 * - "Select one option" for single selection,
 * - "Select one or more options" for multiple selections.
 *
 * When in multiple mode, the hidden input is not marked as "required" to prevent native validation errors.
 *
 * @package SmartForms
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

function smartforms_render_button_group( $attributes ) {
	// Sanitize and assign attributes.
	$label         = isset( $attributes['label'] ) ? sanitize_text_field( $attributes['label'] ) : '';
	$required      = isset( $attributes['required'] ) ? (bool) $attributes['required'] : false;
	$multiple      = isset( $attributes['multiple'] ) ? (bool) $attributes['multiple'] : false;
	$raw_help_text = isset( $attributes['helpText'] ) ? trim( $attributes['helpText'] ) : "";
	$display_help_text = ( "" === $raw_help_text )
		? ( $multiple ? "Select one or more options" : "Select one option" )
		: sanitize_text_field( $raw_help_text );
	$options  = isset( $attributes['options'] ) && is_array( $attributes['options'] ) ? $attributes['options'] : array();
	$group_id = isset( $attributes['groupId'] ) ? sanitize_text_field( $attributes['groupId'] ) : "";
	
	ob_start();
	?>
	<div class="wp-block-smartforms-buttons">
		<label class="sf-buttons-main-label"><?php echo esc_html( $label ); ?></label>
		<div class="sf-buttons-group"
		     data-group-id="<?php echo esc_attr( $group_id ); ?>"
		     data-required="<?php echo esc_attr( $required ? 'true' : 'false' ); ?>"
		     data-multiple="<?php echo esc_attr( $multiple ? 'true' : 'false' ); ?>"
		     data-help-text="<?php echo esc_attr( $raw_help_text ); ?>"
		>
			<?php foreach ( $options as $option ) : ?>
				<button type="button" class="btn btn-primary" data-value="<?php echo esc_attr( $option['value'] ); ?>">
					<?php echo esc_html( $option['label'] ); ?>
				</button>
			<?php endforeach; ?>
		</div>
		<!-- Only apply the required attribute in single-selection mode -->
		<input type="hidden" name="<?php echo esc_attr( $group_id ); ?>" <?php echo ( $required && !$multiple ? 'required' : '' ); ?> />
		<p class="sf-buttons-help-text" style="color: #999;">
			<?php echo esc_html( $display_help_text ); ?>
		</p>
	</div>
	<?php
	return ob_get_clean();
}
