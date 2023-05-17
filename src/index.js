import path from 'node:path'
import http from 'node:http'
import express from 'express'
import app1, { APP_VERSION as app1Version } from './modules/v1/app'

const loaded = {
    [app1Version]: app1
}

const PORT = process.env.PORT || 8000
const server = express()

server.use(express.static(path.join(__dirname, '...', 'public')))

const notFoundHandler = (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `Route ${req.originalUrl} with request method ${req.method} not found`
    })
}
startServer()
function startServer() {
    console.log('Starting server...\n')

    for (const l in loaded) {
        server.use(`/api/${l}`, loaded[l])
        console.log(`=== Application loaded : ${l} ===`)
    }

    server.use('*', notFoundHandler)

    const httpServer = http.createServer(server)

    httpServer.listen(PORT, () => console.log(`\nServer listening on ${PORT}`))
}