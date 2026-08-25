<?php get_header(); ?><main class="container content"><h1><?php single_post_title(); ?></h1><?php while(have_posts()): the_post(); the_content(); endwhile; ?></main><?php get_footer(); ?>
