import { OrderStore } from '../order'
import { UserStore } from '../user'

const orderStore = new OrderStore()
const userStore = new UserStore()

describe('Order Model', () => {
  beforeAll(async () => {
    await userStore.create({
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      password: 'password123'
    })
  })

  afterAll(async () => {
    await orderStore.delete(1)
    await userStore.delete(1)
  })

  it('should have a show method', () => {
    expect(orderStore.show).toBeDefined()
  })

  it('should have a create method', () => {
    expect(orderStore.create).toBeDefined()
  })

  it('create method should add a order', async () => {
    const result = await orderStore.create(1)
    expect(result).toEqual({
      id: 1,
      status: 'active',
      user_id: 1
    })
  })

  it('show method should return the correct order', async () => {
    const result = await orderStore.show(1)
    expect(result).toEqual({
      id: 1,
      status: 'active',
      user_id: 1
    })
  })
})
