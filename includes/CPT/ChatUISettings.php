<?php
/**
 * ChatUISettings: Global Chat UI settings for SmartForms.
 *
 * This file registers a submenu under the SmartForms menu where users
 * can customize the overall appearance of the chat interface.
 *
 * @package SmartForms
 */

namespace SmartForms\CPT;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

/**
 * Class ChatUISettings
 *
 * Manages global styling settings for the SmartForms chat interface.
 */
class ChatUISettings {

	/**
	 * Option name for storing Chat UI styles.
	 *
	 * @var string
	 */
	const OPTION_NAME = 'smartforms_chat_ui_styles';

	/**
	 * Singleton instance.
	 *
	 * @var ChatUISettings|null
	 */
	private static $instance = null;

	/**
	 * Gets the singleton instance.
	 *
	 * @return ChatUISettings The singleton instance.
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
		\SmartForms\Core\SmartForms::log_error( '[DEBUG] ChatUISettings constructor called.' );
		add_action( 'admin_menu', array( $this, 'add_submenu_page' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
	}

	/**
	 * Adds a submenu page under the SmartForms menu.
	 *
	 * @return void
	 */
	public function add_submenu_page() {
		add_submenu_page(
			'smartforms',
			__( 'SmartForms Styles', 'smartforms' ),
			__( 'Styles', 'smartforms' ),
			'manage_options',
			'smartforms-chat-ui-settings',
			array( $this, 'render_settings_page' )
		);
	}

