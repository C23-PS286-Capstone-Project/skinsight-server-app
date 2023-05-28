import * as tf from '@tensorflow/tfjs-node';


export const predict = async (req, res) => {
	// Reference : https://github.com/tensorflow/tfjs/issues/1432#issuecomment-475425261
	const model = await tf.loadLayersModel(
		'http://127.0.0.1:8000/saved_model/model.json'
	);	
	
	// request image file from client	
	const image = req.file.buffer;
	
	const result = tf.tidy(() => {
		// load image into tensor
		const tensor = tf.node.decodeImage(image);
		// make prediction with input resize to 150x150
		const predictions = model.predict(tensor.resizeBilinear([150, 150]).expandDims(0));

		// Convert predictions to probabilities and class names.
		const predictionClass = Array.from(predictions.dataSync());
		const probabilities = predictionClass.map((pb, index) => {		
			return {
				class: index+1,
				probability: pb,
			}			
		}).filter((data) => data.probability > 0.8);

		return probabilities;
	})

	res.json({
		status: 'success',
		message: 'Prediction success',
		data: result,
	});
};
