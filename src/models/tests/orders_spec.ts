import db from '../../database'
import { OrderStore } from '../order'

const store = new OrderStore()

describe('Order Model', () => {
  beforeAll(async () => {
    try {
      const conn = await db.connect()
      const sql = "INSERT INTO users (id, first_name, last_name, password) VALUES (1, 'John', 'Doe', 'Password123');"
      await conn.query(sql)
    } catch (err) {
      throw new Error(`Could not add a new user. Error ${err}`)
    }
  })

  afterAll(async () => {
    try {
      const conn = await db.connect()

      let sql:string = 'DELETE FROM orders'
      await conn.query(sql)
      
      sql = 'DELETE FROM users'
      await conn.query(sql)
    } catch (err) {
      throw new Error(`Could not add a new user. Error ${err}`)
    }
  })

  it('should have a show method', () => {
    expect(store.show).toBeDefined()
  })

  it('should have a create method', () => {
    expect(store.create).toBeDefined()
  })

  it('create method should add a order', async () => {
    const result = await store.create(1)
    expect(result).toEqual({
      id: 1,
      status: 'active',
      user_id: 1
    })
  })

  it('show method should return the correct order', async () => {
    const result = await store.show(1)
    expect(result).toEqual({
      id: 1,
      status: 'active',
      user_id: 1
    })
  })
})
