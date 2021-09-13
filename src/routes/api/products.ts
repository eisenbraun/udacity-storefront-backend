import express, { Router, Request, Response } from 'express'
import { ProductStore, Product } from '../../models/product'
import dotenv from 'dotenv'
import jwt, { Secret } from 'jsonwebtoken'


dotenv.config()

const tokenSecret: Secret = process.env.TOKEN_SECRET as Secret
const store = new ProductStore()

const products = express.Router()

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

products.get('/', async (req: Request, res: Response) => {
  try {
    const result = await store.index()
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json(error)
  }
  
})

products.get('/:id', async (req: Request, res: Response) => {
  try {
    const result = await store.show(req.params.id)
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json(error)
  }
})

products.post('/', verifyAuthToken, async (req: Request, res: Response) => {
  try {
    const result = await store.create({ name: req.body.name, price: req.body.price})
    res.status(201).json(result)
  } catch (error) {
    res.status(400).json(error)
  }  
})

export default products