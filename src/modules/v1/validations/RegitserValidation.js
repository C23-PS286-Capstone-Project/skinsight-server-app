import { body } from 'express-validator'

export const createValidation = [
    body('name').notEmpty().withMessage("Input cannot be empty"),
    body('gender').notEmpty().withMessage("Input cannot be empty"),
    body('birthday').notEmpty().withMessage("Input cannot be empty"),
    body('birthplace').notEmpty().withMessage("Input cannot be empty"),
    body('address').notEmpty().withMessage("Input cannot be empty"),
    body('email').notEmpty().withMessage("Input cannot be empty"),
    body('username').notEmpty().withMessage("Input cannot be empty"),
    body('password').notEmpty().withMessage("Input cannot be empty"),
]