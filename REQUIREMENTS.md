# Project 

## Data Schema
### products
- id SERIAL PRIMARY KEY
- name VARCHAR(150)
- price DECIMAL(8,2)

### users
- id SERIAL PRIMARY KEY
- firstName VARCHAR(100)
- lastName VARCHAR(100)
- password VARCHAR

### orders
- id SERIAL PRIMARY KEY
- status VARCHAR(50)
- user_id INTEGER REFERENCES users(id)

### order_products
- id SERIAL PRIMARY KEY
- product_id INTEGER REFERENCES products(id)
- order_id INTEGER REFERENCES orders(id)

*quantity is calculated using an aggregate function* 


## API Endpoints
## Products
- GET: /api/products - Returns all products
- GET: /api/products/1 - Returns single product
- POST: /api/products - Creates product (Requires token)

## Users
- GET: /api/users - Return all users (Requires authentication)
- GET: /api/users/1 - Return single product (Requires authentication)
- POST: /api/users - Creates user (Requires authentication)

## Orders
- GET: /api/orders/active/users/1 - Returns products of user's active order (Requires authentication)
- GET: /api/orders/active/users/1/products/1 - Adds a new product to the user's active order (Requires authentication)



