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
					'helpText'    => ( 'text' === $type )
						? ( isset( $block['attrs']['helpText'] ) && trim( $block['attrs']['helpText'] ) !== ''
							? sanitize_text_field( $block['attrs']['helpText'] )
							: 'Only letters, numbers, punctuation, symbols & spaces allowed.' )
						: ( isset( $block['attrs']['helpText'] ) ? sanitize_text_field( $block['attrs']['helpText'] ) : '' )
				);

				// Process additional attributes for checkbox.
				if ( 'checkbox' === $type ) {
					$form_field['helpText'] = ( array_key_exists( 'helpText', $block['attrs'] ) && trim( $block['attrs']['helpText'] ) !== '' )
						? sanitize_text_field( $block['attrs']['helpText'] )
						: 'Choose one or more options';
					
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
						SmartForms::log_error( "Checkbox block processed with " . count( $options ) . " options for post $post_id." );
					} else {
						SmartForms::log_error( "Checkbox block missing options for post $post_id." );
						$options = array(
							array( 'label' => 'Option 1', 'value' => 'option-1' ),
							array( 'label' => 'Option 2', 'value' => 'option-2' )
						);
					}
					if ( isset( $block['attrs']['layout'] ) && ! empty( $block['attrs']['layout'] ) ) {
						$layout = sanitize_text_field( $block['attrs']['layout'] );
					} else {
						if ( isset( $block['innerHTML'] ) && preg_match( '/data-layout="([^"]+)"/', $block['innerHTML'], $matches ) ) {
							$layout = sanitize_text_field( $matches[1] );
						} else {
							$layout = 'horizontal';
						}
					}
					$temp_help_text = $form_field['helpText'];
					$form_field = array(
						'type'        => $form_field['type'],
						'label'       => $form_field['label'],
						'placeholder' => $form_field['placeholder'],
						'required'    => $form_field['required'],
						'helpText'    => $temp_help_text,
						'layout'      => $layout,
						'options'     => $options,
					);
				} elseif ( 'buttons' === $type ) {
					// Process button group options similar to checkbox.
					$form_field['helpText'] = isset( $block['attrs']['helpText'] ) ? sanitize_text_field( $block['attrs']['helpText'] ) : '';
					
					if ( isset( $block['attrs']['options'] ) && is_array( $block['attrs']['options'] ) && ! empty( $block['attrs']['options'] ) ) {
						$options = array();
						foreach ( $block['attrs']['options'] as $option ) {
							if ( isset( $option['label'], $option['value'] ) ) {
								$options[] = array(
									'label' => sanitize_text_field( $option['label'] ),
									'value' => sanitize_text_field( $option['value'] )
								);
							} else {
								SmartForms::log_error( "Buttons option missing label or value for post $post_id." );
							}
						}
						SmartForms::log_error( "Buttons block processed with " . count( $options ) . " options for post $post_id." );
					} else {
						SmartForms::log_error( "Buttons block missing options for post $post_id." );
						$options = array(
							array( 'label' => 'Option 1', 'value' => 'option-1' ),
							array( 'label' => 'Option 2', 'value' => 'option-2' )
						);
					}
					$multiple = isset( $block['attrs']['multiple'] ) ? (bool) $block['attrs']['multiple'] : false;
					$form_field = array_merge(
						$form_field,
						array(
							'options'  => $options,
							'multiple' => $multiple,
						)
					);
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

MetaBox::get_instance();
