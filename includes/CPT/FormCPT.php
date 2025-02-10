<?php
/**
 * Registers the Custom Post Type (CPT) for SmartForms.
 *
 * @package SmartForms
 */

namespace SmartForms\CPT;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

/**
 * Class FormCPT
 *
 * Handles the registration of the SmartForms custom post type.
 */
class FormCPT {

	/**
	 * Constructor.
	 *
	 * Hooks into WordPress to register the custom post type on 'init'.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_cpt' ), 5 );
	}

	/**
	 * Registers the SmartForms custom post type.
	 *
	 * @return void
	 */
	public function register_cpt() {
		$labels = array(
			'name'               => _x( 'SmartForms Entries', 'post type general name', 'smartforms' ),
			'singular_name'      => _x( 'SmartForm Entry', 'post type singular name', 'smartforms' ),
			'menu_name'          => _x( 'SmartForms', 'admin menu', 'smartforms' ),
			'name_admin_bar'     => _x( 'SmartForm', 'add new on admin bar', 'smartforms' ),
			'add_new'            => esc_html_x( 'Add New', 'form', 'smartforms' ),
			'add_new_item'       => esc_html__( 'Add New SmartForm', 'smartforms' ),
			'new_item'           => esc_html__( 'New SmartForm', 'smartforms' ),
			'edit_item'          => esc_html__( 'Edit SmartForm', 'smartforms' ),
			'view_item'          => esc_html__( 'View SmartForm', 'smartforms' ),
			'all_items'          => esc_html__( 'All SmartForms', 'smartforms' ),
			'search_items'       => esc_html__( 'Search SmartForms', 'smartforms' ),
			'parent_item_colon'  => esc_html__( 'Parent Forms:', 'smartforms' ),
			'not_found'          => esc_html__( 'No SmartForms found.', 'smartforms' ),
			'not_found_in_trash' => esc_html__( 'No SmartForms found in Trash.', 'smartforms' ),
		);

		$args = array(
			'labels'             => $labels,
			'public'             => true,
			'publicly_queryable' => true,
			'show_ui'            => true,
			'show_in_menu'       => 'smartforms',
			'query_var'          => true,
			'rewrite'            => array( 'slug' => 'smart_form', 'with_front' => false ),
			'capability_type'    => 'post',
			'has_archive'        => false,
			'hierarchical'       => false,
			'menu_position'      => null,
			'show_in_admin_bar'  => true,
			'supports'           => array( 'title', 'editor', 'revisions' ),
			'show_in_rest'       => true,
		);

		$registered = register_post_type( 'smart_form', $args );

		if ( is_wp_error( $registered ) ) {
			\SmartForms\Core\SmartForms::log_error( 'Failed to register custom post type: smart_form', $registered );
		}
	}
}
