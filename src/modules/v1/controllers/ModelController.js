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
    projectId: 'cryptic-opus-381211',
    keyFilename: pathKey
})

const bucketName = 'skinsight-app-bucket'
const bucket = gcs.bucket(bucketName)

function getPublicUrl(fileName) {
    return 'https://storage.googleapis.com/' + bucketName + '/' + fileName
}

export const predict = async (req, res) => {
  const { id: userId } = decode(req.headers.authorization.split(' ')[1])

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })

  // Reference : https://github.com/tensorflow/tfjs/issues/1432#issuecomment-475425261
  const model = await tf.loadLayersModel(
    `${process.env.BASE_URL}/saved_model/model.json`
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
    const classes = [
      "0-3",
      "4-6",
      "8-14",
      "15-23",
      "24-35",
      "36-46",
      "47-59",
      "60-100",
    ]

    const predictionClass = Array.from(predictions.dataSync());
    const probabilities = predictionClass
      .map((pb, index) => {
        return {
          class: classes[index],
          probability: pb,
        };
      })      

    return probabilities;
  });  

  console.log(result)

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

  const splitPredictRange = result[0].class.split('-')
  const userBirthday = new Date(user.birthday)
  const userYear = userBirthday.getFullYear()  
  const userAge = new Date().getFullYear() - userYear

  let resultDecision = ""
  if(userAge >= parseInt(splitPredictRange[0]) && userAge <= parseInt(splitPredictRange[1])) {
    resultDecision = "Tidak mengalami penuaan dini"
  } else {
    resultDecision = "Mengalami penuaan dini"
  }

  history = {
    user_id: userId,
    image: getPublicUrl(gcsname),
    prediction_score: parseFloat(result[0].probability.toString()),
    prediction_age: result[0].class, 
    prediction_result: resultDecision,
    date: new Date()
  }

  console.log(history)

  await prisma.history.create({
      data: history
  })

  res.json({
    status: "success",
    message: "Prediction success",
    data: history,
  });
};