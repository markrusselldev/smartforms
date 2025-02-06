<?php
/**
 * Modifies the Preview button in the Gutenberg editor for SmartForms.
 *
 * @package SmartForms
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

/**
 * Ensure Preview button is present and override its URL for SmartForms CPT.
 */
function smartforms_override_preview_button() {
	$screen = get_current_screen();

	// Ensure we are inside the SmartForms post type editor.
	if ( empty( $screen ) || 'smart_form' !== $screen->post_type ) {
		return;
	}

	?>
	<script type="text/javascript">
		document.addEventListener("DOMContentLoaded", function() {
			// Ensure jQuery is available.
			if (typeof jQuery === "undefined") {
				return;
			}

			let $ = jQuery;

			// Wait until the preview button is available.
			let interval = setInterval(function() {
				let previewButton = $("#post-preview");
				if (previewButton.length) {
					clearInterval(interval); // Stop checking once the button is found.

					// Get the post ID dynamically.
					let postId = $("#post_ID").val();
					if (!postId) {
						return;
					}

					// Dynamically generate the preview URL.
					let previewUrl = window.location.origin + "/?smartforms_preview=1&form_id=" + postId;

					// Override the preview button behavior.
					previewButton.attr("href", previewUrl).attr("target", "_blank");

					// Ensure the Preview button saves before opening preview.
					previewButton.off("click").on("click", function(e) {
						e.preventDefault();
						$("#publish").click(); // Trigger save
						setTimeout(() => {
							window.open(previewUrl, "_blank");
						}, 1500);
					});
				}
			}, 500); // Check every 500ms
		});
	</script>
	<?php
}

add_action( 'admin_footer', 'smartforms_override_preview_button' );

/**
 * Force enable the Preview button for SmartForms CPT.
 */
function smartforms_force_enable_preview_button( $actions ) {
	global $post;

	if ( isset( $post->post_type ) && 'smart_form' === $post->post_type ) {
		// Ensure Preview button is available.
		$actions['view'] = '<a href="#" id="post-preview" class="preview button">Preview</a>';
	}

	return $actions;
}
add_filter( 'post_row_actions', 'smartforms_force_enable_preview_button' );
add_filter( 'page_row_actions', 'smartforms_force_enable_preview_button' );
