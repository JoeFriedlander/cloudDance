//Load environmental variables
require('dotenv').config()

// DB Settings
const { Pool } = require('pg')
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  })

// Server Settings
const express = require('express');
const helmet = require("helmet");
const cors = require('cors')
const bodyParser = require('body-parser');
const createID = require('./createID.js')

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//API
app.get('/api/test', (req, res, next) => {
    res.send(JSON.stringify('test succesfully reached api'));
});

app.post('/api/newCalendar', (req, res, next) => {
    let calendarID = createID();
    pool
        .query('INSERT INTO calendar(calendarID) VALUES($1) RETURNING *', [calendarID])
        .then(pgresult => {
            res.send(pgresult.rows[0].calendarid);
        })
        .catch(e => {res.send(JSON.stringify('Error: could not create new calendar'))})
});

app.delete('/api/deleteCalendar', (req, res, next) => {
    let calendarID = req.query.calendarID;
    pool
        .query('DELETE FROM calendar WHERE calendarID = $1 RETURNING *', [calendarID])
        .then(pgresult => {
            console.log(pgresult.rows[0])
            //TODO should inform if not exists, check if return val is same as cal, check if error or already gone
            res.send(true);
        })
        .catch(e => {console.error(e.stack);
            res.send(JSON.stringify('Error: Could not delete ' + calendarID));}
        )
});

app.get('/api/calendarExists', (req, res, next) => {
    let calendarID = req.query.calendarID;
    let result = false;
    pool
        .query('SELECT COUNT(*) FROM calendar WHERE calendarID = $1', [calendarID])
        .then(pgresult => {
            (Number(pgresult.rows[0].count) === 0) ? result = false : result = true;
            res.send(result);
        })
        .catch(e => res.send(JSON.stringify('Error checking if calendar ' + calendarID + ' exists')))
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
        res.send(true);
    })
    .catch(e => res.send(JSON.stringify('Error inserting event ' + eventDescription + ' for calendar ' + calendarID)))
});

app.get('/api/getAllEvents', (req, res, next) => {
    let calendarID = req.query.calendarID;
    pool
        .query('SELECT eventdescription, starttime, length FROM event WHERE calendarID = $1', [calendarID])
        .then(pgresult => {
            console.log(pgresult);
            res.send(pgresult);
        })
        .catch(e => res.send(JSON.stringify('Error loading events for ' + calendarID)))
});

app.use('/', (req, res, next) => {
    //always runs
    res.send('ok main page');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);