import express, { Router, Request, Response } from 'express'
import { UserStore, User } from '../../models/user'

const store = new UserStore()

const users = express.Router()

users.get('/', async (req: Request, res: Response) => {
  const result = await store.index()
  res.status(200).json(result)
})

users.get('/:id', async (req: Request, res: Response) => {
  const result = await store.show(req.params.id)
  res.status(200).json(result)
})

users.post('/', async (req: Request, res: Response) => {
  const result = await store.create({ first_name: req.body.first_name, last_name: req.body.last_name, password: req.body.password })
  res.status(201).json(result)
})

users.get('/:id/orders', async (req: Request, res: Response) => {
  const result = await store.show(req.params.id)
  res.status(200).json(result)
})

export default users