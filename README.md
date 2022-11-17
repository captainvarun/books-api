# Backend Assignment

This project is built using NodeJS(Express), MongoDB, Passport JWT and Docker

## *Preface*
The following tasks have been completed as mentioned in the specification document:

- **Task 1**
  - Implement CRUD (Create, Read, Update, Delete) functionalities with REST principle. (Example: CRUD to manage book list in library, feel free to add any required attributes/schema
  - You can use any framework in NodeJS, but we prefer Expressjs 
  - Document it using swagger. 

- **Task 2**
  - Dockerize the REST api with environment variables.  
  - Implement reverse proxy (Nginx) to connect to a variable number of API Server instances. 
  - Use docker compose to run the container (One command to rule/run them all) 

- **Task 3**
  - Implement authorization and authentication (You can choose sessions/jwt/oauth) 
  - Implement rate limiting (Keep the number of api server instance in mind) 
  - Implement persistence of data (You can choose NoSQL/SQL) 

- **Task 4**  
  - Write the complete test cases (unit/integration/e2e) 


*Please note that due to time constraints, the other tasks were not implemented.*


## API Endpoints

To view the list of all available endpoints and their specifications, run the server and go to http://localhost:5000/docs in your browser. This documentation has been generated using swagger.

List of available routes:

**Auth routes**:\
`POST`  `/api/v1/auth/register` - register\
`POST`  `/api/v1/auth/login` - login

**Book routes**:\
`POST` `/api/v1/books` - create a book\
`GET`  `/api/v1/books` - get all books\
`GET`  `/api/v1/books/:bookId` -  get a book\
`PUT`  `/api/v1/books/:bookId` - update all fields in a book\
`DELETE`  `/api/v1/books/:bookId` - delete a book


## Considerations

#### Pagination:

In advanced applications, pagination is a requirement for massive amounts of data but has been simplified for this project

#### Environment Variables:

An .env has been included in the project files which is totally not recommended but has been done for ease of testing. 

#### Rate Limiting:

A naive solution has been implemented in view of the project time constraints. In a one minute window, we’re allowing twenty requests. In projects that require scale a sophisticated approach will have to be used to find the best method. 

#### Persistence:

MongoDB database in conjunction with mongoose has been used for this project. Some considerations have been made;

- This project does not include additional entities for things like authors to keep it simple.

- The database structure has been implemented in a simple way and dies have scope for improvement if used for production applications.

- To keep it simple, data doesn't persist through docker sessions and for production applications this can be resolved.
 
#### Test Cases

Unit test cases have been implemented using Jest along with supertest as mentioned in the specification. In a more sophisticated application, multiple other tests will have to be performed like verifying whether JWT token is correct and for edge cases as well.

#### Environment Variables:

An .env has been included in the project files which is totally not recommended but has been done for ease of testing. 

## Authentication

All endpoints that perform modification or addition are restricted by a JWT access token and a naive role system. This token is required to be present in the Authorization request header and must be using the standard bearer schema.  If any of the above requests do not contain a valid access token, an Unauthorized error with status 401 will be thrown.

#### Registration:

Before generating an access token, an user will first have to be created using  /api/v1/auth/register. Please note that by default if a role field is not passed, the user will receive the role ‘user’.

The endpoint will have to be called by passing the below fields in the body of the request:

```
{
    "name": "Varun",
    "email": "varun@techvarun.com",
    "password": "password123",
    "role": "admin | user"
}

```
The above implementation requires the role to be passed as ‘admin‘ during creation to allow the user to perform modifications or additions. This has been done in view of the assignment for ease of testing.
 
#### Generating Access Tokens:

If a user already exists, the user will have to execute /api/v1/auth/login to generate an access token. Please note that the current implementation generates refresh tokens but an user won’t be able to utilize it citing time constraints.

The endpoint will have to be called by passing the below fields in the body of the request:

```json
{
    "email": "varun@techvarun.com",
    "password": "password123",
}
```

The above endpoint will respond with the following:

```json
{
    "user": {
        "name": "Varun",
        "email": "varun@techvarun.com",
        "role": "admin",
        "id": "6375e8b919ca8e9e5c194f72"
    },
    "tokens": {
        "access": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Mzc1ZThiOTE5Y2E4ZTllNWMxOTRmNzIiLCJpYXQiOjE2Njg2NzE2OTAsImV4cCI6MTY2ODY3MzQ5MCwidHlwZSI6ImFjY2VzcyJ9.c3RJBNeFyiphrc0iLa_qBoT-r85TWx7Wpc5H0U7wNOc",
            "expires": "2022-11-17T08:24:50.425Z"
        },
        "refresh": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Mzc1ZThiOTE5Y2E4ZTllNWMxOTRmNzIiLCJpYXQiOjE2Njg2NzE2OTAsImV4cCI6MTY3MTI2MzY5MCwidHlwZSI6InJlZnJlc2gifQ.CYsxFp1gNPia8irL0OMg-NkTjT_wns9cCEnLVauS3Bk",
            "expires": "2022-12-17T07:54:50.427Z"
        }
    }
}
 
```
The access token as part of the response object will have to be used in the Authorization header using the Bearer schema i.e proceeding the token with bearer


## Commands:

#### Running developer server:
```bash
npm run dev
```
#### Running in production:
```bash
npm run start
```

#### Testing:
```bash
npm run test
```

#### Docker:
```bash
npm run docker:compose
```
