import { body } from 'express-validator'

export const updateValidation = [
    body('name').notEmpty().withMessage("Input cannot be empty"),
    body('gender').notEmpty().withMessage("Input cannot be empty"),
    body('birthday').notEmpty().withMessage("Input cannot be empty"),
    body('birthplace').notEmpty().withMessage("Input cannot be empty"),
    body('address').notEmpty().withMessage("Input cannot be empty"),
]