	/**
	 * Registers all settings sections and fields.
	 *
	 * @return void
	 */
	public function register_settings() {
		register_setting(
			'smartforms_chat_ui_settings_group',
			self::OPTION_NAME,
			array( 'sanitize_callback' => array( $this, 'sanitize_settings' ) )
		);

		/*
		 * -------------------------------------------------------------------------
		 * Chat Container Styles Section.
		 * -------------------------------------------------------------------------
		 */
		add_settings_section(
			'smartforms_chat_container_section',
			__( 'Chat Container Styles', 'smartforms' ),
			null,
			'smartforms-chat-ui-settings'
		);
		$this->add_field( 'chat_container_background_color', __( 'Background Color', 'smartforms' ), 'color', '#ffffff', 'smartforms_chat_container_section' );
		$this->add_field( 'chat_container_border_color', __( 'Border Color', 'smartforms' ), 'color', '#cccccc', 'smartforms_chat_container_section' );
		$this->add_field( 'chat_container_border_style', __( 'Border Style', 'smartforms' ), 'select', 'solid', 'smartforms_chat_container_section', array(
			'choices' => array(
				'solid'  => __( 'Solid', 'smartforms' ),
				'dashed' => __( 'Dashed', 'smartforms' ),
				'dotted' => __( 'Dotted', 'smartforms' ),
				'none'   => __( 'None', 'smartforms' ),
			),
		) );
		$this->add_field( 'chat_container_border_width', __( 'Border Width (px)', 'smartforms' ), 'number', 1, 'smartforms_chat_container_section', array( 'min' => 0 ) );
		$this->add_field( 'chat_container_border_radius', __( 'Border Radius (px)', 'smartforms' ), 'number', 10, 'smartforms_chat_container_section', array( 'min' => 0 ) );
		$this->add_field( 'chat_container_box_shadow', __( 'Box Shadow', 'smartforms' ), 'select', 'none', 'smartforms_chat_container_section', array(
			'choices' => array(
				'none'   => __( 'None', 'smartforms' ),
				'small'  => __( 'Small', 'smartforms' ),
				'medium' => __( 'Medium', 'smartforms' ),
				'large'  => __( 'Large', 'smartforms' ),
			),
		) );
		$this->add_field( 'chat_container_padding', __( 'Padding', 'smartforms' ), 'text', '10px', 'smartforms_chat_container_section' );
		$this->add_field( 'chat_container_margin', __( 'Margin', 'smartforms' ), 'text', '10px', 'smartforms_chat_container_section' );
		$this->add_field( 'chat_container_layout_type', __( 'Layout Type', 'smartforms' ), 'text', 'flex', 'smartforms_chat_container_section' );
		$this->add_field( 'chat_container_flex_direction', __( 'Flex Direction', 'smartforms' ), 'text', 'column', 'smartforms_chat_container_section' );
		$this->add_field( 'chat_container_justify_content', __( 'Justify Content', 'smartforms' ), 'text', 'center', 'smartforms_chat_container_section' );
		$this->add_field( 'chat_container_align_items', __( 'Align Items', 'smartforms' ), 'text', 'center', 'smartforms_chat_container_section' );
		$this->add_field( 'chat_container_theme', __( 'Theme', 'smartforms' ), 'text', 'bootstrap-default', 'smartforms_chat_container_section' );

		/*
		 * -------------------------------------------------------------------------
		 * Chat Dialog Styles Section.
		 * -------------------------------------------------------------------------
		 */
		add_settings_section(
			'smartforms_chat_dialog_section',
			__( 'Chat Dialog Styles', 'smartforms' ),
			null,
			'smartforms-chat-ui-settings'
		);
		$this->add_field( 'chat_dialog_background_color', __( 'Background Color', 'smartforms' ), 'color', '#f8f9fa', 'smartforms_chat_dialog_section' );
		$this->add_field( 'chat_dialog_text_color', __( 'Text Color', 'smartforms' ), 'color', '#333333', 'smartforms_chat_dialog_section' );
		$this->add_field( 'chat_dialog_font_family', __( 'Font Family', 'smartforms' ), 'text', 'Helvetica, Arial, sans-serif', 'smartforms_chat_dialog_section' );
		$this->add_field( 'chat_dialog_font_size', __( 'Font Size', 'smartforms' ), 'text', '14px', 'smartforms_chat_dialog_section' );
		$this->add_field( 'chat_dialog_padding', __( 'Padding', 'smartforms' ), 'text', '8px', 'smartforms_chat_dialog_section' );
		$this->add_field( 'chat_dialog_border_color', __( 'Border Color', 'smartforms' ), 'color', '#dddddd', 'smartforms_chat_dialog_section' );
		$this->add_field( 'chat_dialog_border_style', __( 'Border Style', 'smartforms' ), 'select', 'solid', 'smartforms_chat_dialog_section', array(
			'choices' => array(
				'solid'  => __( 'Solid', 'smartforms' ),
				'dashed' => __( 'Dashed', 'smartforms' ),
				'dotted' => __( 'Dotted', 'smartforms' ),
				'none'   => __( 'None', 'smartforms' ),
			),
		) );
		$this->add_field( 'chat_dialog_border_width', __( 'Border Width (px)', 'smartforms' ), 'number', 1, 'smartforms_chat_dialog_section', array( 'min' => 0 ) );
		$this->add_field( 'chat_dialog_border_radius', __( 'Border Radius (px)', 'smartforms' ), 'number', 5, 'smartforms_chat_dialog_section', array( 'min' => 0 ) );

		/*
		 * -------------------------------------------------------------------------
		 * Form Styles Section.
		 * -------------------------------------------------------------------------
		 */
		add_settings_section(
			'smartforms_form_section',
			__( 'Form Styles', 'smartforms' ),
			null,
			'smartforms-chat-ui-settings'
		);
		$this->add_field( 'form_background_color', __( 'Background Color', 'smartforms' ), 'color', '#ffffff', 'smartforms_form_section' );
		$this->add_field( 'form_font_family', __( 'Font Family', 'smartforms' ), 'text', 'Helvetica, Arial, sans-serif', 'smartforms_form_section' );
		$this->add_field( 'form_font_size', __( 'Font Size', 'smartforms' ), 'text', '14px', 'smartforms_form_section' );
		$this->add_field( 'form_text_color', __( 'Text Color', 'smartforms' ), 'color', '#333333', 'smartforms_form_section' );
		$this->add_field( 'form_padding', __( 'Padding', 'smartforms' ), 'text', '15px', 'smartforms_form_section' );

		/*
		 * -------------------------------------------------------------------------
		 * Fields - Checkbox Styles Section.
		 * -------------------------------------------------------------------------
		 */
		add_settings_section(
			'smartforms_fields_checkbox_section',
			__( 'Fields - Checkbox Styles', 'smartforms' ),
			null,
			'smartforms-chat-ui-settings'
		);
		$this->add_field( 'fields_checkbox_background_color', __( 'Background Color', 'smartforms' ), 'color', '#ffffff', 'smartforms_fields_checkbox_section' );
		$this->add_field( 'fields_checkbox_border_color', __( 'Border Color', 'smartforms' ), 'color', '#cccccc', 'smartforms_fields_checkbox_section' );
		$this->add_field( 'fields_checkbox_border_style', __( 'Border Style', 'smartforms' ), 'select', 'solid', 'smartforms_fields_checkbox_section', array(
			'choices' => array(
				'solid'  => __( 'Solid', 'smartforms' ),
				'dashed' => __( 'Dashed', 'smartforms' ),
				'dotted' => __( 'Dotted', 'smartforms' ),
				'none'   => __( 'None', 'smartforms' ),
			),
		) );
		$this->add_field( 'fields_checkbox_border_width', __( 'Border Width (px)', 'smartforms' ), 'number', 1, 'smartforms_fields_checkbox_section', array( 'min' => 0 ) );
		$this->add_field( 'fields_checkbox_border_radius', __( 'Border Radius (px)', 'smartforms' ), 'number', 3, 'smartforms_fields_checkbox_section', array( 'min' => 0 ) );
		$this->add_field( 'fields_checkbox_padding', __( 'Padding', 'smartforms' ), 'text', '5px', 'smartforms_fields_checkbox_section' );
		$this->add_field( 'fields_checkbox_margin', __( 'Margin', 'smartforms' ), 'text', '5px', 'smartforms_fields_checkbox_section' );
		$this->add_field( 'fields_checkbox_font_size', __( 'Font Size', 'smartforms' ), 'text', 'inherit', 'smartforms_fields_checkbox_section' );
		$this->add_field( 'fields_checkbox_text_color', __( 'Text Color', 'smartforms' ), 'color', '#000000', 'smartforms_fields_checkbox_section' );

		/*
		 * -------------------------------------------------------------------------
		 * Fields - Progress Styles Section.
		 * -------------------------------------------------------------------------
		 */
		add_settings_section(
			'smartforms_fields_progress_section',
			__( 'Fields - Progress Styles', 'smartforms' ),
			null,
			'smartforms-chat-ui-settings'
		);
		$this->add_field( 'fields_progress_background_color', __( 'Background Color', 'smartforms' ), 'color', '#eeeeee', 'smartforms_fields_progress_section' );
		$this->add_field( 'fields_progress_text_color', __( 'Text Color', 'smartforms' ), 'color', '#000000', 'smartforms_fields_progress_section' );
		$this->add_field( 'fields_progress_padding', __( 'Padding', 'smartforms' ), 'text', '5px', 'smartforms_fields_progress_section' );

		/*
		 * -------------------------------------------------------------------------
		 * Fields - Slider Styles Section.
		 * -------------------------------------------------------------------------
		 */
		add_settings_section(
			'smartforms_fields_slider_section',
			__( 'Fields - Slider Styles', 'smartforms' ),
			null,
			'smartforms-chat-ui-settings'
		);
		$this->add_field( 'fields_slider_background_color', __( 'Background Color', 'smartforms' ), 'color', '#ffffff', 'smartforms_fields_slider_section' );
		$this->add_field( 'fields_slider_border_color', __( 'Border Color', 'smartforms' ), 'color', '#cccccc', 'smartforms_fields_slider_section' );
		$this->add_field( 'fields_slider_border_style', __( 'Border Style', 'smartforms' ), 'select', 'solid', 'smartforms_fields_slider_section', array(
			'choices' => array(
				'solid'  => __( 'Solid', 'smartforms' ),
				'dashed' => __( 'Dashed', 'smartforms' ),
				'dotted' => __( 'Dotted', 'smartforms' ),
				'none'   => __( 'None', 'smartforms' ),
			),
		) );
		$this->add_field( 'fields_slider_border_width', __( 'Border Width (px)', 'smartforms' ), 'number', 1, 'smartforms_fields_slider_section', array( 'min' => 0 ) );
		$this->add_field( 'fields_slider_border_radius', __( 'Border Radius (px)', 'smartforms' ), 'number', 5, 'smartforms_fields_slider_section', array( 'min' => 0 ) );
		$this->add_field( 'fields_slider_padding', __( 'Padding', 'smartforms' ), 'text', '5px', 'smartforms_fields_slider_section' );
		$this->add_field( 'fields_slider_margin', __( 'Margin', 'smartforms' ), 'text', '5px', 'smartforms_fields_slider_section' );
		$this->add_field( 'fields_slider_text_color', __( 'Text Color', 'smartforms' ), 'color', '#000000', 'smartforms_fields_slider_section' );

		/*
		 * -------------------------------------------------------------------------
		 * Fields - Group Styles Section.
		 * -------------------------------------------------------------------------
		 */
		add_settings_section(
			'smartforms_fields_group_section',
			__( 'Fields - Group Styles', 'smartforms' ),
			null,
			'smartforms-chat-ui-settings'
		);
		$this->add_field( 'fields_group_background_color', __( 'Background Color', 'smartforms' ), 'color', '#ffffff', 'smartforms_fields_group_section' );
		$this->add_field( 'fields_group_border_color', __( 'Border Color', 'smartforms' ), 'color', '#cccccc', 'smartforms_fields_group_section' );
		$this->add_field( 'fields_group_border_style', __( 'Border Style', 'smartforms' ), 'select', 'solid', 'smartforms_fields_group_section', array(
			'choices' => array(
				'solid'  => __( 'Solid', 'smartforms' ),
				'dashed' => __( 'Dashed', 'smartforms' ),
				'dotted' => __( 'Dotted', 'smartforms' ),
				'none'   => __( 'None', 'smartforms' ),
			),
		) );
		$this->add_field( 'fields_group_border_width', __( 'Border Width (px)', 'smartforms' ), 'number', 1, 'smartforms_fields_group_section', array( 'min' => 0 ) );
		$this->add_field( 'fields_group_border_radius', __( 'Border Radius (px)', 'smartforms' ), 'number', 5, 'smartforms_fields_group_section', array( 'min' => 0 ) );
		$this->add_field( 'fields_group_padding', __( 'Padding', 'smartforms' ), 'text', '10px', 'smartforms_fields_group_section' );
		$this->add_field( 'fields_group_margin', __( 'Margin', 'smartforms' ), 'text', '5px', 'smartforms_fields_group_section' );
		$this->add_field( 'fields_group_text_color', __( 'Text Color', 'smartforms' ), 'color', '#000000', 'smartforms_fields_group_section' );

		/*
		 * -------------------------------------------------------------------------
		 * Fields - Radio Styles Section.
		 * -------------------------------------------------------------------------
		 */
		add_settings_section(
			'smartforms_fields_radio_section',
			__( 'Fields - Radio Styles', 'smartforms' ),
			null,
			'smartforms-chat-ui-settings'
		);
		$this->add_field( 'fields_radio_background_color', __( 'Background Color', 'smartforms' ), 'color', '#ffffff', 'smartforms_fields_radio_section' );
		$this->add_field( 'fields_radio_border_color', __( 'Border Color', 'smartforms' ), 'color', '#cccccc', 'smartforms_fields_radio_section' );
		$this->add_field( 'fields_radio_border_style', __( 'Border Style', 'smartforms' ), 'select', 'solid', 'smartforms_fields_radio_section', array(
			'choices' => array(
				'solid'  => __( 'Solid', 'smartforms' ),
				'dashed' => __( 'Dashed', 'smartforms' ),
				'dotted' => __( 'Dotted', 'smartforms' ),
				'none'   => __( 'None', 'smartforms' ),
			),
		) );
		$this->add_field( 'fields_radio_border_width', __( 'Border Width (px)', 'smartforms' ), 'number', 1, 'smartforms_fields_radio_section', array( 'min' => 0 ) );
		$this->add_field( 'fields_radio_border_radius', __( 'Border Radius (px)', 'smartforms' ), 'number', 5, 'smartforms_fields_radio_section', array( 'min' => 0 ) );
		$this->add_field( 'fields_radio_padding', __( 'Padding', 'smartforms' ), 'text', '5px', 'smartforms_fields_radio_section' );
		$this->add_field( 'fields_radio_margin', __( 'Margin', 'smartforms' ), 'text', '5px', 'smartforms_fields_radio_section' );
		$this->add_field( 'fields_radio_text_color', __( 'Text Color', 'smartforms' ), 'color', '#000000', 'smartforms_fields_radio_section' );

		/*
		 * -------------------------------------------------------------------------
		 * Fields - Text Styles Section.
		 * -------------------------------------------------------------------------
		 */
		add_settings_section(
			'smartforms_fields_text_section',
			__( 'Fields - Text Styles', 'smartforms' ),
			null,
			'smartforms-chat-ui-settings'
		);
		$this->add_field( 'fields_text_background_color', __( 'Background Color', 'smartforms' ), 'color', '#ffffff', 'smartforms_fields_text_section' );
		$this->add_field( 'fields_text_border_color', __( 'Border Color', 'smartforms' ), 'color', '#cccccc', 'smartforms_fields_text_section' );
		$this->add_field( 'fields_text_border_style', __( 'Border Style', 'smartforms' ), 'select', 'solid', 'smartforms_fields_text_section', array(
			'choices' => array(
				'solid'  => __( 'Solid', 'smartforms' ),
				'dashed' => __( 'Dashed', 'smartforms' ),
				'dotted' => __( 'Dotted', 'smartforms' ),
				'none'   => __( 'None', 'smartforms' ),
			),
		) );
		$this->add_field( 'fields_text_border_width', __( 'Border Width (px)', 'smartforms' ), 'number', 1, 'smartforms_fields_text_section', array( 'min' => 0 ) );
		$this->add_field( 'fields_text_border_radius', __( 'Border Radius (px)', 'smartforms' ), 'number', 3, 'smartforms_fields_text_section', array( 'min' => 0 ) );
		$this->add_field( 'fields_text_padding', __( 'Padding', 'smartforms' ), 'text', '5px', 'smartforms_fields_text_section' );
		$this->add_field( 'fields_text_margin', __( 'Margin', 'smartforms' ), 'text', '5px', 'smartforms_fields_text_section' );
		$this->add_field( 'fields_text_text_color', __( 'Text Color', 'smartforms' ), 'color', '#000000', 'smartforms_fields_text_section' );

		/*
		 * -------------------------------------------------------------------------
		 * Fields - Number Styles Section.
		 * -------------------------------------------------------------------------
		 */
		add_settings_section(
			'smartforms_fields_number_section',
			__( 'Fields - Number Styles', 'smartforms' ),
			null,
			'smartforms-chat-ui-settings'
		);
		$this->add_field( 'fields_number_background_color', __( 'Background Color', 'smartforms' ), 'color', '#ffffff', 'smartforms_fields_number_section' );
		$this->add_field( 'fields_number_border_color', __( 'Border Color', 'smartforms' ), 'color', '#cccccc', 'smartforms_fields_number_section' );
		$this->add_field( 'fields_number_border_style', __( 'Border Style', 'smartforms' ), 'select', 'solid', 'smartforms_fields_number_section', array(
			'choices' => array(
				'solid'  => __( 'Solid', 'smartforms' ),
				'dashed' => __( 'Dashed', 'smartforms' ),
				'dotted' => __( 'Dotted', 'smartforms' ),
				'none'   => __( 'None', 'smartforms' ),
			),
		) );
		$this->add_field( 'fields_number_border_width', __( 'Border Width (px)', 'smartforms' ), 'number', 1, 'smartforms_fields_number_section', array( 'min' => 0 ) );
		$this->add_field( 'fields_number_border_radius', __( 'Border Radius (px)', 'smartforms' ), 'number', 3, 'smartforms_fields_number_section', array( 'min' => 0 ) );
		$this->add_field( 'fields_number_padding', __( 'Padding', 'smartforms' ), 'text', '5px', 'smartforms_fields_number_section' );
		$this->add_field( 'fields_number_margin', __( 'Margin', 'smartforms' ), 'text', '5px', 'smartforms_fields_number_section' );
		$this->add_field( 'fields_number_text_color', __( 'Text Color', 'smartforms' ), 'color', '#000000', 'smartforms_fields_number_section' );

		/*
		 * -------------------------------------------------------------------------
		 * Fields - Select Styles Section.
		 * -------------------------------------------------------------------------
		 */
		add_settings_section(
			'smartforms_fields_select_section',
			__( 'Fields - Select Styles', 'smartforms' ),
			null,
			'smartforms-chat-ui-settings'
		);
		$this->add_field( 'fields_select_background_color', __( 'Background Color', 'smartforms' ), 'color', '#ffffff', 'smartforms_fields_select_section' );
		$this->add_field( 'fields_select_border_color', __( 'Border Color', 'smartforms' ), 'color', '#cccccc', 'smartforms_fields_select_section' );
		$this->add_field( 'fields_select_border_style', __( 'Border Style', 'smartforms' ), 'select', 'solid', 'smartforms_fields_select_section', array(
			'choices' => array(
				'solid'  => __( 'Solid', 'smartforms' ),
				'dashed' => __( 'Dashed', 'smartforms' ),
				'dotted' => __( 'Dotted', 'smartforms' ),
				'none'   => __( 'None', 'smartforms' ),
			),
		) );
		$this->add_field( 'fields_select_border_width', __( 'Border Width (px)', 'smartforms' ), 'number', 1, 'smartforms_fields_select_section', array( 'min' => 0 ) );
		$this->add_field( 'fields_select_border_radius', __( 'Border Radius (px)', 'smartforms' ), 'number', 3, 'smartforms_fields_select_section', array( 'min' => 0 ) );
		$this->add_field( 'fields_select_padding', __( 'Padding', 'smartforms' ), 'text', '5px', 'smartforms_fields_select_section' );
		$this->add_field( 'fields_select_margin', __( 'Margin', 'smartforms' ), 'text', '5px', 'smartforms_fields_select_section' );
		$this->add_field( 'fields_select_text_color', __( 'Text Color', 'smartforms' ), 'color', '#000000', 'smartforms_fields_select_section' );

		/*
		 * -------------------------------------------------------------------------
		 * Fields - Textarea Styles Section.
		 * -------------------------------------------------------------------------
		 */
		add_settings_section(
			'smartforms_fields_textarea_section',
			__( 'Fields - Textarea Styles', 'smartforms' ),
			null,
			'smartforms-chat-ui-settings'
		);
		$this->add_field( 'fields_textarea_background_color', __( 'Background Color', 'smartforms' ), 'color', '#ffffff', 'smartforms_fields_textarea_section' );
		$this->add_field( 'fields_textarea_border_color', __( 'Border Color', 'smartforms' ), 'color', '#cccccc', 'smartforms_fields_textarea_section' );
		$this->add_field( 'fields_textarea_border_style', __( 'Border Style', 'smartforms' ), 'select', 'solid', 'smartforms_fields_textarea_section', array(
			'choices' => array(
				'solid'  => __( 'Solid', 'smartforms' ),
				'dashed' => __( 'Dashed', 'smartforms' ),
				'dotted' => __( 'Dotted', 'smartforms' ),
				'none'   => __( 'None', 'smartforms' ),
			),
		) );
		$this->add_field( 'fields_textarea_border_width', __( 'Border Width (px)', 'smartforms' ), 'number', 1, 'smartforms_fields_textarea_section', array( 'min' => 0 ) );
		$this->add_field( 'fields_textarea_border_radius', __( 'Border Radius (px)', 'smartforms' ), 'number', 3, 'smartforms_fields_textarea_section', array( 'min' => 0 ) );
		$this->add_field( 'fields_textarea_padding', __( 'Padding', 'smartforms' ), 'text', '5px', 'smartforms_fields_textarea_section' );
		$this->add_field( 'fields_textarea_margin', __( 'Margin', 'smartforms' ), 'text', '5px', 'smartforms_fields_textarea_section' );
		$this->add_field( 'fields_textarea_text_color', __( 'Text Color', 'smartforms' ), 'color', '#000000', 'smartforms_fields_textarea_section' );

		/*
		 * -------------------------------------------------------------------------
		 * Button Styles Section.
		 * -------------------------------------------------------------------------
		 */
		add_settings_section(
			'smartforms_button_section',
			__( 'Button Styles', 'smartforms' ),
			null,
			'smartforms-chat-ui-settings'
		);
		$this->add_field( 'button_background_color', __( 'Background Color', 'smartforms' ), 'color', '#007bff', 'smartforms_button_section' );
		$this->add_field( 'button_text_color', __( 'Text Color', 'smartforms' ), 'color', '#ffffff', 'smartforms_button_section' );
		$this->add_field( 'button_border_color', __( 'Border Color', 'smartforms' ), 'color', '#007bff', 'smartforms_button_section' );
		$this->add_field( 'button_border_style', __( 'Border Style', 'smartforms' ), 'select', 'solid', 'smartforms_button_section', array(
			'choices' => array(
				'solid'  => __( 'Solid', 'smartforms' ),
				'dashed' => __( 'Dashed', 'smartforms' ),
				'dotted' => __( 'Dotted', 'smartforms' ),
				'none'   => __( 'None', 'smartforms' ),
			),
		) );
		$this->add_field( 'button_border_width', __( 'Border Width (px)', 'smartforms' ), 'number', 1, 'smartforms_button_section', array( 'min' => 0 ) );
		$this->add_field( 'button_border_radius', __( 'Border Radius (px)', 'smartforms' ), 'number', 4, 'smartforms_button_section', array( 'min' => 0 ) );
		$this->add_field( 'button_hover_background_color', __( 'Hover Background Color', 'smartforms' ), 'color', '#0056b3', 'smartforms_button_section' );
		$this->add_field( 'button_hover_text_color', __( 'Hover Text Color', 'smartforms' ), 'color', '#ffffff', 'smartforms_button_section' );
	}

