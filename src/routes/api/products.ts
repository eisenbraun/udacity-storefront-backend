import express, { Router, Request, Response } from 'express'
import { ProductStore, Product } from '../../models/product'

const store = new ProductStore()

const products = express.Router()

products.get('/', async (req: Request, res: Response) => {
  const result = await store.index()
  res.status(200).json(result)
})

products.get('/:id', async (req: Request, res: Response) => {
  const result = await store.show(req.params.id)
  res.status(200).json(result)
})

products.post('/', async (req: Request, res: Response) => {
  const result = await store.create({ name: req.body.name, price: req.body.price})
  res.status(201).json(result)
})

export default products