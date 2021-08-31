CREATE TABLE order_products (
  id SERIAL PRIMARY KEY,
  quantity INTEGER,
  product_id INTEGER REFERENCES products(id),
  user_id INTEGER REFERENCES users(id)
);