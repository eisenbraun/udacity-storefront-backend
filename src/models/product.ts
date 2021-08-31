import db from '../database' // @ts-ignore

export type Product = {
  id: number | string;
  name: string;
  price: number | string;
}

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await db.connect()
      const sql = 'SELECT * FROM products;'
      const result = await conn.query(sql)
      const products = result.rows
      conn.release()
      
      return products
    } catch (err) {
      throw new Error(`Could not get products. Error ${err}`)
    }
  } 

  async show(id: number | string): Promise<Product> {
    try {
      const conn = await db.connect()
      const sql = 'SELECT * FROM products WHERE id=($1);'
      const result = await conn.query(sql, [id])
      const product = result.rows[0]
      conn.release()
      
      return product
    } catch (err) {
      throw new Error(`Could not find product. Error ${err}`)
    }
  } 

  async create(p: Product): Promise<Product> {
    try {
      const conn = await db.connect()
      const sql = 'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *;'
      const result = await conn.query(sql, [p.name, p.price])
      const product = result.rows[0]

      conn.release()
      
      return product
    } catch (err) {
      throw new Error(`Could not add a new product. Error ${err}`)
    }
  } 

  async update(p: Product): Promise<Product> {
    try {
      const conn = await db.connect()
      const sql = 'UPDATE products SET name = ($1), price = ($2) WHERE id = ($3) RETURNING *;'
      const result = await conn.query(sql, [p.name, p.price, p.id])
      const product = result.rows[0]

      conn.release()
      
      return product
    } catch (err) {
      throw new Error(`Could not find product. Error ${err}`)
    }
  } 

  async delete(id: number | string): Promise<Product> {
    try {
      const conn = await db.connect()
      const sql = 'DELETE FROM products WHERE id=($1);'
      const result = await conn.query(sql, [id])
      conn.release()
      
      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not delete product. Error ${err}`)
    }
  } 


}