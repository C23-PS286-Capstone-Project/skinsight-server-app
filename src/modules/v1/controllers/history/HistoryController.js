import { PrismaClient } from "@prisma/client"
// import { uploadToGcs } from "../../../../utils/helper"
import { decode } from "jsonwebtoken"
import { validateForm } from "../../../../utils/helper"
const { Storage } = require('@google-cloud/storage')
// const dateFormat = require('dateformat')
const path = require('path')

const prisma = new PrismaClient()
const pathKey = path.resolve('./../../serviceaccountkey.json')

const gcs = new Storage({
    projectId: 'cryptic-opus-381211',
    keyFilename: pathKey
})

const bucketName = 'skinsight-app-bucket'
const bucket = gcs.bucket(bucketName)

function getPublicUrl(fileName) {
    return 'https://storage.googleapis.com/' + bucketName + '/' + fileName
}

export const createHistory = async (req, res, next) => {
    const { id: userId } = decode(req.headers.authorization.split(' ')[1])

    const { prediction_age, prediction_result } = req.body
    let imageUrl = ''

    // if (req.file && req.file.cloudStoragePublicUrl) {
    //     imageUrl = req.file.cloudStoragePublicUrl
    // }

    
    try {
        if (validateForm(req, res)) {
            if (req.file) {
                // const gcsname = dateFormat(new Date(), "yyyymmdd-HHMMss")
                // const file = bucket.file(gcsname)
                // const stream = file.createWriteStream({
                //     metadata: {
                //         contentType: req.file.mimetype
                //     }
                // })
            
                // stream.on('error', (err) => {
                //     req.file.cloudStorageError = err
                //     next(err)
                // })
            
                // stream.on('finish', () => {
                //     req.file.cloudStorageObject = gcsname
                //     req.file.cloudStoragePublicUrl = getPublicUrl(gcsname)
                //     next()
                // })
            
                // stream.end(req.file.buffer)
                // imageUrl = req.file.cloudStoragePublicUrl
            }
    
            const history = await prisma.history.create({
                data: {
                    user_id: userId,
                    prediction_age: prediction_age,
                    prediction_result: prediction_result,
                    // date: date,
                    image: imageUrl ?? null
                }
            })
    
            res.status(201).json({
                status: 'success',
                message: 'Successfully created history',
                data: history
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Unknown error'
        })
    }


}