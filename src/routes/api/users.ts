import express, { Router, Request, Response } from 'express'
import { UserStore, User } from '../../models/user'
import dotenv from 'dotenv'
import jwt, { Secret } from 'jsonwebtoken'


dotenv.config()

const tokenSecret: Secret = process.env.TOKEN_SECRET as Secret

const store = new UserStore()
const users = express.Router()

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

users.get('/', verifyAuthToken, async (req: Request, res: Response) => {  
  try {
    const result = await store.index()
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json(error)
  }  
})

users.get('/:id', verifyAuthToken, async (req: Request, res: Response) => {
  try {
    const result = await store.show(req.params.id)
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json(error)
  }
})

users.post('/', verifyAuthToken, async (req: Request, res: Response) => {
  const user: User = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: req.body.password
  }
  
  try {
    const newUser = await store.create(user)
    const token = jwt.sign({ user: newUser }, tokenSecret)
    res.status(201).json(token)
  } catch (err) {
    res.status(400).json(`${err} ${user}`)
  }
})

users.post('/authenticate', async (req: Request, res: Response) => {
  const user: User = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: req.body.password,
  }
  try {
      const u = await store.authenticate(user)
      var token = jwt.sign({ user: u }, tokenSecret);
      res.status(200).json(token)
  } catch(error) {
      res.status(401).json({ error })
  }
})

export default users