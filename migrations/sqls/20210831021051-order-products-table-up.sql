CREATE TABLE order_products (
  id SERIAL PRIMARY KEY,
  quantity INTEGER,
  product_id REFERENCES products(id),
  user_id REFERENCES users(id)
);