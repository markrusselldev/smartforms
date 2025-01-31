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
		'name'               => _x( 'Forms', 'post type general name', 'smartforms' ),
		'singular_name'      => _x( 'Form', 'post type singular name', 'smartforms' ),
		'menu_name'          => _x( 'SmartForms', 'admin menu', 'smartforms' ),
		'name_admin_bar'     => _x( 'Form', 'add new on admin bar', 'smartforms' ),
		'add_new'            => _x( 'Add New', 'form', 'smartforms' ),
		'add_new_item'       => __( 'Add New Form', 'smartforms' ),
		'new_item'           => __( 'New Form', 'smartforms' ),
		'edit_item'          => __( 'Edit Form', 'smartforms' ),
		'view_item'          => __( 'View Form', 'smartforms' ),
		'all_items'          => __( 'All Forms', 'smartforms' ),
		'search_items'       => __( 'Search Forms', 'smartforms' ),
		'parent_item_colon'  => __( 'Parent Forms:', 'smartforms' ),
		'not_found'          => __( 'No forms found.', 'smartforms' ),
		'not_found_in_trash' => __( 'No forms found in Trash.', 'smartforms' ),
	);

	$args = array(
		'labels'             => $labels,
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'query_var'          => true,
		'rewrite'            => array( 'slug' => 'smartforms_form' ),
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => false,
		'menu_position'      => null,
		'supports'           => array( 'title', 'editor' ),
		'show_in_rest'       => true, // Enables Gutenberg editor.
	);

	register_post_type( 'smartforms_form', $args );
}

add_action( 'init', 'smartforms_register_form_cpt' );
