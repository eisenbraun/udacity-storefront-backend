# Storefront Backend Project
#### by Michael Eisenbraun

## Project Setup
```
npm install
```

## Compiles and hot-reloads for development
```
npm run watch
```

## Compiles and minifies for production
```
npm run build
```

## Runs unit tests
```
npm run test
```

## API Endpoints

### Products
GET: /api/products - Returns all products
GET: /api/products/1 - Returns single product
POST: /api/products - Creates product (Requires token)

### Users
GET: /api/users - Return all users (Requires authentication)
GET: /api/users/1 - Return single product (Requires authentication)
POST: /api/users - Creates user (Requires authentication)

### Orders
GET: /api/orders/active/users/1 - Returns products of user's active order (Requires authenticaion)




