# Storefront Backend Project
#### by Michael Eisenbraun

## Project Setup

### Setup Database  

**1. Create User**
```
CREATE USER storefront_user WITH PASSWORD 'password123!';
ALTER USER storefront_user CREATEDB;
```

**2. Create Database**
```
CREATE DATABASE storefront;
```

**3. Grant all privileges**
```
GRANT ALL PRIVILEGES ON DATABASE storefront TO storefront_user;
```

### Setup Workspace
**1. Install dependencies**
```
npm install
```

**2. Create .env file**
Create a new file named .env. Add the following to the file
```
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=storefront
POSTGRES_TEST_DB=storefront_test
POSTGRES_USER=storefront_user
POSTGRES_PASSWORD=password123
BCRYPT_PASSWORD=password123!
SALT_ROUNDS=10
TOKEN_SECRET=alohomora123!
ENV=dev
```

### Run Unit Tests

**1. Set ENV to Test**
In the .env, set the ENV variable to `test`

**2. Run the jasmine tests**
```
npm run test
```

### Compiles and hot-reloads for development

**1. Set ENV to Test**
IN the .env file, set the ENV variable to `dev`

**2. Compile and run server**
```
npm run watch
```

## Compiles and minifies for production
```
npm run build
```





