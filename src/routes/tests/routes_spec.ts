import db from '../../database'
import supertest from 'supertest'
import app from '../../server'

const request = supertest(app)

describe('Test endpoint responses', () => {
  beforeAll(async () => {
    try {
      const conn = await db.connect()
      let sql:string = "INSERT INTO users (id, first_name, last_name, password) VALUES (1, 'John', 'Doe', 'Password123!');"
      await conn.query(sql)

      sql = "INSERT INTO products (id, name, price) VALUES (1, 'Product 1', 12.99);"
      await conn.query(sql)

      sql = "INSERT INTO orders (id, user_id, status) VALUES (1, 1, 'active');"
      await conn.query(sql)

    } catch (err) {
      throw new Error(`Could not add a new user. Error ${err}`)
    }
  })

  afterAll(async () => {
    try {
      const conn = await db.connect()

      let sql = 'DELETE FROM orders'
      await conn.query(sql)
      
      sql = 'DELETE FROM products'
      await conn.query(sql)

      sql = 'DELETE FROM users'
      await conn.query(sql)

    } catch (err) {
      throw new Error(`Could not add a new user. Error ${err}`)
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
  
    it('response from the /api/products POST endpoint should be 201', async () => {
      const response = await request.post('/api/products')
      expect(response.status).toBe(201)
    })  
  })

  describe('Testing users endpoints', () => {
    it('response from the /api/users endpoint should be 200', async () => {
      const response = await request.get('/api/users')
      expect(response.status).toBe(200)
    })

    it('response from the /api/users endpoint should return json', async () => {
      const response = await request.get('/api/users')
      expect(response.body.length).toEqual(1)
    })

    it('response from the /api/users/1 endpoint should be 200', async () => {
      const response = await request.get('/api/users/1')
      expect(response.status).toBe(200)
    })

    it('response from the /api/users/1 endpoint should return json', async () => {
      const response = await request.get('/api/users/1')
      expect(response.body.first_name).toEqual('John')
    })

    it('response from the /api/users POST endpoint should be 201', async () => {
      const response = await request.post('/api/users')
      expect(response.status).toBe(201)
    })
  })

  describe('Tesing orders endpoints', () => {
    it('response from the /api/orders/active/users/1 endpoint should be 200', async () => {
      const response = await request.get('/api/orders/active/users/1')
      expect(response.status).toBe(200)
    })

    it('response from the /api/orders/active/users/1 endpoint should return json', async () => {
      const response = await request.get('/api/orders/active/users/1')
      expect(response.body).toEqual({
        "id": 1,
        "user_id": 1,
        "status": "active"
      })
    })
  })

})
