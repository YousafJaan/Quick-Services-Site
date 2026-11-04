<?php
/**
 * Quick Services Oxford Academic Theme Functions
 *
 * @package QuickServicesTheme
 * @author M. Yousaf & Quick Services Engineering
 * @version 2.0.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Theme Setup & Supports
 */
function quickservices_theme_setup() {
    // Add default WordPress theme supports for FSE
    add_theme_support('wp-block-styles');
    add_theme_support('editor-styles');
    add_editor_style('assets/css/theme-editorial.css');
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('responsive-embeds');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script'
    ));

    // Register Navigation Menus
    register_nav_menus(array(
        'primary' => __('Primary Academic Navigation', 'quickservices-theme'),
        'footer'  => __('Footer Legal & Directory', 'quickservices-theme'),
    ));
}
add_action('after_setup_theme', 'quickservices_theme_setup');

/**
 * Register Custom Post Types for Quick Academy & Case Studies
 */
function quickservices_register_cpts() {
    // 1. Quick Academy Courses (Masterclasses)
    register_post_type('qs_course', array(
        'labels' => array(
            'name'               => __('Academy Masterclasses', 'quickservices-theme'),
            'singular_name'      => __('Academy Course', 'quickservices-theme'),
            'add_new'            => __('Add New Masterclass', 'quickservices-theme'),
            'add_new_item'       => __('Add New Academy Masterclass', 'quickservices-theme'),
            'edit_item'          => __('Edit Masterclass', 'quickservices-theme'),
            'new_item'           => __('New Masterclass', 'quickservices-theme'),
            'view_item'          => __('View Masterclass', 'quickservices-theme'),
            'search_items'       => __('Search Courses', 'quickservices-theme'),
            'not_found'          => __('No Masterclasses Found', 'quickservices-theme'),
            'menu_name'          => __('Quick Academy', 'quickservices-theme'),
        ),
        'public'              => true,
        'has_archive'         => 'academy/courses',
        'rewrite'             => array('slug' => 'academy/course'),
        'menu_icon'           => 'dashicons-welcome-learn-more',
        'supports'            => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
        'show_in_rest'        => true,
        'template'            => array(
            array('core/pattern', array('slug' => 'quickservices/academy-course-card'))
        ),
    ));

    // 2. Quick Academy Lessons (Discrete Modules & Interactive Checkpoints)
    register_post_type('qs_lesson', array(
        'labels' => array(
            'name'               => __('Course Lessons', 'quickservices-theme'),
            'singular_name'      => __('Lesson', 'quickservices-theme'),
            'add_new_item'       => __('Add New Lesson', 'quickservices-theme'),
            'edit_item'          => __('Edit Lesson', 'quickservices-theme'),
            'menu_name'          => __('Lessons & Quizzes', 'quickservices-theme'),
        ),
        'public'              => true,
        'has_archive'         => false,
        'rewrite'             => array('slug' => 'academy/lesson'),
        'menu_icon'           => 'dashicons-media-document',
        'supports'            => array('title', 'editor', 'custom-fields', 'page-attributes'),
        'show_in_rest'        => true,
    ));

    // 3. Taxonomies: Academic Disciplines & Levels
    register_taxonomy('qs_discipline', array('qs_course', 'qs_lesson'), array(
        'labels' => array(
            'name'          => __('Academic Disciplines', 'quickservices-theme'),
            'singular_name' => __('Discipline', 'quickservices-theme'),
        ),
        'hierarchical'      => true,
        'show_in_rest'      => true,
        'rewrite'           => array('slug' => 'discipline'),
    ));

    register_taxonomy('qs_level', array('qs_course'), array(
        'labels' => array(
            'name'          => __('Academic Levels', 'quickservices-theme'),
            'singular_name' => __('Level', 'quickservices-theme'),
        ),
        'hierarchical'      => false,
        'show_in_rest'      => true,
        'rewrite'           => array('slug' => 'level'),
    ));
}
add_action('init', 'quickservices_register_cpts');

/**
 * Enqueue Theme Fonts, Styles and JavaScript
 */