	/**
	 * Helper method to add a settings field.
	 *
	 * @param string $field_key Unique field key.
	 * @param string $label Field label.
	 * @param string $type Field type: 'color', 'text', 'number', or 'select'.
	 * @param mixed  $default Default value.
	 * @param string $section Section ID.
	 * @param array  $args Additional arguments.
	 *
	 * @return void
	 */
	private function add_field( $field_key, $label, $type, $default, $section, $args = array() ) {
		$field_args = wp_parse_args(
			$args,
			array(
				'field_key' => $field_key,
				'label'     => $label,
				'type'      => $type,
				'default'   => $default,
				'section'   => $section,
			)
		);
		add_settings_field(
			$field_key,
			$label,
			array( $this, 'render_field' ),
			'smartforms-chat-ui-settings',
			$section,
			$field_args
		);
	}

	/**
	 * Renders a settings field based on its type.
	 *
	 * @param array $args Field arguments.
	 *
	 * @return void
	 */
	public function render_field( $args ) {
		switch ( $args['type'] ) {
			case 'color':
				$this->render_color_field( $args );
				break;
			case 'text':
				$this->render_text_field( $args );
				break;
			case 'number':
				$this->render_number_field( $args );
				break;
			case 'select':
				$this->render_select_field( $args );
				break;
			default:
				$this->render_text_field( $args );
				break;
		}
	}

