# ubiKal
![Website](https://img.shields.io/website?up_message=online&url=https%3A%2F%2Fwww.ubikal.com) ![GitHub](https://img.shields.io/github/license/JoeFriedlander/ubiKal?color=rgb%2833%2C%20150%2C%20243%29)

Rapidly create and share micro-schedules, each with their own 'allow edit' and 'view only' link. Load any number of independent schedules for real time coordination without signins.

### Website: [ubiKal.com](https://www.ubikal.com)

### How it works
todo - screenshot of how sharing types of links work

### Main tech used
Vue.js + Vue Router + Vuetify, Node + Express, Moment, uuid
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
##### 2. Create a seperate .env file for each folder and supply the values. The values I use locally are provided as an example

in `frontend/.env`
```
VUE_APP_WEBSERVER=localhost:8080/
VUE_APP_APISERVER=http://localhost:3000/
```
in `backend/.env`
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

frontend: `npm run serve`

backend: `npm run dev`

### Deployment

frontend: `npm run build`

The folder `dist` will be created and ready to be served by a webserver

backend:`npm start`

## Author
Joe Friedlander

## Acknowledgments
Name inspired from the book *Ubik* by Philip K. Dick

### For fun: A screenshot of an early version
![early ubiKal](https://user-images.githubusercontent.com/16908677/93009693-0c420c80-f552-11ea-98a8-2cfaad0339c1.PNG)
