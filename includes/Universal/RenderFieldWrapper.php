<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

/**
 * Renders a field wrapper for a form field on the frontend.
 *
 * @param string $label      The field label.
 * @param string $input_html The field-specific input HTML.
 * @param string $help_text  The field help text.
 * @param string $alignment  Optional. Field alignment: "left", "center", or "right". Default "left".
 *
 * @return string The complete HTML for the field.
 */
function render_field_wrapper( $label, $input_html, $help_text, $alignment = 'left' ) {
	$alignment_class = 'text-start';
	if ( 'center' === $alignment ) {
		$alignment_class = 'text-center';
	} elseif ( 'right' === $alignment ) {
		$alignment_class = 'text-end';
	}

	$html = '<div class="sf-field-wrapper">';
	if ( '' !== $label ) {
		$html .= '<label class="sf-field-label">' . esc_html( $label ) . '</label>';
	}
	$html .= '<div class="sf-input-container ' . esc_attr( $alignment_class ) . '">' . $input_html . '</div>';
	if ( '' !== $help_text ) {
		$html .= '<p class="sf-field-help">' . esc_html( $help_text ) . '</p>';
	}
	$html .= '</div>';
	return $html;
}
