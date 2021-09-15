import db from '../database' // @ts-ignore
import { QueryResult } from 'pg'

export type Order = {
  id: number | string;
  status: string;
  user_id: number | string;
}

export type Order_products = {
  id: number | string;
  quantity: number;
  product_id: number;
  order_id: number;
}

export class OrderStore {
  async show(user_id: number | string, status: string) {
    try {
      const conn = await db.connect()
      let sql = "SELECT * FROM orders WHERE status = ($2) AND user_id = ($1);"
      const result = await conn.query(sql, [user_id, status])
      const order = result.rows[0]

      sql = "SELECT name, price, count(*) AS quantity FROM order_products JOIN products ON products.id = order_products.product_id WHERE order_id = ($1) GROUP BY products.name, products.price;"
      const products = await conn.query(sql, [order.id])
  
      conn.release()
      
      return products.rows
    } catch (err) {
      throw new Error(`Could not find order. Error ${err}`)
    }
  } 

  async create(user_id: number | string): Promise<Order> {
    try {
      const conn = await db.connect()
      const sql = "INSERT INTO orders (status, user_id) VALUES ('active', $1) RETURNING *;"
      const result = await conn.query(sql, [user_id])
      const order = result.rows[0]

      conn.release()
      
      return order
    } catch (err) {
      throw new Error(`Could not add a new order. Error ${err}`)
    }
  } 

  async delete(id: number | string): Promise<Order> {
    try {
      const conn = await db.connect()
      const sql = 'DELETE FROM orders WHERE id=($1);'
      const result = await conn.query(sql, [id])
      conn.release()
      
      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not delete order. Error ${err}`)
    }
  } 
}