	/**
	 * Renders a color input field.
	 *
	 * @param array $args Field arguments.
	 *
	 * @return void
	 */
	public function render_color_field( $args ) {
		$options   = get_option( self::OPTION_NAME, $this->get_defaults() );
		$field_key = $args['field_key'];
		$default   = $args['default'];
		$value     = isset( $options[ $field_key ] ) ? $options[ $field_key ] : $default;
		?>
		<input type="color" name="<?php echo esc_attr( self::OPTION_NAME ); ?>[<?php echo esc_attr( $field_key ); ?>]" value="<?php echo esc_attr( $value ); ?>" />
		<?php
	}

	/**
	 * Renders a text input field.
	 *
	 * @param array $args Field arguments.
	 *
	 * @return void
	 */
	public function render_text_field( $args ) {
		$options   = get_option( self::OPTION_NAME, $this->get_defaults() );
		$field_key = $args['field_key'];
		$default   = $args['default'];
		$value     = isset( $options[ $field_key ] ) ? $options[ $field_key ] : $default;
		?>
		<input type="text" name="<?php echo esc_attr( self::OPTION_NAME ); ?>[<?php echo esc_attr( $field_key ); ?>]" value="<?php echo esc_attr( $value ); ?>" />
		<?php
	}

	/**
	 * Renders a number input field.
	 *
	 * @param array $args Field arguments.
	 *
	 * @return void
	 */
	public function render_number_field( $args ) {
		$options   = get_option( self::OPTION_NAME, $this->get_defaults() );
		$field_key = $args['field_key'];
		$default   = $args['default'];
		$min       = isset( $args['min'] ) ? $args['min'] : 0;
		$value     = isset( $options[ $field_key ] ) ? $options[ $field_key ] : $default;
		?>
		<input type="number" name="<?php echo esc_attr( self::OPTION_NAME ); ?>[<?php echo esc_attr( $field_key ); ?>]" value="<?php echo esc_attr( $value ); ?>" min="<?php echo esc_attr( $min ); ?>" />
		<?php
	}

