import db from '../database' // @ts-ignore

export type User = {
  id?: number | string;
  first_name: string;
  last_name: string;
  password: string;
}

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await db.connect()
      const sql = 'SELECT * FROM users;'
      const result = await conn.query(sql)
      const users = result.rows
      conn.release()
      
      return users
    } catch (err) {
      throw new Error(`Could not get users. Error ${err}`)
    }
  } 

  async show(id: number | string): Promise<User> {
    try {
      const conn = await db.connect()
      const sql = 'SELECT * FROM users WHERE id=($1);'
      const result = await conn.query(sql, [id])
      const user = result.rows[0]
      conn.release()
      
      return user
    } catch (err) {
      throw new Error(`Could not find user. Error ${err}`)
    }
  } 

  async create(u: User): Promise<User> {
    try {
      const conn = await db.connect()
      const sql = "INSERT INTO users (first_name, last_name, password) VALUES ($1, $2, $3) RETURNING *;"
      const values =[u.first_name, u.last_name, u.password]
      const result = await conn.query(sql, values)
      const user = result.rows[0]

      conn.release()
      
      return user
    } catch (err) {
      throw new Error(`Could not add a new user. Error ${err}`)
    }
  } 

  async delete(id: number | string): Promise<User> {
    try {
      const conn = await db.connect()
      const sql = 'DELETE FROM users WHERE id=($1);'
      const result = await conn.query(sql, [id])
      conn.release()
      
      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not delete user. Error ${err}`)
    }
  } 
}