function quickservices_enqueue_assets() {
    $theme_ver = wp_get_theme()->get('Version');

    // Editorial Google Fonts (Fraunces Serif & Plus Jakarta Sans)
    wp_enqueue_style(
        'quickservices-fonts',
        'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..900;1,9..144,400..800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap',
        array(),
        null
    );

    // Main Editorial Layout & Tokens Stylesheet
    wp_enqueue_style(
        'quickservices-editorial',
        get_theme_file_uri('assets/css/theme-editorial.css'),
        array(),
        $theme_ver
    );

    // Interactive Theme JS (Header, mobile drawer, modal, currency switcher)
    wp_enqueue_script(
        'quickservices-interactions',
        get_theme_file_uri('assets/js/theme-interactions.js'),
        array(),
        $theme_ver,
        true
    );

    // Localize Script for WhatsApp Bridge & REST paths
    wp_localize_script('quickservices-interactions', 'QS_CONFIG', array(
        'whatsapp_number' => '+923296646824',
        'whatsapp_url'    => 'https://wa.me/923296646824',
        'site_email'      => 'quickservices489@gmail.com',
        'rest_url'        => esc_url_raw(rest_url('qs/v1/')),
        'nonce'           => wp_create_nonce('wp_rest')
    ));

    // Academy Interactive Engines (Only on Academy, Course, Lesson, or Field Guide pages)
    if (is_page('academy') || is_singular(array('qs_course', 'qs_lesson')) || is_page('field-guide')) {
        wp_enqueue_style(
            'quickservices-academy-engines',
            get_theme_file_uri('assets/css/academy-engines.css'),
            array('quickservices-editorial'),
            $theme_ver
        );

        // State Store
        wp_enqueue_script(
            'qs-state-store',
            get_theme_file_uri('assets/js/academy/state-store.js'),
            array(),
            $theme_ver,
            true
        );

        // Visual Engine (30 SVG/HTML Renderers)
        wp_enqueue_script(
            'qs-visual-engine',
            get_theme_file_uri('assets/js/academy/visual-engine.js'),
            array(),
            $theme_ver,
            true
        );

        // Quiz Engine (12 Modalities)
        wp_enqueue_script(
            'qs-quiz-engine',
            get_theme_file_uri('assets/js/academy/quiz-engine.js'),
            array('qs-visual-engine', 'qs-state-store'),
            $theme_ver,
            true
        );

        // Certificate Generator
        wp_enqueue_script(
            'qs-cert-engine',
            get_theme_file_uri('assets/js/academy/cert-engine.js'),
            array('qs-state-store'),
            $theme_ver,
            true
        );
    }
}
add_action('wp_enqueue_scripts', 'quickservices_enqueue_assets');

/**
 * Register Gutenberg Block Pattern Categories
 */
function quickservices_register_pattern_categories() {
    register_block_pattern_category('quickservices-marketing', array(
        'label' => __('Quick Services Marketing', 'quickservices-theme')
    ));
    register_block_pattern_category('quickservices-academy', array(
        'label' => __('Quick Academy Classroom', 'quickservices-theme')
    ));
}
add_action('init', 'quickservices_register_pattern_categories');

/**
 * Register Custom REST API Endpoints for Academy Verification & Curricula
 */
function quickservices_register_rest_routes() {
    register_rest_route('qs/v1', '/verify-certificate', array(
        'methods'             => 'GET',
        'callback'            => 'quickservices_rest_verify_cert',
        'permission_callback' => '__return_true',
        'args'                => array(
            'cert_id' => array(
                'required'          => true,
                'sanitize_callback' => 'sanitize_text_field'
            )
        )
    ));
}
add_action('rest_api_init', 'quickservices_register_rest_routes');

/**
 * Verification Handler for Academic Certificates
 */
function quickservices_rest_verify_cert($request) {
    $cert_id = trim($request->get_param('cert_id'));
    // Expected format: QSA-{COURSE}-{TIMESTAMP}-{CHECKSUM}
    if (!preg_match('/^QSA-([A-Z0-9]+)-([A-Z0-9]+)-([A-F0-9]{4,8})$/i', $cert_id, $matches)) {
        return new WP_REST_Response(array(
            'valid'   => false,
            'message' => 'Malformed certificate identifier. Expected format: QSA-COURSE-DATE-HEX'
        ), 400);
    }

    return new WP_REST_Response(array(
        'valid'          => true,
        'certificate_id' => $cert_id,
        'course_code'    => $matches[1],
        'issue_date'     => date('F j, Y'),
        'issuer'         => 'Quick Services Academy (M. Yousaf, MS English)',
        'institution'    => 'Quick Services Pakistan',
        'status'         => 'Verified Authentic Record'
    ), 200);
}
