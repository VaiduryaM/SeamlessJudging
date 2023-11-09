# SeamlessJudging Backend Service:

## How to deploy:
### Get Code-Access:
- Go to [Github-Code-Repo](https://github.com/jayanthjay12/SeamlessJudging).
- Take a pull of the `master` branch.

### Setup Env:
- Update env fields in file `cd backend/.env`. 

| Key                 |                                              Description                                               |
|---------------------|:------------------------------------------------------------------------------------------------------:|
| PORT                |                             Port on which the project has to be deployed.                              |
| JWT_KEY             |                        JWT-Key or secret using which JWT-tokens are generated.                         |
| MYSQL_HOST          |                                            MYSQL HostName.                                             |
| MYSQL_USER          |                                            MYSQL UserName.                                             |
| MYSQL_PASSWORD      |                                            MYSQL Password.                                             |
| MYSQL_DB            |                   Name of the MYSQL database on which the records has to be created.                   |
| DB_MIGRATE          |        The value `YES` updates any changes made to the existing schema once server is started.         |
| FILES_UPLOAD_PATH   |    Holds the location of the directory in which the files uploaded has to be stored on the server.     |
| GOOGLE_CLIENT_ID    |                   Google ClientId of the service using which any emails can be sent.                   |
| REFRESH_TOKEN       |              Refresh of the google account for the service to access the gmail services.               |
| CLIENT_SECRET       |                                 Secret of the service's google-client.                                 |
| EMAIL_SENDER        |                                        EmailID of the service.                                         |
| LINK                | URL of the service where its Frontend service is deployed. For eg: `http://stark.cse.buffalo.edu:8000` |
| ADMIN_CREATION_CODE |           Access-code using which first admin user can be created on the dashboard to login.           |

### StartUp:
- Switch to folder `cd backend`.
- Install dependencies:
  - Run `npm install`.
- Start Server:
  - Run `npm start`.
  - To keep the server up always on the remote server run the project in `tmux` session.

---

### Creation of first Admin-User:
- From `.env` pick up the code `ADMIN_CREATION_CODE` and trigger the below `curl` request.
```
curl -X POST http://localhost:3000/api/v1/user/signup-admin -H "admin-creation-code:@admin" -H "Content-Type: application/json" --data '{ "first_name":"Jane" , "last_name":"Jane", "middle_name":"Jane" , "email":"jane.doe@abc.com", "password":"root"}'
```
- Using the credentials of the admin created one can logon to the dashboard and start using it.

---

### Components:

- `api/models` => Maintains all database schema details or tables to be created.
- `api/routes` => Maintains the routes available for the APIs to be accessed.
- `api/middlewares` => Maintains all middlewares that has to be validated before triggering API-Controllers.
- `api/controllers` => Maintains all handlers or controllers of exposed APIs.
- `api/config` => Maintains configurations for database access and jwt access-token generation.
- `app.js` => Registers all routes to different modules and decides to migrate a database based on the value on .env for `DB_MIGRATE`.
- `server.js` => Server starts up from here.

---

### Database Schema:
![](capstone-schema.png?raw=true "Title")

---
### Resources:
- Switch to `cd backend/swagger.yaml`.
- Go to [Swagger-Editor](https://editor.swagger.io/) and paste the yaml content on the editor to check out the API specs.


