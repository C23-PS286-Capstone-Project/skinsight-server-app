import { validationResult } from "express-validator"
// const {Storage} = require('@google-cloud/storage')
// const fs = require('fs')
// const path = require('path')
// const dateFormat = require('dateformat')

// const pathKey = path.resolve('../../serviceaccountkey.json')

export const validateForm = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(422).json({
            message: 'Validation error',
            errors: errors.array()
        })
        return false
    }

    return true
}

// const gcs = new Storage({
//     projectId: '',
//     keyFilename: pathKey
// })

// const bucketName = ''
// const bucket = gcs.bucket(bucketName)

// function getPublicUrl(filename) {
//     return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
// }

// export const uploadToGcs = (req, res, next) => {
//     if (!req.file) return next()

//     const gcsname = dateFormat(new Date(), "yyyymmdd-HHMMss")
//     const file = bucket.file(gcsname)

//     const stream = file.createWriteStream({
//         metadata: {
//             contentType: req.file.mimetype
//         }
//     })

//     stream.on('error', (err) => {
//         req.file.cloudStorageError = err
//         next(err)
//     })

//     stream.on('finish', () => {
//         req.file.cloudStorageObject = gcsname
//         req.file.cloudStoragePublicUrl = getPublicUrl(gcsname)
//         next()
//     })

//     stream.end(req.file.buffer)
// }