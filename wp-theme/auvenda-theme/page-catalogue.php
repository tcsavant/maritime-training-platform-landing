<?php
/* Template Name: Course catalogue */
get_header();

$requested_direction = is_tax('course_direction') ? get_queried_object()->slug : (isset($_GET['direction']) ? sanitize_title(wp_unslash($_GET['direction'])) : 'all');
$terms = get_terms(array('taxonomy' => 'course_direction', 'hide_empty' => false));
if (is_wp_error($terms)) $terms = array();
$active_term = null;
foreach ($terms as $term) if ($term->slug === $requested_direction) $active_term = $term;
if (!$active_term) $requested_direction = 'all';

$query_args = array('post_type' => 'course', 'posts_per_page' => -1, 'post_status' => 'publish');
if ($active_term) $query_args['tax_query'] = array(array('taxonomy' => 'course_direction', 'field' => 'term_id', 'terms' => $active_term->term_id));
$courses = new WP_Query($query_args);
$catalogue_url = is_page() ? get_permalink() : get_post_type_archive_link('course');
$result_label = $active_term ? $active_term->name : __('All Training', 'auvenda-theme');
?>
<main id="main-content">
  <section class="catalogue-page" id="catalogue-page" aria-labelledby="catalogue-title">
    <div class="catalogue-hero">
      <div class="site-container catalogue-hero-inner">
        <div class="catalogue-breadcrumbs" aria-label="<?php esc_attr_e('Breadcrumb', 'auvenda-theme'); ?>">
          <a href="<?php echo esc_url(auvenda_home_url()); ?>"><?php esc_html_e('Home', 'auvenda-theme'); ?></a><span>/</span><strong><?php esc_html_e('Course Catalogue', 'auvenda-theme'); ?></strong>
        </div>
        <div>
          <p class="eyebrow"><?php esc_html_e('COURSE CATALOGUE', 'auvenda-theme'); ?></p>
          <h1 id="catalogue-title"><?php echo esc_html(is_page() ? get_the_title() : __('Course catalogue', 'auvenda-theme')); ?></h1>
          <p class="lead"><?php esc_html_e('Explore maritime training directions and available course titles.', 'auvenda-theme'); ?></p>
        </div>
        <div class="catalogue-summary"><div><span><?php esc_html_e('COURSES SHOWN', 'auvenda-theme'); ?></span><strong><?php echo esc_html($courses->found_posts); ?></strong><small><?php echo esc_html($result_label); ?></small></div></div>
      </div>
    </div>
    <div class="site-container catalogue-body">
      <aside class="catalogue-sidebar" aria-label="<?php esc_attr_e('Course directions', 'auvenda-theme'); ?>">
        <div class="catalogue-sidebar-heading"><span><?php esc_html_e('TRAINING DIRECTIONS', 'auvenda-theme'); ?></span><a href="<?php echo esc_url($catalogue_url); ?>"><?php esc_html_e('Reset filter', 'auvenda-theme'); ?></a></div>
        <nav>
          <a class="catalogue-category-button <?php echo $requested_direction === 'all' ? 'active' : ''; ?>" href="<?php echo esc_url($catalogue_url); ?>"><span><?php esc_html_e('All Training', 'auvenda-theme'); ?></span><small><?php echo esc_html(wp_count_posts('course')->publish); ?></small></a>
          <?php foreach ($terms as $term) : ?><a class="catalogue-category-button <?php echo $requested_direction === $term->slug ? 'active' : ''; ?>" href="<?php echo esc_url(add_query_arg('direction', $term->slug, $catalogue_url)); ?>"><span><?php echo esc_html($term->name); ?></span><small><?php echo esc_html($term->count); ?></small></a><?php endforeach; ?>
        </nav>
      </aside>
      <div class="catalogue-results">
        <div class="catalogue-results-heading"><div><span><?php echo esc_html(strtoupper($result_label)); ?></span><strong><?php esc_html_e('Available course titles', 'auvenda-theme'); ?></strong></div></div>
        <div class="course-results-grid">
          <?php if ($courses->have_posts()) : $index = 0; while ($courses->have_posts()) : $courses->the_post(); $index++; $course_terms = get_the_terms(get_the_ID(), 'course_direction'); ?>
            <article class="catalogue-course-card">
              <div class="course-card-topline"><span><?php esc_html_e('COURSE', 'auvenda-theme'); ?></span><span><?php echo esc_html(sprintf('%02d', $index)); ?></span></div>
              <h3><?php the_title(); ?></h3>
              <p><?php echo esc_html(get_the_excerpt() ?: __('Course details, delivery options and provider availability.', 'auvenda-theme')); ?></p>
              <div class="catalogue-course-meta"><span><?php esc_html_e('Course direction', 'auvenda-theme'); ?><strong><?php echo esc_html($course_terms && !is_wp_error($course_terms) ? $course_terms[0]->name : __('Direction pending', 'auvenda-theme')); ?></strong></span></div>
              <div class="catalogue-course-actions"><a href="<?php the_permalink(); ?>"><?php esc_html_e('Course details →', 'auvenda-theme'); ?></a><a href="<?php echo esc_url(auvenda_home_url() . '#contact'); ?>"><?php esc_html_e('Request guidance', 'auvenda-theme'); ?></a></div>
            </article>
          <?php endwhile; else : ?>
            <div class="catalogue-empty"><strong><?php esc_html_e('No matched courses yet.', 'auvenda-theme'); ?></strong><p><?php esc_html_e('Titles will appear when the catalogue is updated.', 'auvenda-theme'); ?></p></div>
          <?php endif; wp_reset_postdata(); ?>
        </div>
      </div>
    </div>
  </section>
</main>
<?php get_footer(); ?>
