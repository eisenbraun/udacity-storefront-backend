import db from '../../database'
import { UserStore } from '../user'

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

  it('create method should add a user', async () => {
    const result = await store.create({
      first_name: 'Jane',
      last_name: 'Doe',
      password: 'password123'
    })
    expect(result).toEqual({
      id: 1,
      first_name: 'Jane',
      last_name: 'Doe',
      password: 'password123'
    })
  })

  it('index method should return a list of users', async () => {
    const result = await store.index()
    expect(result).toEqual([{
      id: 1,
      first_name: 'Jane',
      last_name: 'Doe',
      password: 'password123'
    }])
  })

  it('show method should return the correct user', async () => {
    const result = await store.show(1)
    expect(result).toEqual({
      id: 1,
      first_name: 'Jane',
      last_name: 'Doe',
      password: 'password123'
    })
  })
})
