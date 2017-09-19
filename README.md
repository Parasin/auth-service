# auth-service

## Description
Simple Node.JS authentication service utilizing [MongoDB](https://www.mongodb.com/), and JSON Web Tokens ([JWT](https://jwt.io/)).

Provides basic CRUD operations for users, as well as a simple authentication mechanism for logging in, and token validation.

## Setup
To use this service, simply clone the repo, and run the `npm install` command in your directory!

## API Endpoints
| Route | Endpoint | Method | Input |                 Output                |
|:-----:|:--------:|:------:|:-----:|:-------------------------------------:|
| User  |     /    |   GET  |  JWT  | MongoDB document for current user     |
|       |   /:id   |   GET  |  JWT  | MongoDB document for User matching ID |
|       |     /    |  POST  |  N/A  | Authentication status, and JWT        |
|       |   /:id   |   PUT  |  JWT  | Number of records modified            |
|       |   /:id   | DELETE |  JWT  | MongoDB document for deleted user     |

