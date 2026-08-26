<?php
/* Template Name: Course catalogue */
get_header();

$requested_direction = isset($_GET['direction']) ? sanitize_title(wp_unslash($_GET['direction'])) : 'all';
$directions = auvenda_course_directions();
$active_direction = null;
foreach ($directions as $direction) if ($direction['slug'] === $requested_direction) $active_direction = $direction;
if (!$active_direction) $requested_direction = 'all';
$all_courses = auvenda_source_courses();
$courses = auvenda_courses_for_direction($all_courses, $requested_direction);
$catalogue_url = is_page() ? get_permalink() : get_post_type_archive_link('course');
$result_label = $active_direction ? auvenda_direction_label($active_direction) : __('All Training', 'auvenda-theme');
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
        <div class="catalogue-summary"><div><span><?php esc_html_e('COURSES SHOWN', 'auvenda-theme'); ?></span><strong><?php echo esc_html(count($courses)); ?></strong><small><?php echo esc_html($result_label); ?></small></div></div>
      </div>
    </div>
    <div class="site-container catalogue-body">
      <div class="catalogue-filter">
        <button class="catalogue-filter-toggle" type="button" aria-expanded="false" aria-controls="catalogue-category-panel"><span><?php esc_html_e('Training directions', 'auvenda-theme'); ?></span><strong><?php echo esc_html($result_label); ?></strong><i aria-hidden="true"></i></button>
        <aside class="catalogue-sidebar" id="catalogue-category-panel" aria-label="<?php esc_attr_e('Course directions', 'auvenda-theme'); ?>">
          <div class="catalogue-sidebar-heading"><span><?php esc_html_e('TRAINING DIRECTIONS', 'auvenda-theme'); ?></span><a href="<?php echo esc_url($catalogue_url); ?>"><?php esc_html_e('Reset filter', 'auvenda-theme'); ?></a></div>
          <nav>
            <a class="catalogue-category-button <?php echo $requested_direction === 'all' ? 'active' : ''; ?>" href="<?php echo esc_url($catalogue_url); ?>"><span><?php esc_html_e('All Training', 'auvenda-theme'); ?></span><small><?php echo esc_html(count($all_courses)); ?></small></a>
            <?php foreach ($directions as $direction) : ?><a class="catalogue-category-button <?php echo $requested_direction === $direction['slug'] ? 'active' : ''; ?>" href="<?php echo esc_url(add_query_arg('direction', $direction['slug'], $catalogue_url)); ?>"><span><?php echo esc_html(auvenda_direction_label($direction)); ?></span><small><?php echo esc_html(count(auvenda_courses_for_direction($all_courses, $direction['slug']))); ?></small></a><?php endforeach; ?>
          </nav>
        </aside>
      </div>
      <div class="catalogue-results">
        <div class="catalogue-results-heading"><div><span><?php echo esc_html(strtoupper($result_label)); ?></span><strong><?php esc_html_e('Available course titles', 'auvenda-theme'); ?></strong></div></div>
        <div class="course-results-grid">
          <?php if ($courses) : foreach ($courses as $index => $course) : $course_direction = !empty($course['directions'][0]) ? $course['directions'][0] : ''; $course_direction_label = __('Direction pending', 'auvenda-theme'); foreach ($directions as $direction) if ($direction['slug'] === $course_direction) $course_direction_label = auvenda_direction_label($direction); ?>
            <article class="catalogue-course-card">
              <div class="course-card-topline"><span><?php esc_html_e('TCSAVANT.COM SOURCE', 'auvenda-theme'); ?></span><span><?php echo esc_html(sprintf('%02d', $index + 1)); ?></span></div>
              <h3><?php echo esc_html($course['title']); ?></h3>
              <p><?php esc_html_e('Course details, delivery options and provider availability will be mapped into the marketplace.', 'auvenda-theme'); ?></p>
              <div class="catalogue-course-meta"><span><?php esc_html_e('Course direction', 'auvenda-theme'); ?><strong><?php echo esc_html($course_direction_label); ?></strong></span></div>
              <div class="catalogue-course-actions"><a href="<?php echo esc_url($course['link']); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e('Source details ↗', 'auvenda-theme'); ?></a><a href="<?php echo esc_url(auvenda_home_url() . '#contact'); ?>"><?php esc_html_e('Request guidance', 'auvenda-theme'); ?></a></div>
            </article>
          <?php endforeach; else : ?>
            <div class="catalogue-empty"><strong><?php esc_html_e('No matched courses yet.', 'auvenda-theme'); ?></strong><p><?php esc_html_e('Titles will appear when the catalogue is updated.', 'auvenda-theme'); ?></p></div>
          <?php endif; ?>
        </div>
      </div>
    </div>
  </section>
</main>
<?php get_footer(); ?>
