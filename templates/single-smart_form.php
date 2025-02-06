<?php
/**
 * Template for displaying SmartForms on the frontend.
 *
 * @package SmartForms
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

get_header();
?>

<main id="primary" class="site-main">
	<?php
	while ( have_posts() ) :
		the_post();
		?>
		<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
			<div class="smartforms-container">
				<form class="smartforms-form" method="post">
					<?php the_content(); // Render form blocks inside the <form> ?>
					<div class="smartforms-buttons">
						<button type="submit" class="btn btn-primary">Submit</button>
					</div>
				</form>
			</div>
		</article>
	<?php endwhile; ?>
</main>

<?php
get_footer();
