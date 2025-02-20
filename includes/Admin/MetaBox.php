<?php
/**
 * Automatically generate JSON data from Gutenberg blocks when a SmartForm is saved.
 *
 * @package SmartForms
 */

namespace SmartForms\Admin;

use WP_Error;
use SmartForms\Core\SmartForms;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

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
	private function __wakeup() {}

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
				// Determine the block type (e.g., "text", "number", etc.)
				$type = str_replace( 'smartforms/', '', sanitize_text_field( $block['blockName'] ) );
				$form_field = array(
					'type'        => $type,
					'label'       => isset( $block['attrs']['label'] ) && ! empty( $block['attrs']['label'] )
						? sanitize_text_field( $block['attrs']['label'] )
						: self::get_default_label( $block['blockName'] ),
					'placeholder' => isset( $block['attrs']['placeholder'] ) ? sanitize_text_field( $block['attrs']['placeholder'] ) : '',
					'required'    => isset( $block['attrs']['required'] ) ? (bool) $block['attrs']['required'] : false,
					// For text blocks, if helpText is not provided or is empty, default to a specific message.
					// For other block types, default to an empty string.
					'helpText'    => ( 'text' === $type )
						? ( isset( $block['attrs']['helpText'] ) && trim( $block['attrs']['helpText'] ) !== ''
							? sanitize_text_field( $block['attrs']['helpText'] )
							: 'Only letters, numbers, punctuation, symbols & spaces allowed.' )
						: ( isset( $block['attrs']['helpText'] ) ? sanitize_text_field( $block['attrs']['helpText'] ) : '' )
				);

				// If this is a checkbox block, include the options array explicitly.
				if ( 'checkbox' === $type && isset( $block['attrs']['options'] ) && is_array( $block['attrs']['options'] ) ) {
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
					$form_field['options'] = $options;
					SmartForms::log_error( "Checkbox block processed with " . count( $options ) . " options for post $post_id." );
				}

				$form_fields[] = $form_field;
			}
		}

		// Encode JSON safely.
		$json_data = wp_json_encode( array( 'fields' => $form_fields ) );

		if ( false === $json_data ) {
			SmartForms::log_error( '[ERROR] Failed to encode form data JSON for Form ID: ' . esc_html( $post_id ) );
			return new WP_Error(
				'json_encoding_failed',
				esc_html__( 'Failed to encode form data JSON.', 'smartforms' )
			);
		}

		// Store JSON in post meta.
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
		$type = str_replace( 'smartforms/', '', $block_name );
		switch ( $type ) {
			case 'text':
				return 'Text Input';
			case 'number':
				return 'Number Input';
			case 'radio':
				return 'Radio Input';
			case 'checkbox':
				return 'Checkbox Input';
			case 'select':
				return 'Select Input';
			case 'slider':
				return 'Slider Input';
			case 'textarea':
				return 'Textarea Input';
			default:
				return 'Input';
		}
	}
}

MetaBox::get_instance();
