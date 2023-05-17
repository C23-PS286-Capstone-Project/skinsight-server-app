import { verify } from "jsonwebtoken"

export default (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(403).json({
                status: 'fail',
                message: 'A valid token is required to access this route'
            })
        }

        const token = req.headers.authorization.split(' ')
        // console.log(token[0])
        const verifyJwt = verify(
            token[1],
            process.env.JWT_KEY,
            { algorithms: 'HS256' }
            )

        if (token[0] != 'Bearer' || !verifyJwt) return res.status(403).json({
            status: 'fail',
            message: 'Invalid token'
        })

        next()
    } catch (error) {
        return res.status(403).json({
            status: 'fail',
            message: error.message
        })
    }
}