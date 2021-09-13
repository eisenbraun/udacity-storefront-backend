import db from '../../database'
import dotenv from 'dotenv'
import supertest from 'supertest'
import app from '../../server'
import bcrypt from 'bcrypt'

import winston, { format } from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})


dotenv.config()

const {
  BCRYPT_PASSWORD,
  SALT_ROUNDS
} = process.env



const request = supertest(app)
let token: string;

describe('Test endpoint responses', () => {
  beforeAll(async () => {
    try {
      const conn = await db.connect()
      const password = 'Password123!'

      const hash = bcrypt.hashSync(
        password + BCRYPT_PASSWORD, parseInt(SALT_ROUNDS as string)
      )

      let sql:string = "INSERT INTO users (id, first_name, last_name, password) VALUES (1, 'John', 'Doe', ($1));"
      await conn.query(sql, [hash])

      sql = "INSERT INTO products (id, name, price) VALUES (1, 'Product 1', 12.99);"
      await conn.query(sql)

      sql = "INSERT INTO orders (id, user_id, status) VALUES (1, 1, 'active');"
      await conn.query(sql)

      // create order_product
      sql ="INSERT INTO order_products (quantity, product_id, order_id) VALUES (3, 1, 1);"
      await conn.query(sql)

    } catch (err) {
      throw new Error(`Could not add a new user. Error ${err}`)
    }
  })

  afterAll(async () => {
    try {
      const conn = await db.connect()

      let sql = 'DELETE FROM order_products'
      await conn.query(sql)

      sql = 'DELETE FROM orders'
      await conn.query(sql)
      
      sql = 'DELETE FROM products'
      await conn.query(sql)

      sql = 'DELETE FROM users'
      await conn.query(sql)

    } catch (err) {
      throw new Error(`Could not delete tables. Error ${err}`)
    }
  })

  it('response from the /api endpoint should be 404', async () => {
    const response = await request.get('/api')
    expect(response.status).toBe(404)
  })

  describe('Testing products endpoints', () => {
    it('response from the /api/products endpoint should be 200', async () => {
      const response = await request.get('/api/products')
      expect(response.status).toBe(200)
    })
  
    it('response from the /api/products endpoint should return json', async () => {
      const response = await request.get('/api/products')
      expect(response.body).toEqual([{
        "id": 1,
        "name": "Product 1",
        "price": "12.99"
      }])
    })
  
    it('response from the /api/products/1 endpoint should be 200', async () => {
      const response = await request.get('/api/products/1')
      expect(response.status).toBe(200)
    })
  
    it('response from the /api/products/1 endpoint should return json', async () => {
      const response = await request.get('/api/products/1')
      expect(response.body).toEqual({
        "id": 1,
        "name": "Product 1",
        "price": "12.99"
      })
    })

    it('response from the /api/products POST endpoint should be 401', async () => {
      const response = await request.post('/api/products')
        .send({
          name: 'Product 2',
          price: 15.99
        })
      expect(response.status).toBe(401)
    })  
  
    it('response from the /api/users/authenticate POST endpoint should be 200', async () => {
      const response = await request.post('/api/users/authenticate')
        .send({
          first_name: 'John',
          last_name: 'Doe',
          password: 'Password123!'
        })
      expect(response.status).toBe(200)
      token = response.body as string
    })

    it('response from the /api/products POST endpoint should be 201', async () => {
      const response = await request.post('/api/products')
        .set('Content-type', 'application/json')
        .set('authorization', token)
        .send({
          name: 'Product 2',
          price: 15.99
        })
      expect(response.status).toBe(201)
    })  
  })

  describe('Testing users endpoints', () => {
    it('response from the /api/users endpoint should be 401', async () => {
      const response = await request.get('/api/users')
      expect(response.status).toBe(401)
    })

    it('response from the /api/users/1 endpoint should be 401', async () => {
      const response = await request.get('/api/users/1')
      expect(response.status).toBe(401)
    })

    it('response from the /api/users POST endpoint should be 401', async () => {
      const response = await request.post('/api/users')
        .send({
          first_name: 'Dick',
          last_name: 'Tracy',
          password: 'Password123!'
        })
      expect(response.status).toBe(401)
    })

    it('response from the /api/users/authenticate POST endpoint should be 200', async () => {
      const response = await request.post('/api/users/authenticate')
        .send({
          first_name: 'John',
          last_name: 'Doe',
          password: 'Password123!'
        })
      expect(response.status).toBe(200)
      token = response.body as string
    })

    it('response from the /api/users endpoint should be 200', async () => {
      const response = await request.get('/api/users')
        .set('Content-type', 'application/json')
        .set('authorization', token)
      expect(response.status).toBe(200)
    })

    it('response from the /api/users endpoint should return json', async () => {
      const response = await request.get('/api/users')
        .set('Content-type', 'application/json')
        .set('authorization', token)
      expect(response.body.length).toEqual(1)
    })

    it('response from the /api/users POST endpoint should be 201', async () => {
      const response = await request.post('/api/users')
        .set('Content-type', 'application/json')
        .set('authorization', token)
        .send({
          first_name: 'Dick',
          last_name: 'Tracy',
          password: 'Password123!'
        })
        
      expect(response.status).toBe(201)
    })

    it('response from the /api/users/1 endpoint should be 200', async () => {
      const response = await request.get('/api/users/1')
        .set('Content-type', 'application/json')
        .set('authorization', token)
      expect(response.status).toBe(200)
    })

    it('response from the /api/users/1 endpoint should return json', async () => {
      const response = await request.get('/api/users/1')
        .set('Content-type', 'application/json')
        .set('authorization', token)
      expect(response.body.first_name).toEqual('John')
    })
  })

  describe('Tesing orders endpoints', () => {
    it('response from the /api/orders/active/users/1 endpoint should be 200', async () => {
      const response = await request.get('/api/orders/active/users/1')
      expect(response.status).toBe(401)
    })

    it('response from the /api/users/authenticate POST endpoint should be 200', async () => {
      const response = await request.post('/api/users/authenticate')
        .send({
          first_name: 'John',
          last_name: 'Doe',
          password: 'Password123!'
        })
      expect(response.status).toBe(200)
      token = response.body as string
    })

    it('response from the /api/orders/active/users/1 endpoint should be 200', async () => {
      const response = await request.get('/api/orders/active/users/1')
        .set('Content-type', 'application/json')
        .set('authorization', token)
      
      expect(response.status).toBe(200)
        
    })

    it('response from the /api/orders/active/users/1 endpoint should return json', async () => {
      const response = await request.get('/api/orders/active/users/1')
        .set('Content-type', 'application/json')
        .set('authorization', token)
      expect(response.body).toEqual([{
        name: 'Product 1',
        price: '12.99',
        quantity: 3
      }])
    })
  })

})
