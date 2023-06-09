import process from 'node:process'
import express from 'express'
import { loadMiddleware } from './middleware'
import { loadAuthRouter, loadUserRouter, loadModelRouter, loadHistoryRouter } from './routes'

export const APP_VERSION = 'v1'
const app = express()

loadMiddleware(app)

// if (process.env.NODE_ENV == 'development')

loadModelRouter(app)
loadAuthRouter(app)
loadUserRouter(app)
loadHistoryRouter(app)

export default app