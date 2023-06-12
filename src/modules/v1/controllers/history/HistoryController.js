import { PrismaClient } from "@prisma/client"
import { decode } from "jsonwebtoken"

const prisma = new PrismaClient()

export const getHistory = async (req, res) => {
    const { id: userId } = decode(req.headers.authorization.split(' ')[1])

    const histories = await prisma.history.findMany({
        where: {
            user_id: userId
        }
    })

    res.json({
        status: 'success',
        data: histories
    })
}
