import * as tf from "@tensorflow/tfjs-node";
import { PrismaClient } from "@prisma/client"
import { decode } from "jsonwebtoken"
import { Storage } from "@google-cloud/storage"
import dateFormat from "dateformat"
// import { resolve } from "path"
import { resolve } from "path"

const prisma = new PrismaClient()
const pathKey = resolve('./serviceaccountkey.json')

const gcs = new Storage({
    projectId: 'project id in here',
    keyFilename: pathKey
})

const bucketName = 'bucket name in here'
const bucket = gcs.bucket(bucketName)

function getPublicUrl(fileName) {
    return 'https://storage.googleapis.com/' + bucketName + '/' + fileName
}

export const predict = async (req, res) => {
  const { id: userId } = decode(req.headers.authorization.split(' ')[1])

  // Reference : https://github.com/tensorflow/tfjs/issues/1432#issuecomment-475425261
  const model = await tf.loadLayersModel(
    "http://127.0.0.1:8000/saved_model/model.json"
  );

  // request image file from client
  const image = req.file.buffer;

  const result = tf.tidy(() => {
    // load image into tensor
    const tensor = tf.node.decodeImage(image);
    // make prediction with input resize to 192x192
    const predictions = model.predict(
      tensor.resizeBilinear([192, 192]).expandDims(0)
    );

    // Convert predictions to probabilities and class names.
    const predictionClass = Array.from(predictions.dataSync());
    const probabilities = predictionClass
      .map((pb, index) => {
        return {
          class: index + 1,
          probability: pb,
        };
      })
      .filter((data) => data.probability > 0.8);

    return probabilities;
  });

  const gcsname = dateFormat(new Date(), "yyyymmdd-HHMMss")
  const file = bucket.file(gcsname)
  const stream = file.createWriteStream({
      metadata: {
          contentType: req.file.mimetype
      }
  })

  stream.on('error', (err) => {
      req.file.cloudStorageError = err
      // next(err)
  })

  stream.on('finish', () => {
      req.file.cloudStorageObject = gcsname
      req.file.cloudStoragePublicUrl = getPublicUrl(gcsname)
      // next()
  })
  
  stream.end(req.file.buffer)

  const history = await prisma.history.create({
      data: {
          user_id: userId,
          prediction_age: 22, // Change it
          prediction_result: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia repudiandae ratione, molestias ad omnis doloremque aut numquam cum aliquid magni iure consectetur laborum ipsam et exercitationem voluptate provident quae beatae.', // Change it
          // date: date,
          image: getPublicUrl(gcsname)
      }
  })

  res.json({
    status: "success",
    message: "Prediction success",
    data: history,
  });
};