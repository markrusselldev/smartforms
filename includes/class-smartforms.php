<?php
/**
 * Core plugin functionality.
 *
 * Handles plugin initialization, activation, and admin setup.
 *
 * @package SmartForms
 */

namespace Smartforms;

/**
 * Main SmartForms class.
 */
class Smartforms
{
    /**
     * Singleton instance of the plugin.
     *
     * @var Smartforms|null
     */
    private static $_instance = null;

    /**
     * Get or create the singleton instance.
     *
     * @return Smartforms The singleton instance.
     */
    public static function getInstance()
    {
        if (null === self::$_instance) {
            self::$_instance = new self();
            error_log('SmartForms: Singleton instance created.');
        }
        return self::$_instance;
    }

    /**
     * Activation hook for the plugin.
     *
     * @return void
     */
    public static function activate()
    {
        add_option('smartforms_version', '1.0.0');
        error_log('SmartForms: Plugin activated.');
    }

    /**
     * Deactivation hook for the plugin.
     *
     * @return void
     */
    public static function deactivate()
    {
        delete_option('smartforms_version');
        error_log('SmartForms: Plugin deactivated.');
    }

    /**
     * Constructor.
     *
     * Initializes the plugin and admin-specific functionality.
     */
    private function __construct()
    {
        error_log('SmartForms: Constructor called.');
        if (is_admin()) {
            error_log('SmartForms: Admin environment detected.');
            add_action('init', [ $this, 'initializeAdmin' ]);
            add_action('init', [ $this, 'registerCustomPostType' ]);
        }
    }

    /**
     * Initialize admin functionality.
     *
     * @return void
     */
    public function initializeAdmin()
    {
        error_log('SmartForms: Initializing admin functionality.');
        if (class_exists('Smartforms\Admin_Menu')) {
            new Admin_Menu();
        } else {
            error_log('SmartForms: Admin_Menu class not found.');
        }
    }

    /**
     * Register the custom post type for forms.
     *
     * @return void
     */
    public function registerCustomPostType()
    {
        register_post_type(
            'smart_form',
            [
                'label'       => 'Forms',
                'public'      => false,
                'show_ui'     => false, // Hide it from the default admin menu.
                'supports'    => [ 'title', 'editor' ],
                'rewrite'     => false,
            ]
        );
        error_log("SmartForms: Custom post type 'smart_form' registered.");
    }
}
