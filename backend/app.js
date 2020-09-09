//Load environmental variables
require('dotenv').config()

//load packages
const moment = require('moment');

// DB Settings
const pg = require('pg')
//fix to stop auto-convert timestamps on select
pg.types.setTypeParser(1114, function(stringValue) {return stringValue;});
//connection string
const connectionString = process.env.DATABASE_URL;
// If the DB doesn't use SSL then create the pool without referencing ssl
if (process.env.DATABASE_DOESNT_USE_SSL) {
    pool = new pg.Pool({connectionString: connectionString})}
else {
    pool = new pg.Pool({connectionString: connectionString, ssl: {rejectUnauthorized: false}})
}

// Server Settings
const express = require('express');
const helmet = require("helmet");
const cors = require('cors')
const corsOptions = {
    origin: process.env.WEBSERVER_URL,
    credentials: true
  }
const bodyParser = require('body-parser');
const createID = require('./createID.js')

const app = express();
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors(corsOptions));
//sometimes cors doesn't work so including this
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.WEBSERVER_URL);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//API
//TODO CREATE HELPER FUNCTIONS calendarExists (check if calendar exists), authorize (authorize calendarID with allowEditID).
app.post('/api/newCalendar', (req, res, next) => {
    let calendarID = 'ubik' + createID().substring(4);
    let allowEditID = 'edit' + createID().substring(4)
    let currentTimeUTC = moment().utc().format('YYYY-MM-DD H:mm:ss');
    pool
        .query('INSERT INTO calendar(calendarID, allowEditID, dateTimeCreated) VALUES($1, $2, $3)', [calendarID, allowEditID, currentTimeUTC])
        .then(pgresult => {
            //If successful send the new calendar info
            res.status(201).send(JSON.stringify({calendarID:calendarID, allowEditID:allowEditID, dateTimeCreatedUTC:currentTimeUTC}));
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
    let allowEditID = req.query.allowEditID;
    let result = false;
    //check if only calendarID supplied
    if(!allowEditID) {
        pool
            .query('SELECT COUNT(*) FROM calendar WHERE calendarID = $1', [calendarID])
            .then(pgresult => {
                (Number(pgresult.rows[0].count) === 0) ? res.status(404).end() : res.status(200).end();
            })
            .catch(e => {console.error(e.stack);
                res.status(400).end();}
            )
        } else {
        //check if both calendarID and allowEditID
        pool
        .query('SELECT COUNT(*) FROM calendar WHERE calendarID = $1 AND allowEditID = $2', [calendarID, allowEditID])
        .then(pgresult => {
            (Number(pgresult.rows[0].count) === 0) ? res.status(404).end() : res.status(200).end();
        })
        .catch(e => {console.error(e.stack);
            res.status(400).end();}
        )
    }
});

app.post('/api/newEvent', (req, res, next) => {
    let calendarID = req.body.calendarID;
    let eventDescription = req.body.eventDescription;
    let startTime = req.body.startTime;
    let endTime = req.body.endTime;
    let eventID = createID();
    let allowEditID = req.body.allowEditID;
    let currentTimeUTC = moment().utc().format('YYYY-MM-DD H:mm:ss');
    //temporary value for starttime
    pool
    .query('INSERT INTO event (eventID, dateTimeCreated, calendarID, eventDescription, starttime, endtime) VALUES ($1, $2, $3, $4, $5, $6)', 
        [eventID, currentTimeUTC, calendarID, eventDescription, startTime, endTime])
    .then(pgresult => {
        res.status(201).end();
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
        .query('SELECT eventID, dateTimeCreated, calendarID, eventDescription, starttime, endtime FROM event WHERE calendarID = $1', [calendarID])
        .then(pgresult => {
            console.log(pgresult.rows);
            res.status(200).send(pgresult.rows);
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