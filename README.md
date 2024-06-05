# FirmaVirrtual PokeAPI
Technical Test by **FirmaVirtual Mexico** - @codeslator (Andres Melendez) - API build with **Node + TypeScript** using **NestJS Framework + TypeORM** and **PostgreSQL Database**.
## Requirements
To run this app, you must have installed Node, NPM & Docker.

---
## Installation

This README has the instructions to install and execute this API. The first step is clone the repository from GitHub.
```bash
git clone https://github.com/codeslator/firmavirtual-pokeapi
```
After clone the repository, you must to install all dependencies.
```bash
cd firmavirtual-pokeapi
npm install
```
 When dependencies was installed, you must run the database container, make sure you have the `.env` file in the repository with the following variables:
 ```
POSTGRES_DB=pokedb
POSTGRES_USER=codeslator
POSTGRES_PASSWORD=firmavirtualdb
```
Then, you can run the container with the following command:
```docker
docker compose up -d
```
**NOTE**: If you don't have the database image downloaded, this command will download it automatically, this process can take some minutes. 
Now, you can connect with the FirmaVirtual database from any client as PgAdmin (not installed),  DBeaver, TablePlus, etc.
To connect, you should use this values:
```
Name: firmavirtual-db
Host: 127.0.0.1 or localhost
Port: 5432
User: codeslator
Password: firmavirtualdb
Database: pokedb
```
**Remember Test the connection before save.**

After add environment variables and connect with database, we can execute the NestJS using the following command:
```bash
npm run start:dev
```
As we are using TypeORM, when API is starting it will connect with database and will map all entities created to create tables automatically.
The entities are **Pokemon**, **Abilities**, **Types** and **Stats**, relations are created automatically.
If application was started correctly, will be listen in **3000** port. Open in the browser or API client the following URL: `http://localhost:3000/`. Now the API is running. Great!

To see the API endpoints, you can open the **API Swagger** in the following URL:
```
http://localhost:3000/api/
```
**NOW**, you must seed all your database with Pokemon info got from PokeAPI. In your API Client or Browser call the followind endpoint:
```
http://localhost:3000/seed
```
Please, wait until the database tables are seed correctly. You can follow the API logs to know if process is running correctly or an error happened.

**NOTE**: Seed all database can take some minutes, please be patient because there are more than 1000 Pokemon Species that exists today. From **#0001 Bulbasaur** to **#1024 Pecharunt**. This is required to make some requests in the API.  When the process finishes, you can run the Front-End application that connects with this API.

Finally, the API is running correctly and now you can connect any front-end app or make request to any declared endpoint. **Good job!**

## Directory Structure
The API project has the following directory structure:
```
├── src
│   ├── abilities
│   │   ├── entities
│   │   ├── abilities.controller.ts
│   │   ├── abilities.module.ts
│   │   └── abilities.service.ts
│   ├── interfaces
│   │   ├── functions.ts
│   │   └── index.ts
│   ├── pokemon
│   │   ├── dto
│   │   ├── entities
│   │   ├── pokemon.controller.ts
│   │   ├── pokemon.module.ts
│   │   └── pokemon.service.ts
│   ├── seed
│   │   ├── seed.controller.ts
│   │   ├── seed.module.ts
│   │   └── seed.service.ts
│   ├── stats
│   │   ├── entities
│   │   ├── stats.controller.ts
│   │   ├── stats.module.ts
│   │   └── stats.service.ts
│   ├── types
│   │   ├── entities
│   │   ├── types.controller.ts
│   │   ├── types.module.ts
│   │   └── types.service.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts
├── .env
├── ...
├── docker-compose.yml
├── package.json
├── nest-cli.json
├── tsconfig.build.json
├── tsconfig.json
└── README.md
```
This was part of the developement of this Technical Test. **I hope you like it!** Thanks for this opportunity and sorry for delay.