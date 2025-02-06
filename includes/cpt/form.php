<?php
/**
 * Registers the Custom Post Type (CPT) for SmartForms.
 *
 * @package SmartForms
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

/**
 * Registers the SmartForms custom post type.
 *
 * @return void
 */
function smartforms_register_form_cpt() {
	$labels = array(
		'name'               => _x( 'SmartForms Entries', 'post type general name', 'smartforms' ),
		'singular_name'      => _x( 'SmartForm Entry', 'post type singular name', 'smartforms' ),
		'menu_name'          => _x( 'SmartForms', 'admin menu', 'smartforms' ),
		'name_admin_bar'     => _x( 'SmartForm', 'add new on admin bar', 'smartforms' ),
		'add_new'            => _x( 'Add New', 'form', 'smartforms' ),
		'add_new_item'       => __( 'Add New SmartForm', 'smartforms' ),
		'new_item'           => __( 'New SmartForm', 'smartforms' ),
		'edit_item'          => __( 'Edit SmartForm', 'smartforms' ),
		'view_item'          => __( 'View SmartForm', 'smartforms' ),
		'all_items'          => __( 'All SmartForms', 'smartforms' ),
		'search_items'       => __( 'Search SmartForms', 'smartforms' ),
		'parent_item_colon'  => __( 'Parent Forms:', 'smartforms' ),
		'not_found'          => __( 'No SmartForms found.', 'smartforms' ),
		'not_found_in_trash' => __( 'No SmartForms found in Trash.', 'smartforms' ),
	);

	$args = array(
		'labels'             => $labels,
		'public'             => true,
		'publicly_queryable' => false,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'query_var'          => false,
		'rewrite'            => false, // ❗ No need for frontend URLs since chatbot loads the forms.
		'capability_type'    => 'post',
		'has_archive'        => false, // ❗ No need for an archive page.
		'hierarchical'       => false,
		'menu_position'      => null,
		'show_in_admin_bar'  => true,
		'supports'           => array( 'title', 'editor', 'revision' ),
		'show_in_rest'       => true, // Enables Gutenberg editor.
	);

	register_post_type( 'smart_form', $args ); // ✅ Keeping original CPT name
}

add_action( 'init', 'smartforms_register_form_cpt', 5 );

/**
 * Ensures the form block outputs a proper `<form>` wrapper.
 *
 * @param array  $attributes Block attributes.
 * @param string $content    Inner block content.
 * @return string Wrapped form output.
 */
function smartforms_render_form_block( $attributes, $content ) {
	// Ensure a proper form wrapper with method="post" by default.
	return '<form class="smartforms-form" method="post">' . do_shortcode( $content ) . '</form>';
}

register_block_type(
	'smartforms/form',
	array(
		'render_callback' => 'smartforms_render_form_block',
	)
);
