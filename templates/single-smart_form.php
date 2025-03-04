<?php
/**
 * Template for displaying SmartForms chatbot UI without theme elements.
 *
 * @package SmartForms
 */

\SmartForms\Core\SmartForms::log_error( 'single-smart_form.php loaded for Form ID: ' . get_the_ID() );

// Prevent WordPress from loading the default theme layout.
define( 'DONOTCACHEPAGE', true );
header( 'Content-Type: text/html; charset=' . get_bloginfo( 'charset' ) );

// Start output buffering.
ob_start();
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

<div class="smartforms-container">
    <?php
    if ( have_posts() ) :
        while ( have_posts() ) :
            the_post();
            $form_id = get_the_ID();

            if ( empty( $form_id ) ) {
                $error = new \WP_Error( 'missing_form_id', __( 'Form ID is missing.', 'smartforms' ) );
                \SmartForms\Core\SmartForms::log_error( 'single-smart_form.php failed: Missing form ID.', $error );
                echo '<p class="text-danger">' . esc_html__( 'Error: Form ID is missing.', 'smartforms' ) . '</p>';
                return;
            }

            \SmartForms\Core\SmartForms::log_error( 'single-smart_form.php rendering Form ID: ' . $form_id );
            
            if ( method_exists( '\SmartForms\Core\ChatUI', 'render' ) ) {
                echo \SmartForms\Core\ChatUI::render( $form_id );
            } else {
                $error = new \WP_Error( 'function_not_found', __( 'ChatUI::render function not found.', 'smartforms' ) );
                \SmartForms\Core\SmartForms::log_error( 'single-smart_form.php failed: ChatUI::render function missing.', $error );
                echo '<p class="text-danger">' . esc_html__( 'Error: Chat UI function missing.', 'smartforms' ) . '</p>';
            }
        endwhile;
    else :
        $error = new \WP_Error( 'no_posts_found', __( 'No form post found.', 'smartforms' ) );
        \SmartForms\Core\SmartForms::log_error( 'single-smart_form.php failed: No post found.', $error );
        echo '<p class="text-danger">' . esc_html__( 'Error: No form found.', 'smartforms' ) . '</p>';
    endif;
    ?>
</div>

<?php wp_footer(); ?>

</body>
</html>
<?php
// Flush the output buffer.
ob_end_flush();
