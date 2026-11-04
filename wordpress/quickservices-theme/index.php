<?php
/**
 * Universal WordPress Fallback Template
 *
 * @package QuickServicesTheme
 */

// If Full Site Editing is enabled, WordPress handles rendering via templates/*.html.
// This file serves as the fallback entry point required by WordPress theme hierarchy standards.
get_header();
?>
<main id="primary" class="site-main wrap sec">
    <?php
    if (have_posts()) :
        while (have_posts()) :
            the_post();
            the_title('<h1>', '</h1>');
            the_content();
        endwhile;
    else :
        echo '<p>' . esc_html__('No content found.', 'quickservices-theme') . '</p>';
    endif;
    ?>
</main>
<?php
get_footer();
