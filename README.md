# CloudDance Calendar
![WebsiteStatus](https://img.shields.io/website?url=https%3A%2F%2Fcloud.dance) ![LicenseStatus](https://img.shields.io/badge/license-MIT-blue)

![cloudDance logo](https://user-images.githubusercontent.com/16908677/102152414-f1c64a80-3e42-11eb-9d5d-3a8b390ccca9.png)

Rapidly create and securely share tiny calendars for real-time coordination and login-free access control 

### Website: [cloud.dance](https://cloud.dance)
Desktop/Laptop only (not mobile ready yet)

### Main tech used
**Vue.js**, Vue Router, Vuetify

**Node**, Express, Moment, uuid

## Installation
Note: The project is divided into a vue `frontend` folder and a node `backend` folder, each with their own package.json
### Prerequisites

* Node v12.8.2+
* PostgreSQL v12.4+

### Steps

##### 1. Install each via npm
```
cd frontend
npm install
cd ../backend
npm install
```
##### 2. Create seperate .env files for the two folders and supply the values. Below are values for a development environment. For example, in production the DB connection uses ssl, but in development it doesn't so DATABASE_USES_SSL is set to false

in `frontend/.env`
```
VUE_APP_WEBSERVER=localhost:8080/
VUE_APP_APISERVER=http://localhost:3000/
```
in `backend/.env`
```
DATABASE_URL=postgres://postgres:yourPostgresPasswordHere@localhost:5432/clouddance
DATABASE_USES_SSL=false
WEBSERVER_URL=http://localhost:8080
```

##### 3. Start PostgreSQL, connect to it with the command `psql -U postgres`, and paste the below to setup the database
```
CREATE DATABASE clouddance;
\connect clouddance;
CREATE TABLE calendar
( 
  calendarID varchar(32) PRIMARY KEY NOT NULL,
  allowEditID varchar(32),
  dateTimeCreated timestamp NOT NULL
);
CREATE TABLE event
( 
  eventID varchar(32) PRIMARY KEY NOT NULL,
  dateTimeCreated timestamp NOT NULL,
  calendarID varchar(32) NOT NULL,
  eventdescription varchar(200), 
  starttime timestamp NOT NULL,
  endtime timestamp NOT NULL,
  CONSTRAINT fk_event_calendar FOREIGN KEY(calendarID) REFERENCES calendar(calendarID) ON DELETE CASCADE
);
```

### Local testing and development

frontend: `npm run serve`

backend: `npm run dev`

### Deployment

frontend: `npm run build` . The folder `dist` will be created and ready to be served

backend:`npm start`

## Author
Joe Friedlander

### For fun: A screenshot of an early version
![early cloudDance](https://user-images.githubusercontent.com/16908677/93009693-0c420c80-f552-11ea-98a8-2cfaad0339c1.PNG)
