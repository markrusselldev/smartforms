<?php
/**
 * Handles the rendering of the SmartForms Chat UI.
 *
 * Retrieves form block markup from the saved post content by parsing Gutenberg blocks,
 * then renders each block via render_block(). This ensures that the full markup (with
 * all form fields) is output and that WordPress automatically enqueues the frontend and editor
 * styles as defined in each block's block.json file.
 *
 * This file is modified to no longer rely on extracted JSON, and all original isset() checks and logic are preserved.
 *
 * @package SmartForms
 */

namespace SmartForms\Core;

use SmartForms\CPT\ChatUISettings;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

class ChatUI {

	/**
	 * Renders the chat UI for a given form ID.
	 *
	 * @param int $form_id The ID of the form to render.
	 * @return string HTML output for the chat UI.
	 */
	public static function render( $form_id ) {
		return self::render_chat_ui( $form_id );
	}

	/**
	 * Renders the production-ready chat interface.
	 *
	 * Retrieves the full post content (the Gutenberg block markup) via get_post_field(),
	 * parses it with parse_blocks(), and renders each block with render_block().
	 * The resulting HTML is wrapped in a chat container with dynamic CSS variables.
	 *
	 * @param int $form_id The form ID to load.
	 * @return string HTML output for the chat UI.
	 */
	public static function render_chat_ui( $form_id = 0 ) {
		$theme_styles = ChatUISettings::get_instance()->get_selected_theme_styles();

		if ( ! $form_id ) {
			return '<p>' . esc_html__( 'Form ID not provided.', 'smartforms' ) . '</p>';
		}

		// Retrieve the complete post content.
		$post_content = get_post_field( 'post_content', $form_id );
		if ( ! isset( $post_content ) || empty( $post_content ) ) {
			return '<p>' . esc_html__( 'Form content not found.', 'smartforms' ) . '</p>';
		}

		$blocks = parse_blocks( $post_content );
		$form_markup = '';
		if ( isset( $blocks ) && ! empty( $blocks ) ) {
			foreach ( $blocks as $block ) {
				$form_markup .= render_block( $block );
			}
		} else {
			$form_markup = '<p>' . esc_html__( 'No form blocks found.', 'smartforms' ) . '</p>';
		}

		// Build dynamic CSS using isset checks as originally written.
		$css = "
		#smartforms-chat-container {
			--chat-bg-color: " . esc_attr( isset( $theme_styles['smartforms_chat_container_background_color'] ) ? $theme_styles['smartforms_chat_container_background_color'] : '#ffffff' ) . ";
			--chat-border-color: " . esc_attr( isset( $theme_styles['smartforms_chat_container_border_color'] ) ? $theme_styles['smartforms_chat_container_border_color'] : '#cccccc' ) . ";
			--chat-border-style: " . esc_attr( isset( $theme_styles['smartforms_chat_container_border_style'] ) ? $theme_styles['smartforms_chat_container_border_style'] : 'solid' ) . ";
			--chat-border-width: " . absint( isset( $theme_styles['smartforms_chat_container_border_width'] ) ? $theme_styles['smartforms_chat_container_border_width'] : 1 ) . "px;
			--chat-border-radius: " . absint( isset( $theme_styles['smartforms_chat_container_border_radius'] ) ? $theme_styles['smartforms_chat_container_border_radius'] : 10 ) . "px;
			--chat-box-shadow: " . esc_attr( isset( $theme_styles['smartforms_chat_container_box_shadow'] ) ? $theme_styles['smartforms_chat_container_box_shadow'] : 'none' ) . ";
			--chat-padding: " . esc_attr( isset( $theme_styles['smartforms_chat_container_padding'] ) ? $theme_styles['smartforms_chat_container_padding'] : '10px' ) . ";
			--chat-max-width: " . esc_attr( isset( $theme_styles['smartforms_chat_container_max_width'] ) ? $theme_styles['smartforms_chat_container_max_width'] : '800px' ) . ";
			--chat-flex-direction: " . esc_attr( isset( $theme_styles['smartforms_chat_container_flex_direction'] ) ? $theme_styles['smartforms_chat_container_flex_direction'] : 'column' ) . ";
			--chat-justify-content: " . esc_attr( isset( $theme_styles['smartforms_chat_container_justify_content'] ) ? $theme_styles['smartforms_chat_container_justify_content'] : 'center' ) . ";
			--chat-align-items: " . esc_attr( isset( $theme_styles['smartforms_chat_container_align_items'] ) ? $theme_styles['smartforms_chat_container_align_items'] : 'center' ) . ";
		}
		";
		$css = "<style>" . $css . "</style>";

		// Output the chat container with header, rendered form markup, and chat input.
		ob_start();
		?>
		<?php echo $css; ?>
		<div id="smartforms-chat-container" class="smartforms-chat-container">
			<div id="smartforms-chat-header" class="smartforms-chat-header">
				<h2 class="smartforms-chat-title"><?php esc_html_e( 'Chat Interface', 'smartforms' ); ?></h2>
			</div>
			<div id="smartforms-chat-dialog" class="smartforms-chat-dialog">
				<?php echo $form_markup; ?>
			</div>
			<form id="smartforms-chat-form" class="smartforms-chat-form">
				<div id="smartforms-chat-input-container" class="smartforms-chat-input-container">
					<div id="smartforms-chat-input-box" class="smartforms-chat-input-box">
						<textarea id="smartforms-current-input" class="form-control smartforms-chat-input" rows="4" placeholder="<?php esc_attr_e( 'Type your answer here...', 'smartforms' ); ?>"></textarea>
					</div>
					<div id="smartforms-chat-submit-row" class="smartforms-chat-submit-row">
						<button type="button" id="smartforms-chat-submit-button" class="btn smartforms-chat-submit-button">
							<i class="<?php echo esc_attr( isset( $theme_styles['smartforms_chat_submit_button_icon'] ) ? $theme_styles['smartforms_chat_submit_button_icon'] : 'fas fa-arrow-up' ); ?> smartforms-chat-submit-icon"></i>
						</button>
					</div>
				</div>
			</form>
		</div>
		<script>
			document.addEventListener("DOMContentLoaded", () => {
				window.formData = <?php echo wp_json_encode( $form_markup ); ?>;
				window.smartformsFormId = <?php echo get_the_ID(); ?>;
			});
		</script>
		<?php
		return ob_get_clean();
	}
}
