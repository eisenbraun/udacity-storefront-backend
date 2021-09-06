import express, { Router, Request, Response } from 'express'
import { OrderStore, Order } from '../../models/order'

const store = new OrderStore()

const orders = express.Router()

orders.get('/', async (req: Request, res: Response) => {
  res.status(401)
})

orders.get('/:status/users/:id', async (req: Request, res: Response) => {
  const result = await store.show(req.params.id, req.params.status)
  res.status(200).json(result)
})

export default orders