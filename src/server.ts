import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import db from './database' // @ts-ignore

const app: express.Application = express()
const address: string = "0.0.0.0:3000"

app.use(bodyParser.json())

app.get('/', async function (req: Request, res: Response) {
    try {
        const conn = await db.connect()
        res.send('DB connected')
    } catch (err) {
        res.send(`Error: ${err}`)
    }
})

app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
})
