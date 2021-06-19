
const { useEffect } = React;
const tfsaEl = wp.element.createElement;
const __ = wp.i18n.__;
const { InspectorControls, RichText, } = wp.blockEditor;
const { useState } = wp.element;

/**
 * @since 1.0.0 
 * 
 * Loads meta data through fetch api
 * 
 * @returns metaData.json() JSON of meta data
 */
const loadMetadata = async () => {
    let metaData = await fetch("https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json");
    return metaData.json();
};
/**
 * @since 1.0.0
 * 
 * Loads tensor flow layer model
 * 
 * @returns tf.loadLayersModel Loads tensoeflow layer model
 */
const loadModel = async () => await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json');

/**
 * 
 * @param {*} sequence  Text sequence in array
 * @param {*} metadata  Metadata for 
 * 
 * @returns seq Text in array of length 100 or less
 */

const padSequences = (sequence, metadata) => {

    if (sequence.length > metadata.max_len) {
        sequence.splice(0, sequence.length - metadata.max_len);
    }
    if (sequence.length < metadata.max_len) {
        let pad = Array();
        for (let i = 0; i < metadata.max_len - sequence.length; i++) {
            pad.push(0);
        }
        seq = pad.concat(sequence);
    }
    return seq;
}

/**
 * 
 * @param {*} text Sentiment Analysis text
 * @param {*} model Tf model
 * @param {*} metaData Tf metadata
 */

const predictScore = (trimmedText, model, metaData) => {
    const sequence = trimmedText.map(x => {
        let wordIndex = metaData.word_index[x];
        if ('undefined' === typeof wordIndex) {
            return 2; //oov_index
        }
        return wordIndex + metaData.index_from;
    })

    const paddedSequence = padSequences(sequence, metaData);
    const input = tf.tensor2d(paddedSequence, [1, metaData.max_len]);
    const predictOut = model.predict(input);
    const score = predictOut.dataSync()[0];
    predictOut.dispose();
    return score;
}

/**
 * @since 1.0.0
 * 
 * Run the sentiment analysis of the text
 * 
 * @param {*} text Sentiment analysis text
 * 
 * @returns score Sentiment score of the text  
 */
const run = async (text) => {
    const model = await loadModel();
    const metaData = await loadMetadata();
    let score = predictScore(text, model, metaData);

    return score
}

wp.blocks.registerBlockType('tf-sa/tf-sentiment-analysis',
    {
        title: __('TF Sentiment Analysis', 'tf-sa'),
        icon: 'lightbulb',
        description: __("Sentiment analysis of the the text", 'tf-sa'),
        category: 'text',
        keywords: [__('Sentiment Analysis', 'tf-sa')],
        example: {},
        attributes: {
            text: { type: 'String', default: '' },
            color: { type: 'String', default: '' },
            sentiment: { type: 'string', default: '' },
            textLength: { type: 'Number', default: 0 },
        },
        example: {},

        edit: ({ attributes, setAttributes }) => {

            useEffect(() => {

                let trimmedText = attributes.text.trim().toLowerCase().replace(/(\.|\,|\!|\?)/g, "").split(' ');

                setAttributes({ textLength: trimmedText.length })
                let score = run(trimmedText);

                score.then((sc) => {
                    let score = parseFloat(sc, 10);
                    if (score > 0.66) {
                        setAttributes({ sentiment: __('Positive', 'tf-sa') });
                        setAttributes({ color: 'rgba(60, 179, 113,1)' });
                    } else if (score > 0.4) {
                        setAttributes({ sentiment: __('Neutral', 'tf-sa') });
                        setAttributes({ color: 'rgba(247, 202, 24, 1)' });
                    } else {
                        setAttributes({ sentiment: __('Negative', 'tf-sa') });
                        setAttributes({ color: 'rgba(255, 0, 0,1)' });
                    }
                });

            }, [attributes.text]);


            return tfsaEl('div', null,
                tfsaEl(RichText, { tag: 'p', allowedFormats: [], onChange: val => setAttributes({ text: val }), value: attributes.text, placeholder: __('Type text', 'tf-sa') }),
                tfsaEl('div', { style: { width: '100%', backgroundColor: 'rgba(255,255,255,1)', height: '175px', padding: '10px' } },
                    tfsaEl('span', { className: 'dashicons-before dashicons-lightbulb' }, __('Sentiment Analysis', 'tf-sa')),
                    tfsaEl('span', { className: 'dashicons dashicons-lightbulb', style: { height: '50px', marginLeft: 'auto', marginRight: 'auto', display: 'block', fontSize: '50px', color: attributes.color } }, ''),
                    tfsaEl('div', {}, tfsaEl('span', {}, __('Sentiment : ', 'tfsa')), tfsaEl('span', { style: { color: attributes.color } }, attributes.sentiment)),
                    tfsaEl('div', {}, tfsaEl('span', {}, __('Word Count : ', 'tfsa')), tfsaEl('span', {}, attributes.textLength), tfsaEl('span', { style: { fontSize: '10px' } }, __(' ( Keep word count to less than 100. )', __('tf-sa')))),
                ),
            )
        },
        save: ({ attributes }) => { return tfsaEl('p', {}, attributes.text) },


    });