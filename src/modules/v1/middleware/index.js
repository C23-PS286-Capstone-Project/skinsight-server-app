import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'

export const loadMiddleware = app => {
    app.use(helmet())

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.query())
    app.use(cors())
    app.use(morgan('dev'))
    // app.use(async (req, res, next) => {
    //     // await
    //     next()
    // })

    return app
}