=== Sentiment Analysis with Tensorflowjs ===
Contributors: UjW0L
Tags: block, sentiment-analysis, machine-learning
Requires at least: 5.7.2
Tested up to: 6.5.0
Requires PHP: 7.4.9
Stable tag: 1.1.0
License: GPL V2

Guternberg block to detect sentiment of the paragraph as you write using Tensorflowjs

== Description ==
Plugins lets you write the paragraph on block editor and anlyses the sentiment of the paragraph as you write it.


= Integrations =
Only model and metadata are loaded from following services (no data will be sent to them) 
* Plugin uses third party model from https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json
* Plugin uses third party metadata from https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json


== Installation ==

This section describes how to install the plugin and get it working.

1. Upload the plugin files to the `/wp-content/plugins/sentiment-analysis-with-tensorflowjs` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Go to Post screen look for TF Sentiment Analysis block on text section of block list
4. Add the block
5. Write a paragraph and block will analyse sentiment of paragraph 


== Frequently Asked Questions ==

= Why can't I write more than 100 words ? =

The model I am using (the only one I can find) for machine learning can only analyse 100 words at a time, if they develop other model I will update it in future. For now you can use multiple block with each paragraph less than 100 words.

== Screenshots ==
1. Gutenberg Block

== Changelog ==

=1.0.0=
*First Stable version

=1.1.0=
*JSX Support 
*Doesn't use scripts from expternal sites