<?php 
/*
 Plugin Name:Sentiment Analysis with Tensorflowjs
 Plugin URI: https://github.com/ujw0l/sentiment-analysis-with-tensorflowjs
 Description: Sentiment analysis with Tensorflow.js gutenberg block
 Version: 1.1.0
 Author: Ujwol Bastakoti
 Author URI:https://ujw0l.github.io/
 Text Domain:  tf-sa
 License: GPLv2
*/
/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_sentiment_analysis_with_tensorflowjs_block_init() {

	register_block_type( __DIR__ . '/build');
}
add_action( 'init', 'create_block_sentiment_analysis_with_tensorflowjs_block_init' );
