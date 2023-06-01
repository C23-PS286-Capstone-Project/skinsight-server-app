import { sign, decode } from 'jsonwebtoken'
import { PrismaClient } from "@prisma/client"
import { validateForm } from "../../../../utils/helper"
import e from 'cors'
import { error } from 'console'
const {Storage} = require('@google-cloud/storage')
const fs = require('fs')
const path = require('path')
const dateFormat = require('dateformat')

const pathKey = path.resolve('./serviceaccountkey.json')

const prisma = new PrismaClient()

const gcs = new Storage({
    projectId: '',
    keyFilename: pathKey
})

const bucketName = ''
const bucket = gcs.bucket(bucketName)

function getPublicUrl(filename) {
    return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
}

// export const imgUpload = async (req, res, next) => {
//     if (!req.file) return next()


// }

export const updateUser = async (req, res, next) => {
    const { id: userId } = decode(req.headers.authorization.split(' ')[1])

    const {name, gender, birthday, birthplace, address, email} = req.body;

    try {
        if (validateForm(req, res)) {
            if (!req.file) {
                const user = await prisma.user.update({
                    where: {
                        id: Number(userId)
                    },
                    data: {
                        name: name,
                        gender: gender,
                        birthday: birthday,
                        birthplace: birthplace,
                        address: address,
                        email: email, 
                        // username: username, 
                        // password: password, 
                        // picture: picture
                    }
                });
            } else {
                const gcsname = 'User_' + dateFormat(new Date(), "yyyymmdd-HHMMss")
                const file = bucket.file(gcsname)

                const stream = file.createWriteStream({
                    metadata: {
                        contentType: req.file.mimetype
                    }
                })

                stream.on('error', (error) => {
                    req.file.cloudStorageError = error
                    next(error)
                })

                stream.on('finish', () => {
                    req.file.cloudStorageObject = gcsname
                    req.file.cloudStoragePublicUrl = getPublicUrl(gcsname)
                    next()
                })

                stream.end(req.file.buffer)

                const user = await prisma.user.update({
                    where: {
                        id: Number(userId)
                    },
                    data: {
                        name: name,
                        gender: gender,
                        birthday: birthday,
                        birthplace: birthplace,
                        address: address,
                        email: email, 
                        // username: username, 
                        // password: password, 
                        picture: gcsname
                    }
                });
            }
            res.status(200).json({
                status: 'success',
                message: 'Successfully updated user',
                data: user
            });
        }
    } catch (error){
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}