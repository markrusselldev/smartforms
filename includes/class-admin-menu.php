<?php
/**
 * Handles admin menu and related functionality, including custom columns and bulk actions.
 *
 * @package SmartForms
 */

namespace SmartForms;

use WP_Error;

/**
 * Admin menu class for SmartForms plugin.
 */
class Admin_Menu {

	/**
	 * Constructor to hook into WordPress actions.
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_smartforms_menu' ) );
		add_filter( 'parent_file', array( $this, 'set_active_menu' ) );
		add_filter( 'submenu_file', array( $this, 'set_active_submenu' ) );
		add_filter( 'manage_smart_form_posts_columns', array( $this, 'add_custom_columns' ) );
		add_action( 'manage_smart_form_posts_custom_column', array( $this, 'render_custom_columns' ), 10, 2 );
		add_filter( 'bulk_actions-edit-smart_form', array( $this, 'register_bulk_action' ) );
		add_action( 'handle_bulk_actions-edit-smart_form', array( $this, 'handle_bulk_duplicate_action' ), 10, 3 );
	}

	/**
	 * Add SmartForms menu and submenu items.
	 *
	 * @return void
	 */
	public function add_smartforms_menu() {
		add_menu_page(
			esc_html__( 'SmartForms', 'smartforms' ),
			esc_html__( 'SmartForms', 'smartforms' ),
			'manage_options',
			'smartforms',
			array( $this, 'render_forms_list' ),
			'dashicons-feedback',
			20
		);
	}

	/**
	 * Redirects to the Forms list page.
	 *
	 * @return void
	 */
	public function render_forms_list() {
		wp_safe_redirect( admin_url( 'edit.php?post_type=smart_form' ) );
		exit;
	}

	/**
	 * Set the active parent menu item.
	 *
	 * @param string $parent_file The current parent file.
	 * @return string The modified parent file.
	 */
	public function set_active_menu( $parent_file ) {
		$screen = get_current_screen();

		if ( $screen && 'smart_form' === $screen->post_type ) {
			return 'smartforms';
		}

		return $parent_file;
	}

	/**
	 * Set the active submenu item.
	 *
	 * @param string $submenu_file The current submenu file.
	 * @return string The modified submenu file.
	 */
	public function set_active_submenu( $submenu_file ) {
		$screen = get_current_screen();

		if ( $screen && 'smart_form' === $screen->post_type ) {
			return 'edit.php?post_type=smart_form';
		}

		return $submenu_file;
	}

	/**
	 * Add custom columns to the Forms list page.
	 *
	 * @param array $columns The current columns.
	 * @return array The modified columns.
	 */
	public function add_custom_columns( $columns ) {
		$columns['number_of_fields'] = esc_html__( 'Number of Fields', 'smartforms' );
		$columns['last_modified']    = esc_html__( 'Last Modified', 'smartforms' );
		return $columns;
	}

	/**
	 * Render custom column content.
	 *
	 * @param string $column The name of the column.
	 * @param int    $post_id The post ID.
	 * @return void
	 */
	public function render_custom_columns( $column, $post_id ) {
		switch ( $column ) {
			case 'number_of_fields':
				$field_count = get_post_meta( $post_id, '_smart_form_field_count', true );
				echo esc_html( intval( $field_count ) ?: '0' );
				break;

			case 'last_modified':
				$last_modified = get_post_modified_time( 'Y/m/d H:i', false, $post_id );
				echo esc_html( $last_modified );
				break;
		}
	}

	/**
	 * Register the "Duplicate" bulk action.
	 *
	 * @param array $bulk_actions The current bulk actions.
	 * @return array The modified bulk actions.
	 */
	public function register_bulk_action( $bulk_actions ) {
		$bulk_actions['duplicate'] = esc_html__( 'Duplicate', 'smartforms' );
		return $bulk_actions;
	}

	/**
	 * Handle the "Duplicate" bulk action.
	 *
	 * @param string $redirect_url The redirect URL.
	 * @param string $action The action name.
	 * @param array  $post_ids The selected post IDs.
	 * @return string The modified redirect URL.
	 */
	public function handle_bulk_duplicate_action( $redirect_url, $action, $post_ids ) {
		if ( 'duplicate' !== $action ) {
			return $redirect_url;
		}

		foreach ( $post_ids as $post_id ) {
			$post = get_post( $post_id );

			if ( ! $post ) {
				SmartForms::log_error( 'Failed to duplicate: Post not found. ID: ' . esc_html( $post_id ) );
				continue;
			}

			$new_post_id = wp_insert_post(
				array(
					'post_title'   => sanitize_text_field( $post->post_title ) . ' (Copy)',
					'post_content' => wp_kses_post( $post->post_content ),
					'post_status'  => sanitize_text_field( $post->post_status ),
					'post_type'    => sanitize_text_field( $post->post_type ),
				),
				true
			);

			if ( is_wp_error( $new_post_id ) ) {
				SmartForms::log_error(
					'Post duplication failed for ID: ' . esc_html( $post_id ),
					$new_post_id
				);
				continue;
			}

			$meta = get_post_meta( $post_id );
			foreach ( $meta as $key => $values ) {
				foreach ( $values as $value ) {
					add_post_meta( $new_post_id, sanitize_key( $key ), maybe_unserialize( $value ) );
				}
			}

			SmartForms::log_error(
				'Form duplicated successfully: Original ID ' . esc_html( $post_id ) . ' -> New ID ' . esc_html( $new_post_id )
			);
		}

		$redirect_url = add_query_arg( 'bulk_duplicate', count( $post_ids ), $redirect_url );
		return esc_url_raw( $redirect_url );
	}
}
