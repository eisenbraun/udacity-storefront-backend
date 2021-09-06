import db from '../../database'
import { UserStore } from '../user'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config()

const {
  BCRYPT_PASSWORD,
  SALT_ROUNDS
} = process.env

const store = new UserStore()

describe('User Model', () => {
  afterAll(async () => {
    try {
      const conn = await db.connect()

      const sql = 'DELETE FROM users'
      await conn.query(sql)
    } catch (err) {
      throw new Error(`Could not remove users. Error ${err}`)
    }
  })

  it('should have an index method', () => {
    expect(store.index).toBeDefined()
  })

  it('should have a show method', () => {
    expect(store.show).toBeDefined()
  })

  it('should have a create method', () => {
    expect(store.create).toBeDefined()
  })

  it('create method should add a user and return first name', async () => {
    const result = await store.create({
      first_name: 'John',
      last_name: 'Doe',
      password: 'Password123!'
    })
    expect(result.first_name).toEqual('John')
  })

  it('create method should add a user and return hashed password', async () => {
    const result = await store.create({
      first_name: 'Jane',
      last_name: 'Doe',
      password: 'Password123!'
    })
    expect(bcrypt.compareSync('Password123!'+BCRYPT_PASSWORD, result.password)).toBeTrue()
  })

  it('index method should return a list of users', async () => {
    const result = await store.index()
    expect(result.length).toEqual(2)
  })

  it('show method should return the correct user', async () => {
    const result = await store.show(2)
    expect(result.first_name).toEqual('Jane')
  })
})
