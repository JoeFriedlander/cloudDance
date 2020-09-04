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
    origin: "*",
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
//TODO CREATE HELPER FUNCTIONS calendarExists (check if calendar exists), authorize (authorize calendarID with allowEditID).
app.post('/api/newCalendar', (req, res, next) => {
    let calendarID = 'ubik' + createID().substring(4);
    let allowEditID = 'edit' + createID().substring(4)
    pool
        .query('INSERT INTO calendar(calendarID, allowEditID, dateTimeCreated) VALUES($1, $2, LOCALTIMESTAMP)', [calendarID, allowEditID])
        .then(pgresult => {
            //If successful send the new calendar id
            res.status(201).send(JSON.stringify({calendarID:calendarID, allowEditID:allowEditID}));
        })
        .catch(e => {console.error(e.stack);
            res.status(400).end();}
        )
});

app.delete('/api/deleteCalendar', (req, res, next) => {
    let calendarID = req.query.calendarID;
    let allowEditID = req.body.allowEditID;
    //Checks if calendarID and allowEditID match up. If not, send forbidden.
    pool
        .query('SELECT COUNT(*) FROM calendar WHERE calendarID = $1 AND allowEditID = $2', [calendarID, allowEditID])
        .then(pgresult => {
            if (Number(pgresult.rows[0].count) === 0) {
                res.status(403).end();
            }
            else {
                pool
                .query('DELETE FROM calendar WHERE calendarID = $1 RETURNING *', [calendarID])
                .then(pgresult => {
                    //If successful send 200, if not found send 400
                    pgresult.rows[0] ? res.status(200).end() : res.status(404).end()
                    res.status(200).end();
                })
                .catch(e => {console.error(e.stack);
                    res.status(400).end();}
                )
            }
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
        .catch(e => {console.error(e.stack);
            res.status(400).end();}
        )
});

app.post('/api/newEvent', (req, res, next) => {
    let calendarID = req.body.calendarID;
    let eventDescription = req.body.eventDescription;
    let starttime = req.body.starttime;
    let length = 100;
    let eventID = createID();
    let allowEditID = req.body.allowEditID;
    //temporary value for starttime
    starttime = Date.now();

    pool
    .query('INSERT INTO event (eventID, dateTimeCreated, calendarID, eventDescription, starttime, length) VALUES ($1, LOCALTIMESTAMP, $2, $3, (to_timestamp($4 / 1000.0)), $5)', 
        [eventID, calendarID, eventDescription, starttime, length])
    .then(pgresult => {
        res.status(201).send(eventID);
    })
    .catch(e => {console.error(e.stack);
        res.status(400).end();}
    )
});

app.get('/api/getEvent', (req, res, next) => {
    let eventID = req.query.eventID;
    pool
        .query('SELECT eventDescription, startTime, length FROM event WHERE eventID = $1', [eventID])
        .then(pgresult => {
            res.status(200).send(pgresult.rows[0])
        })
        .catch(e => {console.error(e.stack);
            res.status(400).end();}
        )
});

app.delete('/api/deleteEvent', (req, res, next) => {
    let eventID = req.query.eventID;
    let allowEditID = req.body.allowEditID;
    pool
        .query('DELETE FROM event WHERE eventID = $1 RETURNING *', [eventID])
        .then(pgresult => {
            //If successful send 200, if not found send 404
            pgresult.rows[0] ? res.status(200).end() : res.status(404).end()
            res.status(200).end();
        })
        .catch(e => {console.error(e.stack);
            res.status(400).end();}
        )
});

app.get('/api/loadEventsFromCalendar', (req, res, next) => {
    let calendarID = req.query.calendarID;
    pool
        .query('SELECT eventID FROM event WHERE calendarID = $1', [calendarID])
        .then(pgresult => {
            res.send(pgresult.rows);
        })
        .catch(e => {console.error(e.stack);
            res.status(400).end();}
        )
});

app.use('/', (req, res, next) => {
    res.status(404).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);