import db from '../../database'
import { OrderProductStore } from '../order_product'

const store = new OrderProductStore()

describe('Order Product Model', () => {
  beforeAll(async () => {
    try {
      const conn = await db.connect()
      
      // create user
      let sql = "INSERT INTO users (id, first_name, last_name, password) VALUES (1, 'John', 'Doe', 'Password123');"
      await conn.query(sql)

      // create product
      sql = "INSERT INTO products (id, name, price) VALUES (3, 'Product 3', 12.99);"
      await conn.query(sql)

      // create order
      sql = "INSERT INTO orders (id, status, user_id) VALUES(1, 'active', 1);"
      await conn.query(sql)

      // // create order_product
      // sql ="INSERT INTO order_products (product_id, order_id) VALUES (3, 1);"
      // await conn.query(sql)
    } catch (err) {
      throw new Error(`Could not add a new user. Error ${err}`)
    }
  })

  afterAll(async () => {
    try {
      const conn = await db.connect()

      let sql:string = 'DELETE FROM order_products'
      await conn.query(sql)
      
      sql = 'DELETE FROM orders'
      await conn.query(sql)

      sql = 'DELETE FROM products'
      await conn.query(sql)

      sql = 'DELETE FROM users'
      await conn.query(sql)

    } catch (err) {
      throw new Error(`Could not remove orders and users. Error ${err}`)
    }
  })

  it('should have a create method', () => {
    expect(store.create).toBeDefined()
  })

  it('should have a create method', () => {
    expect(store.delete).toBeDefined()
  })

  it('create method should add a new order product', async () => {
    const result = await store.create(1, 'active', 3)
    expect(result).toEqual({
      id: 1,
      order_id: 1,
      product_id: 3
    })
  })

  it('delete method should remove an order product', async () => {
    const result = await store.delete(1, 'active', 3)
    expect(result).toEqual({
      id: 1,
      order_id: 1,
      product_id: 3
    })
  })
})
