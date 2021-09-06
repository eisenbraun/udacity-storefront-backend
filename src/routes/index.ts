import express, { Router, Request, Response } from 'express'
import products from './api/products'
import users from './api/users'
import orders from './api/orders'

const routes = express.Router()

routes.get('/', (req: Request, res: Response) => {
  res.sendStatus(404)
})

routes.use('/products', products)
routes.use('/users', users)
routes.use('/orders', orders)

export default routes