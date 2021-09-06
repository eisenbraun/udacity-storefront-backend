import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import winston, { format } from 'winston'
import routes from './routes'

import db from './database' // @ts-ignore

const logger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

const app = express()
const port = 3000

app.use(bodyParser.json())

app.use('/api', routes)

app.listen(port, async () => {
  logger.info(`server started at http://localhost:${port}`)

  try {
    const conn = await db.connect()
    logger.info('DB connected')
    conn.release()
  } catch (err) {
    logger.error(`Error: ${err}`)
  }
})

export default app
