import process from 'node:process'
import express from 'express'
import { loadMiddleware } from './middleware'
import { loadAuthRouter } from './routes'

export const APP_VERSION = 'v1'
const app = express()

loadMiddleware(app)

// if (process.env.NODE_ENV == 'development')

loadAuthRouter(app)

export default app