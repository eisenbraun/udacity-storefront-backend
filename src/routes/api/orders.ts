import express, { Router, Request, Response } from 'express'
import { OrderStore, Order } from '../../models/order'
import dotenv from 'dotenv'
import jwt, { Secret } from 'jsonwebtoken'


dotenv.config()

const tokenSecret: Secret = process.env.TOKEN_SECRET as Secret

const store = new OrderStore()

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

export default orders