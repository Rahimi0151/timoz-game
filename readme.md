# timoz-game

This is a technical demo based on `NodeJS` and `TypeScript`

## Table of Contents

- [Installation](#installation)
- [Core Technologies](#core-technologies)
    - [Runtime (NodeJS)](#runtime-nodejs)
    - [REST API (ExpressJS)](#rest-api-expressjs)
    - [TypeChecking (TypeScript)](#typechecking-typescript)
    - [Database (MongoDB)](#database-mongodb)
    - [Real Time Connections (Socket.IO)](#real-time-connections-socketio)
    - [Caching (Redis)](#caching-redis)
    - [Documentation (OpenAPI)](#documentation-openapi)
    - [Testing and Test Driven Development (Jest)](#testing-and-test-driven-development-jest)
- [Miscellaneous Libraries](#miscellaneous-libraries)
    - [Hashing the Passwords (bcrypt)](#hashing-the-passwords-bcrypt)
    - [Configuration/Secrets management (config)](#configurationsecrets-management-config)
    - [Authentication (jsonwebtoken)](#authentication-jsonwebtoken)
    - [Data Validation (yup)](#data-validation-yup)



## Installation

Unfortunately, there is no live version to play. but you can install this locally and test this.

1. use the command below to download the project:
```shell
git clone https://github.com/Rahimi0151/timoz-game.git
```
2. use the command below to install all the dependencies:
 ```shell
 npm install
 ```

3. make sure to have `ts-node` installed globally by using the code below:
```shell
npm install -g ts-node
```


4. use the command below to run a version locally
```shell
ts-node src/index.ts
``` 

5. if you just want to check if all the unit/integration tests are passing, you can use:
```shell
npm test
```
#
## Core Technologies

#
## Runtime (NodeJS)
the project is based on `Node v20.5.1`

#
## REST API (ExpressJS)
as a beginner, i used express as a base to develope `REST` APIs and make the program work

#
## TypeChecking (TypeScript)
After the whole project was done, I watched a course on [TypeScript by Mosh Hamedani](https://codewithmosh.com/p/the-ultimate-typescript)  and converted all the `.js` files to `.ts`. to be honest, i mostly used chatGPT to translate these files to TypeScript and put down some finishing touches and removed any potential bugs.

#
## Database (MongoDB)
I used MongoDB as the primary Database for the project. there is no reason for me to use this, just a personal preference. I could have also used any `SQL` base databases.

I have had experience with raw SQL codes (without any ORM) as shown [HERE](https://github.com/Rahimi0151/league-project) (this was a collage project. it's not the best code, but it shows i know my way around plain sql)

I also had some experience with Eloquent ORM which was an SQL ORM built into the Laravel Framework as shown in [this project](https://github.com/Rahimi0151/laragool)

#
## Real Time Connections (Socket.IO)
When the game starts, there will be a new Socket.IO connection between the server and the client to improve the games responsiveness.

#
## Caching (Redis)
As the game is a fun game and has a potential to have multiple thousand players at the same time, i used redis to cache some of the most used data during the match. for example:
- the questions in the game that is currently being played
- information about each player that is still playing
- number of remaining players

#
## Documentation (OpenAPI)
As this is a collaborative industry and we all need to communicate how we have build our APIs, I needed a standard to document my APIs.

So I have learned and used [OpenAPI](https://www.openapis.org/) (formerly known as `Swagger`) to document my endpoints

The reason I used OpenAPI is that it's an industry standard used by large scale companies like [ZarinPal](https://www.zarinpal.com/) (as shown [here](https://jobinja.ir/companies/zarinpal/jobs/CpGE/%D8%A7%D8%B3%D8%AA%D8%AE%D8%AF%D8%A7%D9%85-%D8%A8%D8%B1%D9%86%D8%A7%D9%85%D9%87-%D9%86%D9%88%DB%8C%D8%B3node-js-back-end-%D8%B3%D8%A7%D8%B1%DB%8C-%D8%AF%D8%B1-%D8%B2%D8%B1%DB%8C%D9%86-%D9%BE%D8%A7%D9%84))

#
## Testing and Test Driven Development (Jest)
As the goal of all the big companies is to make maintainable codes and minimize technical debt, almost all companies use a testing framework.

Almost all the codes in this project are covered by some sort of test, either a unit or an integration test.

You can generate code coverage report. To do so:
1. install the Jest library globally:
```shell
npm install -g jest
```
2. run this command to generate
```shell
jest --coverage --maxWorkers=1
```

#
# miscellaneous Libraries

#
## Hashing the Passwords (bcrypt)
As a security best practice, we should never store raw password in pain text. So I used [bcrypt](https://github.com/kelektiv/node.bcrypt.js) library to encrypt/hash the passwords saved in the database.

#
## Configuration/Secrets management (config)
I used [config](https://github.com/node-config/node-config) package to store all the secrets inside one file located at `/config/default.json`.

This file is uploaded to github with some default values, but in production, the app will read the values from environment variables to keep them safe using the `/config/custom-environment-variables.json` file.

#
## Authentication (jsonwebtoken)
As HTTP is a stateless technology, to keep people logged in and perform authentication, I used [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) library to generate JWTs.

#
## Data Validation (yup)

Never trust a user's input. So to validate each request, I have used [yup](https://github.com/jquense/yup) package to validate the user's inputs.

To see these validations in action, just check any of the middlewares inside `/src/middleware/validate/`

