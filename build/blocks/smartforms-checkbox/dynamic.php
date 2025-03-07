<?php
/**
 * Dynamic render callback for the SmartForms Checkbox block.
 *
 * Renders the checkbox field on the frontend using block attributes.
 * The help text is output exactly as provided (even if blank).
 *
 * @package SmartForms
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

function smartforms_render_checkbox( $attributes ) {
	$label     = isset( $attributes['label'] ) ? sanitize_text_field( $attributes['label'] ) : '';
	$required  = isset( $attributes['required'] ) ? (bool) $attributes['required'] : false;
	$help_text = isset( $attributes['helpText'] ) ? sanitize_text_field( $attributes['helpText'] ) : '';
	$options   = isset( $attributes['options'] ) && is_array( $attributes['options'] )
		? $attributes['options']
		: array(
			array(
				'label' => 'Option 1',
				'value' => 'option-1',
			),
			array(
				'label' => 'Option 2',
				'value' => 'option-2',
			),
		);
	$group_id  = isset( $attributes['groupId'] ) ? sanitize_text_field( $attributes['groupId'] ) : '';
	$layout    = isset( $attributes['layout'] ) ? sanitize_text_field( $attributes['layout'] ) : 'horizontal';

	ob_start();
	?>
	<div class="wp-block-smartforms-checkbox">
		<label class="sf-checkbox-main-label"><?php echo esc_html( $label ); ?></label>
		<div class="sf-checkbox-group sf-checkbox-group-<?php echo esc_attr( $layout ); ?>" data-layout="<?php echo esc_attr( $layout ); ?>" data-group-id="<?php echo esc_attr( $group_id ); ?>">
			<?php foreach ( $options as $index => $option ) : ?>
				<div class="sf-checkbox-option form-check <?php echo ( 'horizontal' === $layout ? 'form-check-inline' : '' ); ?>">
					<input 
						type="checkbox" 
						class="form-check-input" 
						id="<?php echo esc_attr( $group_id . '-' . $index ); ?>" 
						name="<?php echo esc_attr( $group_id ); ?>" 
						value="<?php echo esc_attr( $option['value'] ); ?>" 
						<?php echo $required ? 'required' : ''; ?> 
					/>
					<label class="form-check-label" for="<?php echo esc_attr( $group_id . '-' . $index ); ?>">
						<?php echo esc_html( $option['label'] ); ?>
					</label>
				</div>
			<?php endforeach; ?>
		</div>
		<input type="hidden" name="<?php echo esc_attr( $group_id ); ?>" <?php echo $required ? 'required' : ''; ?> />
		<?php if ( '' !== $help_text ) : ?>
			<p class="sf-checkbox-help-text" style="color: #999;"><?php echo esc_html( $help_text ); ?></p>
		<?php endif; ?>
	</div>
	<?php
	return ob_get_clean();
}
