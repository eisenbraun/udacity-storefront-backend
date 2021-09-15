import express, { Router, Request, Response } from 'express'
import { OrderStore } from '../../models/order'
import { OrderProductStore } from '../../models/order_product'
import dotenv from 'dotenv'
import jwt, { Secret } from 'jsonwebtoken'


dotenv.config()

const tokenSecret: Secret = process.env.TOKEN_SECRET as Secret

const store = new OrderStore()
const orderProductStore = new OrderProductStore()

const orders = express.Router()

const verifyAuthToken = async (req: Request, res: Response, next: () => void) => {
  try {
    const token = req.headers.authorization as string
    jwt.verify(token, tokenSecret)
    next()
  } catch (error) {
    res.status(401).json('Access denied, invalid token')
    return
  }  
}


orders.get('/', async (req: Request, res: Response) => {
  res.status(401)
})

orders.get('/:status/users/:id', verifyAuthToken, async (req: Request, res: Response) => {
  try {
    const result = await store.show(req.params.id, req.params.status)
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json(error)
  }
  
})

orders.get('/:status/users/:user_id/products/:product_id', verifyAuthToken, async (req: Request, res: Response) => {
  try {
    const result = await orderProductStore.create(req.params.user_id, req.params.status, req.params.product_id)
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default orders