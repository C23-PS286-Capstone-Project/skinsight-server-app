import { body } from 'express-validator'

export const createValidation = [
    body('prediction_age').notEmpty().withMessage("Input cannot be empty"),
    body('prediction_result').notEmpty().withMessage("Input cannot be empty"),
]