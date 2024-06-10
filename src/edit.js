import * as tf from '@tensorflow/tfjs';
import {useEffect} from 'react';
import { 
	Card,
    CardHeader,
    CardBody,
    CardFooter,} from '@wordpress/components';


/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps,RichText } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({attributes, setAttributes}) {



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
 * @since 1.0.0
 * 
 * Pad the word sequence to be predicted
 * 
 * @param {*} sequence  Text sequence in array
 * @param {*} metadata  Metadata for 
 * 
 * @returns seq Text in array of length 100 or less
 */

const padSequences = (sequence, metadata) => {

	let seq;

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
 * @since 1.0.0
 * 
 * Predict score
 * 
 * @param {*} text Sentiment Analysis text
 * @param {*} model Tf model
 * @param {*} metaData Tf metadata
 * 
 * @returns score Sentiment score
 */

const predictScore = (trimmedText, model, metaData) => {
    const sequence = trimmedText.map(x => {

        if (' ' != x) {
            let wordIndex = metaData.word_index[x];
            if ('undefined' === typeof wordIndex) {
                return 2; //oov_index
            }
            return wordIndex + metaData.index_from;
        }
    })
    let seq = sequence.filter(y => y);
    const paddedSequence = padSequences(seq, metaData);
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


useEffect(() => {

	if(attributes.text.length>0){
	let trimmedText = attributes.text.trim().toLowerCase().replace(/(\.|\,|\!|\?)/g, "").split(' ');

	setAttributes({ textLength: trimmedText.filter(z => ' ' != z).length })
	let score = run(trimmedText);

	score.then((sc) => {
		let score = parseFloat(sc, 10);

	setAttributes({sentScore:score});
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
}else{
	setAttributes({ textLength: 0});
	setAttributes({sentScore:0});
	setAttributes({ color: 'rgba(247, 202, 24, 1)' });
	setAttributes({ sentiment: __('Neutral', 'tf-sa') });
}

}, [attributes.text]);

	return (
		<div { ...useBlockProps() }>
		
			<RichText
			style={{border:'1px solid rgba(0,0,0,1)',padding:'5px'}}
			tag="p"
			allowedFormats={[]}
			onChange={val=>setAttributes({text:val})}
			value={attributes.text}
			placeholder={__("Type paragraph",'tf-sa')}			
			/>
           <Card>
		   <CardHeader>
			<div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,1)', height: '20px', padding: '10px' } }>
				<span className='dashicons-before dashicons-lightbulb'>{__('Sentiment Analysis', 'tf-sa')}</span>

			</div>
			</CardHeader>
			<CardBody>
			<span className= 'dashicons dashicons-lightbulb' style={{ height: '50px', marginLeft: 'auto', marginRight: 'auto', display: 'block', fontSize: '50px', color: attributes.color }} ></span>
			<div style={{display:'block'}}>
				<span>{ __('Word Count: ', 'tf-sa')}</span>
				<span> {attributes.textLength} </span>
				<span style={{ fontSize: '10px' }}><i>{__('(Keep word count to less than 100.)','tf-sa')}</i></span>
			</div>
			</CardBody>
			<CardFooter>

			<div style={{padding:"25px"}}>
				
				<span>{ __('Score  : ', 'tf-sa')}</span>
				<span style={{ color: attributes.color }}>{parseFloat(attributes.sentScore).toFixed(2)*100}</span>
				<br/>
				<i style={{ fontSize: '10px' }}>{__('Score from 1 to 100.','tf-sa')}</i>
			</div>

			<div style={{padding:"25px"}}>
				
				<span>{ __('Sentiment : ', 'tf-sa')}</span>
				<span style={{ color: attributes.color }}>{attributes.sentiment}</span>
			</div>
			</CardFooter>
			</Card>
		</div>
	);
}
