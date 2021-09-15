import db from '../database' // @ts-ignore

export type Order = {
  id: number | string;
  status: string;
  user_id: number | string;
}

export type Order_products = {
  id: number | string;
  product_id: number;
  order_id: number;
}

export class OrderProductStore {
  async create(user_id: number | string, status: string, product_id: number | string): Promise<Order_products> {
    try {
      const conn = await db.connect()
      let sql = "SELECT * FROM orders WHERE status = ($2) AND user_id = ($1);"
      let result = await conn.query(sql, [user_id, status])
      const order = result.rows[0]

      sql = "INSERT INTO order_products (product_id, order_id) VALUES ($1, $2) RETURNING *;"
      result = await conn.query(sql, [product_id, order.id])
      const order_product = result.rows[0]

      conn.release()
      
      return order_product
    } catch (err) {
      throw new Error(`Could not add a new order. Error ${err}`)
    }
  } 

  async delete(user_id: number | string, status: string, product_id: number | string): Promise<Order_products> {
    try {
      const conn = await db.connect()
      
      let sql = "SELECT * FROM orders WHERE status = ($2) AND user_id = ($1);"
      let result = await conn.query(sql, [user_id, status])
      const order = result.rows[0]
      
      sql = 'DELETE FROM order_products WHERE order_id=($1) AND product_id=($2) RETURNING *;'
      result = await conn.query(sql, [order.id, product_id])
      conn.release()
      
      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not delete order product. Error ${err}`)
    }
  } 
}