import { PrismaClient } from "@prisma/client"
import { uploadToGcs } from "../../../../utils/helper"
import { decode } from "jsonwebtoken"

const prisma = new PrismaClient()

export const store = async (req, res, next) => {
    const { id: userId } = decode(req.headers.authorization.split(' ')[1])

    const { prediction_age, prediction_result, date } = req.body
    let imageUrl = ''

    if (req.file && req.file.cloudStoragePublicUrl) {
        imageUrl = req.file.cloudStoragePublicUrl
    }

    try {
        const history = await prisma.history.create({
            data: {
                user_id: userId,
                prediction_age: prediction_age,
                prediction_result: prediction_result,
                date: date,
                image: imageUrl
            }
        })

        res.status(201).json({
            status: 'success',
            message: 'Successfully created history',
            data: history
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Unknown error'
        })
    }


}