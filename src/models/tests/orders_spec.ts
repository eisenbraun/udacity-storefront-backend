import db from '../../database'
import { OrderStore } from '../order'

const store = new OrderStore()

describe('Order Model', () => {
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

      // create order_product
      sql ="INSERT INTO order_products (quantity, product_id, order_id) VALUES (3, 3, 1);"
      await conn.query(sql)
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

  it('should have a show method', () => {
    expect(store.show).toBeDefined()
  })

  it('should have a create method', () => {
    expect(store.create).toBeDefined()
  })

  // it('create method should add a order', async () => {
  //   const result = await store.create(1)
  //   expect(result).toEqual({
  //     id: 1,
  //     status: 'active',
  //     user_id: 1
  //   })
  // })

  it('show method should return the correct order', async () => {
    const result = await store.show(1, 'active')
    expect(result).toEqual([{
      name: 'Product 3',
      price: '12.99',
      quantity: 3
    }])
  })
})