	/**
	 * Renders a select field.
	 *
	 * @param array $args Field arguments.
	 *
	 * @return void
	 */
	public function render_select_field( $args ) {
		$options   = get_option( self::OPTION_NAME, $this->get_defaults() );
		$field_key = $args['field_key'];
		$default   = $args['default'];
		$value     = isset( $options[ $field_key ] ) ? $options[ $field_key ] : $default;
		$choices   = isset( $args['choices'] ) ? $args['choices'] : array();
		?>
		<select name="<?php echo esc_attr( self::OPTION_NAME ); ?>[<?php echo esc_attr( $field_key ); ?>]">
			<?php foreach ( $choices as $key => $label ) : ?>
				<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $value, $key ); ?>>
					<?php echo esc_html( $label ); ?>
				</option>
			<?php endforeach; ?>
		</select>
		<?php
	}

	/**
	 * Returns the full default settings array.
	 *
	 * @return array Default settings.
	 */
	private function get_defaults() {
		return array(
			// Chat Container Defaults.
			'chat_container_background_color' => '#ffffff',
			'chat_container_border_color'     => '#cccccc',
			'chat_container_border_style'     => 'solid',
			'chat_container_border_width'     => 1,
			'chat_container_border_radius'    => 10,
			'chat_container_box_shadow'       => 'none',
			'chat_container_padding'          => '10px',
			'chat_container_margin'           => '10px',
			'chat_container_layout_type'      => 'flex',
			'chat_container_flex_direction'   => 'column',
			'chat_container_justify_content'  => 'center',
			'chat_container_align_items'      => 'center',
			'chat_container_theme'            => 'bootstrap-default',

			// Chat Dialog Defaults.
			'chat_dialog_background_color'    => '#f8f9fa',
			'chat_dialog_text_color'          => '#333333',
			'chat_dialog_font_family'         => 'Helvetica, Arial, sans-serif',
			'chat_dialog_font_size'           => '14px',
			'chat_dialog_padding'             => '8px',
			'chat_dialog_border_color'        => '#dddddd',
			'chat_dialog_border_style'        => 'solid',
			'chat_dialog_border_width'        => 1,
			'chat_dialog_border_radius'       => 5,

			// Form Defaults.
			'form_background_color'           => '#ffffff',
			'form_font_family'                => 'Helvetica, Arial, sans-serif',
			'form_font_size'                  => '14px',
			'form_text_color'                 => '#333333',
			'form_padding'                    => '15px',

			// Fields - Checkbox Defaults.
			'fields_checkbox_background_color' => '#ffffff',
			'fields_checkbox_border_color'     => '#cccccc',
			'fields_checkbox_border_style'     => 'solid',
			'fields_checkbox_border_width'     => 1,
			'fields_checkbox_border_radius'    => 3,
			'fields_checkbox_padding'          => '5px',
			'fields_checkbox_margin'           => '5px',
			'fields_checkbox_font_size'        => 'inherit',
			'fields_checkbox_text_color'       => '#000000',

			// Fields - Progress Defaults.
			'fields_progress_background_color' => '#eeeeee',
			'fields_progress_text_color'       => '#000000',
			'fields_progress_padding'          => '5px',

			// Fields - Slider Defaults.
			'fields_slider_background_color'   => '#ffffff',
			'fields_slider_border_color'       => '#cccccc',
			'fields_slider_border_style'       => 'solid',
			'fields_slider_border_width'       => 1,
			'fields_slider_border_radius'      => 5,
			'fields_slider_padding'            => '5px',
			'fields_slider_margin'             => '5px',
			'fields_slider_text_color'         => '#000000',

			// Fields - Group Defaults.
			'fields_group_background_color'    => '#ffffff',
			'fields_group_border_color'        => '#cccccc',
			'fields_group_border_style'        => 'solid',
			'fields_group_border_width'        => 1,
			'fields_group_border_radius'       => 5,
			'fields_group_padding'             => '10px',
			'fields_group_margin'              => '5px',
			'fields_group_text_color'          => '#000000',

			// Fields - Radio Defaults.
			'fields_radio_background_color'    => '#ffffff',
			'fields_radio_border_color'        => '#cccccc',
			'fields_radio_border_style'        => 'solid',
			'fields_radio_border_width'        => 1,
			'fields_radio_border_radius'       => 5,
			'fields_radio_padding'             => '5px',
			'fields_radio_margin'              => '5px',
			'fields_radio_text_color'          => '#000000',

			// Fields - Text Defaults.
			'fields_text_background_color'     => '#ffffff',
			'fields_text_border_color'         => '#cccccc',
			'fields_text_border_style'         => 'solid',
			'fields_text_border_width'         => 1,
			'fields_text_border_radius'        => 3,
			'fields_text_padding'              => '5px',
			'fields_text_margin'               => '5px',
			'fields_text_text_color'           => '#000000',

			// Fields - Number Defaults.
			'fields_number_background_color'   => '#ffffff',
			'fields_number_border_color'       => '#cccccc',
			'fields_number_border_style'       => 'solid',
			'fields_number_border_width'       => 1,
			'fields_number_border_radius'      => 3,
			'fields_number_padding'            => '5px',
			'fields_number_margin'             => '5px',
			'fields_number_text_color'         => '#000000',

			// Fields - Select Defaults.
			'fields_select_background_color'   => '#ffffff',
			'fields_select_border_color'       => '#cccccc',
			'fields_select_border_style'       => 'solid',
			'fields_select_border_width'       => 1,
			'fields_select_border_radius'      => 3,
			'fields_select_padding'            => '5px',
			'fields_select_margin'             => '5px',
			'fields_select_text_color'         => '#000000',

			// Fields - Textarea Defaults.
			'fields_textarea_background_color' => '#ffffff',
			'fields_textarea_border_color'     => '#cccccc',
			'fields_textarea_border_style'     => 'solid',
			'fields_textarea_border_width'     => 1,
			'fields_textarea_border_radius'    => 3,
			'fields_textarea_padding'          => '5px',
			'fields_textarea_margin'           => '5px',
			'fields_textarea_text_color'       => '#000000',

			// Button Defaults.
			'button_background_color'          => '#007bff',
			'button_text_color'                => '#ffffff',
			'button_border_color'              => '#007bff',
			'button_border_style'              => 'solid',
			'button_border_width'              => 1,
			'button_border_radius'             => 4,
			'button_hover_background_color'    => '#0056b3',
			'button_hover_text_color'          => '#ffffff',
		);
	}

	/**
	 * Sanitizes the settings input.
	 *
	 * Iterates over all default keys and sanitizes input values based on key name.
	 *
	 * @param array $input The unsanitized settings.
	 * @return array Sanitized settings.
	 */
	public function sanitize_settings( $input ) {
		$defaults = $this->get_defaults();
		$output   = array();

		foreach ( $defaults as $key => $default ) {
			if ( isset( $input[ $key ] ) ) {
				// Sanitize color fields.
				if ( false !== strpos( $key, 'background_color' ) ||
					false !== strpos( $key, 'border_color' ) ||
					false !== strpos( $key, 'text_color' ) ||
					false !== strpos( $key, 'hover_background_color' ) ||
					false !== strpos( $key, 'hover_text_color' ) ) {
					$output[ $key ] = sanitize_hex_color( $input[ $key ] );
				} elseif ( false !== strpos( $key, 'border_width' ) || false !== strpos( $key, 'border_radius' ) ) {
					$output[ $key ] = absint( $input[ $key ] );
				} elseif ( false !== strpos( $key, 'border_style' ) || false !== strpos( $key, 'box_shadow' ) ) {
					$output[ $key ] = sanitize_text_field( $input[ $key ] );
				} else {
					$output[ $key ] = sanitize_text_field( $input[ $key ] );
				}
			} else {
				$output[ $key ] = $default;
			}
		}
		return $output;
	}

	/**
	 * Renders the settings page.
	 *
	 * @return void
	 */
	public function render_settings_page() {
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'SmartForms Styles', 'smartforms' ); ?></h1>
			<form method="post" action="options.php">
				<?php
				settings_fields( 'smartforms_chat_ui_settings_group' );
				do_settings_sections( 'smartforms-chat-ui-settings' );
				submit_button();
				?>
			</form>
		</div>
		<?php
	}
}

ChatUISettings::get_instance();
