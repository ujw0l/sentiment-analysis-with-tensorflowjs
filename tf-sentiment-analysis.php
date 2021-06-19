<?php 
/*
 Plugin Name:Sentiment Analysis with Tensorflowjs
 Plugin URI: https://github.com/ujw0l/sentiment-analysis-with-tensorflowjs
 Description: Sentiment analysis with Tensorflow.js gutenberg block
 Version: 1.0.0
 Author: Ujwol Bastakoti
 Author URI:https://ujw0l.github.io/
 Text Domain:  tf-sa
 License: GPLv2
*/

/**
 * Since 1.0.0
 * 
 * Enqueue Tensorflow Js File
 */
add_action( 'admin_enqueue_scripts', function(){wp_enqueue_script('tensorFlowJs', 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.0.0/dist/tf.min.js');});


/**
 * Since 1.0.0
 * 
 * Register block js
 */
add_action('init', function(){

    wp_register_script(
        'tf-sa-block-editor', 
        plugins_url('js/tf-sa-block.js',__FILE__), 
        array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n','tensorFlowJs' ) );


        register_block_type(
            'tf-sa/tf-sentiment-analysis',
            array('editor_script'=>'tf-sa-block-editor'),
        );

});