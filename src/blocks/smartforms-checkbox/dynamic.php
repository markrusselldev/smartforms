<?php
/**
 * Dynamic render callback for the SmartForms Checkbox block.
 *
 * Renders the checkbox field on the frontend using block attributes.
 * Now the output is wrapped with the RenderFieldWrapper helper to standardize
 * the HTML structure while preserving the original styling and behavior.
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

	// Build the input HTML for the checkbox group.
	$input_html = '<div class="sf-checkbox-group sf-checkbox-group-' . esc_attr( $layout ) . '" data-layout="' . esc_attr( $layout ) . '" data-group-id="' . esc_attr( $group_id ) . '">';
	foreach ( $options as $index => $option ) {
		$input_html .= '<div class="sf-checkbox-option form-check ' . ( 'horizontal' === $layout ? 'form-check-inline' : '' ) . '">';
		$input_html .= '<input type="checkbox" class="form-check-input" id="' . esc_attr( $group_id . '-' . $index ) . '" name="' . esc_attr( $group_id ) . '" value="' . esc_attr( $option['value'] ) . '" ' . ( $required ? 'required' : '' ) . ' />';
		$input_html .= '<label class="form-check-label" for="' . esc_attr( $group_id . '-' . $index ) . '">';
		$input_html .= esc_html( $option['label'] );
		$input_html .= '</label>';
		$input_html .= '</div>';
	}
	$input_html .= '</div>';
	$input_html .= '<input type="hidden" name="' . esc_attr( $group_id ) . '" ' . ( $required ? 'required' : '' ) . ' />';

	// Use the unified field wrapper helper to generate the complete field markup.
	return render_field_wrapper( $label, $input_html, $help_text );
}
