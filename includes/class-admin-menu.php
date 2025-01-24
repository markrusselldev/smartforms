<?php
/**
 * Handles admin menu and related functionality.
 *
 * @package SmartForms
 */

namespace Smartforms;

/**
 * Admin menu class for SmartForms plugin.
 */
class Admin_Menu
{

    /**
     * Constructor to hook into WordPress actions.
     */
    public function __construct()
    {
        add_action( 'admin_menu', [ $this, 'addSmartFormsMenu' ] );
        add_action( 'admin_menu', [ $this, 'renameFirstSubmenu' ], 11 );
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueueGutenbergAssets' ] );
        error_log( 'SmartForms: Admin_Menu constructor called.' );
    }

    /**
     * Add SmartForms menu and submenu items.
     *
     * @return void
     */
    public function addSmartFormsMenu()
    {
        add_menu_page(
            'SmartForms',                // Page title.
            'SmartForms',                // Menu title.
            'manage_options',            // Capability.
            'smartforms',                // Menu slug.
            [ $this, 'renderDashboard' ], // Callback for the main dashboard page.
            'dashicons-feedback',        // Icon.
            20                           // Position.
        );

        add_submenu_page(
            'smartforms',                // Parent menu slug.
            'Create Form',               // Page title.
            'Create Form',               // Menu title.
            'manage_options',            // Capability.
            'smartforms-create',         // Menu slug.
            [ $this, 'renderCreateFormPage' ] // Callback function.
        );
        error_log( 'SmartForms: Menu and submenu added.' );
    }

    /**
     * Rename the first submenu item to "Dashboard."
     *
     * @return void
     */
    public function renameFirstSubmenu()
    {
        global $submenu;
        if ( isset( $submenu['smartforms'] ) && isset( $submenu['smartforms'][0] ) ) {
            $submenu['smartforms'][0][0] = 'Dashboard'; // Rename the first submenu item.
            error_log( "SmartForms: Submenu renamed to 'Dashboard'." );
        } else {
            error_log( 'SmartForms: Submenu not found for renaming.' );
        }
    }

    /**
     * Render the main Dashboard page.
     *
     * @return void
     */
    public function renderDashboard()
    {
        ?>
        <div class="wrap">
            <h1>SmartForms Dashboard</h1>
            <p>Welcome to SmartForms. Use the "Create Form" option to build your forms.</p>
        </div>
        <?php
        error_log( 'SmartForms: Rendered Dashboard page.' );
    }

    /**
     * Render the "Create Form" admin page.
     *
     * @return void
     */
    public function renderCreateFormPage()
    {
        $form_id = ( isset( $_GET['form_id'] ) ? intval( $_GET['form_id'] ) : 0 );

        if ( $form_id ) {
            echo '<h1>Edit Form</h1>';
        } else {
            echo '<h1>Create Form</h1>';
        }

        echo '<div id="smartforms-editor"></div>'; // Gutenberg editor placeholder.
        error_log( 'SmartForms: Rendered Create Form page.' );
    }

    /**
     * Enqueue Gutenberg editor scripts and styles.
     *
     * @param string $hook_suffix The current admin page hook suffix.
     *
     * @return void
     */
    public function enqueueGutenbergAssets( $hook_suffix )
    {
        if ( 'smartforms_page_smartforms-create' === $hook_suffix ) {
            wp_enqueue_script(
                'smartforms-editor',
                plugins_url( '/assets/js/smartforms-editor.js', __FILE__ ),
                [
                    'wp-blocks',
                    'wp-editor',
                    'wp-element',
                    'wp-components',
                    'wp-data',
                ],
                '1.0.0',
                true
            );

            wp_enqueue_style(
                'smartforms-editor',
                plugins_url( '/assets/css/smartforms-editor.css', __FILE__ ),
                [],
                '1.0.0'
            );
            error_log( 'SmartForms: Enqueued Gutenberg assets.' );
        }
    }
}
