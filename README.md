# ubiKal
Rapidly create and share schedules

## Link
### [ubikal.com](https://www.ubikal.com)

## Installation
Note: The project is divided into a vue `frontend` folder and a node `backend` folder
### Prerequisites

* Node v12.8.2+
* PostgreSQL v12.4+

### Steps

##### 1. Install via npm
```
npm install ./frontend
npm install ./backend
```
##### 2. Create a seperate .env file for each folder and supply the values. The values I use locally are provided as an example

in `./frontend/.env`
```
VUE_APP_WEBSERVER=localhost:8080/
VUE_APP_APISERVER=http://localhost:3000/
```
in `./backend/.env`
```
DATABASE_URL=postgres://postgres:yourPostgresPasswordHere@localhost:5432/ubikal
DATABASE_DOESNT_USE_SSL=true
WEBSERVER_URL=http://localhost:8080
```

##### 3. Start PostgreSQL, connect to it with `psql -U postgres` and paste in the below to setup the database
```
CREATE DATABASE -u postgres ubikal;
\connect ubikal;
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

frontend:
```
npm run serve
```

backend:
```
npm run dev
```

### Deployment

frontend:
```
npm run build
```
The folder `dist` will be created and ready to be served by a webserver

backend:
```
npm start
```

## Author
Joe Friedlander

## Acknowledgments
* Name inspired from the book *Ubik* by Philip K. Dick
