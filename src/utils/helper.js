import { validationResult } from "express-validator"

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