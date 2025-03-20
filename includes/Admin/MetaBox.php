<?php
/**
 * Automatically generate JSON data from Gutenberg blocks when a SmartForm is saved.
 *
 * @package SmartForms
 */

namespace SmartForms\Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

use WP_Error;
use SmartForms\Core\SmartForms; // Import the core SmartForms class for logging.

/**
 * MetaBox class for handling form JSON generation.
 */
class MetaBox {

	/**
	 * The singleton instance.
	 *
	 * @var MetaBox|null
	 */
	private static $instance = null;

	/**
	 * Retrieves the singleton instance.
	 *
	 * @return MetaBox The singleton instance.
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Private constructor to prevent direct instantiation.
	 */
	private function __construct() {
		SmartForms::log_error( 'MetaBox::__construct() called.' );
		// Only add the hook if it hasn't already been added.
		if ( ! has_action( 'save_post', array( $this, 'smartforms_generate_json_on_save' ) ) ) {
			add_action( 'save_post', array( $this, 'smartforms_generate_json_on_save' ) );
		}
	}

	/**
	 * Prevent cloning.
	 */
	private function __clone() {}

	/**
	 * Prevent unserialization.
	 */
	public function __wakeup() {}

	/**
	 * Extracts block data and saves JSON into post meta.
	 *
	 * @param int $post_id The post ID.
	 * @return void|WP_Error Returns WP_Error on failure.
	 */
	public function smartforms_generate_json_on_save( $post_id ) {
		// Verify post type.
		if ( 'smart_form' !== get_post_type( $post_id ) ) {
			return;
		}
		// Prevent autosave interference.
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}
		// Check for a valid post status.
		$post_status = get_post_status( $post_id );
		if ( 'auto-draft' === $post_status || 'trash' === $post_status ) {
			return;
		}
		// Get post content (Gutenberg block structure).
		$post_content = get_post_field( 'post_content', $post_id );
		$blocks       = parse_blocks( $post_content );
		// Convert blocks to structured JSON format.
		$form_fields = array();
		foreach ( $blocks as $block ) {
			if ( isset( $block['blockName'] ) && false !== strpos( $block['blockName'], 'smartforms/' ) ) {
				// Determine the block type (e.g., "text", "number", etc.).
				$type = str_replace( 'smartforms/', '', sanitize_text_field( $block['blockName'] ) );
				// Common field data.
				$form_field = array(
					'type'        => $type,
					'label'       => ( isset( $block['attrs']['label'] ) && '' !== $block['attrs']['label'] )
						? sanitize_text_field( $block['attrs']['label'] )
						: self::get_default_label( $block['blockName'] ),
					'placeholder' => isset( $block['attrs']['placeholder'] ) ? sanitize_text_field( $block['attrs']['placeholder'] ) : '',
					'required'    => isset( $block['attrs']['required'] ) ? (bool) $block['attrs']['required'] : false,
					'helpText'    => isset( $block['attrs']['helpText'] ) ? sanitize_text_field( $block['attrs']['helpText'] ) : '',
				);

				// Process block-type–specific attributes.
				switch ( $type ) {
					case 'number':
						// Merge number field–specific settings, plus fieldAlignment.
						$field_alignment = isset( $block['attrs']['fieldAlignment'] ) ? sanitize_text_field( $block['attrs']['fieldAlignment'] ) : 'left';

						$form_field = array_merge(
							$form_field,
							array(
								'min'            => isset( $block['attrs']['min'] ) ? floatval( $block['attrs']['min'] ) : 0,
								'max'            => isset( $block['attrs']['max'] ) ? floatval( $block['attrs']['max'] ) : 100,
								'step'           => isset( $block['attrs']['step'] ) ? floatval( $block['attrs']['step'] ) : 1,
								'defaultValue'   => isset( $block['attrs']['defaultValue'] ) ? floatval( $block['attrs']['defaultValue'] ) : 0,
								'fieldAlignment' => $field_alignment,
							)
						);
						break;

					case 'checkbox':
						// Process checkbox-specific settings.
						if ( isset( $block['attrs']['options'] ) && is_array( $block['attrs']['options'] ) && ! empty( $block['attrs']['options'] ) ) {
							$options = array();
							foreach ( $block['attrs']['options'] as $option ) {
								if ( isset( $option['label'], $option['value'] ) ) {
									$options[] = array(
										'label' => sanitize_text_field( $option['label'] ),
										'value' => sanitize_text_field( $option['value'] ),
									);
								} else {
									SmartForms::log_error( "Checkbox option missing label or value for post $post_id." );
								}
							}
						} else {
							SmartForms::log_error( "Checkbox block missing options for post $post_id." );
							$options = array(
								array(
									'label' => 'Option 1',
									'value' => 'option-1',
								),
								array(
									'label' => 'Option 2',
									'value' => 'option-2',
								),
							);
						}
						$layout = array_key_exists( 'layout', $block['attrs'] ) ? sanitize_text_field( $block['attrs']['layout'] ) : 'horizontal';
						$form_field = array_merge(
							$form_field,
							array(
								'layout'  => $layout,
								'options' => $options,
							)
						);
						break;

					case 'buttons':
						// Process buttons-specific settings.
						if ( isset( $block['attrs']['options'] ) && is_array( $block['attrs']['options'] ) && ! empty( $block['attrs']['options'] ) ) {
							$options = array();
							foreach ( $block['attrs']['options'] as $option ) {
								if ( isset( $option['label'], $option['value'] ) ) {
									$options[] = array(
										'label' => sanitize_text_field( $option['label'] ),
										'value' => sanitize_text_field( $option['value'] ),
									);
								} else {
									SmartForms::log_error( "Buttons option missing label or value for post $post_id." );
								}
							}
						} else {
							SmartForms::log_error( "Buttons block missing options for post $post_id." );
							$options = array(
								array(
									'label' => 'Option 1',
									'value' => 'option-1',
								),
								array(
									'label' => 'Option 2',
									'value' => 'option-2',
								),
							);
						}
						$multiple = isset( $block['attrs']['multiple'] ) ? (bool) $block['attrs']['multiple'] : false;
						$layout   = array_key_exists( 'layout', $block['attrs'] ) ? sanitize_text_field( $block['attrs']['layout'] ) : 'horizontal';
						$field_alignment = isset( $block['attrs']['fieldAlignment'] ) ? sanitize_text_field( $block['attrs']['fieldAlignment'] ) : 'left';

						// Remove any pre-existing keys so we can append in a controlled order.
						unset( $form_field['multiple'], $form_field['layout'], $form_field['fieldAlignment'], $form_field['options'] );

						// Append new attributes in the desired order, ensuring that 'options' is the last key.
						$form_field = array_merge(
							$form_field,
							array(
								'multiple'       => $multiple,
								'layout'         => $layout,
								'fieldAlignment' => $field_alignment,
								'options'        => $options,
							)
						);
						break;

					case 'text':
						// Text field: no additional processing required.
						break;

					case 'radio':
						// Radio buttons: no additional processing required.
						break;

					case 'select':
						// Dropdown select: no additional processing required.
						break;

					case 'slider':
						// Slider field: no additional processing required.
						break;

					case 'textarea':
						// Textarea field: no additional processing required.
						break;

					case 'progress':
						// Progress indicator: no additional processing required.
						break;

					default:
						// For any other block types, no additional processing is done.
						break;
				}
				$form_fields[] = $form_field;
			}
		}
		$json_data = wp_json_encode( array( 'fields' => $form_fields ) );
		if ( false === $json_data ) {
			SmartForms::log_error( '[ERROR] Failed to encode form data JSON for Form ID: ' . esc_html( $post_id ) );
			return new WP_Error(
				'json_encoding_failed',
				esc_html__( 'Failed to encode form data JSON.', 'smartforms' )
			);
		}
		update_post_meta( $post_id, 'smartforms_data', $json_data );
		SmartForms::log_error( "[DEBUG] Form data JSON saved for Form ID: $post_id" );
	}

	/**
	 * Returns a default label for a given block if none is set.
	 *
	 * @param string $block_name The block name (e.g. "smartforms/text").
	 * @return string Default label based on the block type.
	 */
	private static function get_default_label( $block_name ) {
		// For consistent UX, all default labels are now set to the same prompt.
		return 'Type your question here...';
	}
}

// Note: Do not call MetaBox::get_instance() here.
// It is now initialized via SmartForms::initialize_classes().
