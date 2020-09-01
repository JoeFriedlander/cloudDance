//Load environmental variables
require('dotenv').config()

// DB Settings
const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL;
if (process.env.DATABASE_DOESNT_USE_SSL) {
    // If the DB doesn't use SSL, create the pool without referencing ssl
    pool = new Pool({connectionString: connectionString})}
else {
    pool = new Pool({connectionString: connectionString, ssl: {rejectUnauthorized: false}})
}

// Server Settings
const express = require('express');
const helmet = require("helmet");
const cors = require('cors')
const corsOptions = {
    origin: process.env.ALLOWED_CORS_ORIGIN,
    credentials: true
  }
const bodyParser = require('body-parser');
const createID = require('./createID.js')

const app = express();
app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//API


app.post('/api/newCalendar', (req, res, next) => {
    let calendarID = createID();
    pool
        .query('INSERT INTO calendar(calendarID) VALUES($1) RETURNING *', [calendarID])
        .then(pgresult => {
            //If successful send the new calendar id
            res.status(201).send(pgresult.rows[0].calendarid);
        })
        .catch(e => {res.status(400).end();})
});

app.delete('/api/deleteCalendar', (req, res, next) => {
    let calendarID = req.query.calendarID;
    pool
        .query('DELETE FROM calendar WHERE calendarID = $1 RETURNING *', [calendarID])
        .then(pgresult => {
            //If successful send OK, if not found send 404
            pgresult.rows[0] ? res.status(200).end() : res.status(404).end()
            res.status(200).end();
        })
        .catch(e => {console.error(e.stack);
            res.status(400).end();}
        )
});

app.get('/api/calendarExists', (req, res, next) => {
    let calendarID = req.query.calendarID;
    let result = false;
    pool
        .query('SELECT COUNT(*) FROM calendar WHERE calendarID = $1', [calendarID])
        .then(pgresult => {
            (Number(pgresult.rows[0].count) === 0) ? res.status(404).end() : res.status(200).end();
        })
        .catch(e => res.status(400).end())
});

app.post('/api/newEvent', (req, res, next) => {
    console.log(req.body);
    let calendarID = req.body.calendarID;
    let eventDescription = req.body.eventDescription;
    let starttime = req.body.starttime;
    let length = req.body.length;

    pool
    .query('INSERT INTO event (calendarID, eventDescription, starttime, length) VALUES ($1, $2, $3, $4)', 
        [calendarID, eventDescription, starttime, length])
    .then(pgresult => {
        res.status(201).end();
    })
    .catch(e => res.status(400).end())
});

app.get('/api/getAllEvents', (req, res, next) => {
    let calendarID = req.query.calendarID;
    //check if calendar exists first then send 404 if it doesn't. then do rest
    pool
        .query('SELECT eventdescription, starttime, length FROM event WHERE calendarID = $1', [calendarID])
        .then(pgresult => {
            console.log(pgresult);
            res.send(pgresult);
        })
        .catch(e => res.status(400))
});

app.use('/', (req, res, next) => {
    res.status(404).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);