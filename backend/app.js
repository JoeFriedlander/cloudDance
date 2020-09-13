// ubiKal
// Joe Friedlander
// https://github.com/JoeFriedlander/ubiKal

// -----------------------------------
// Settings and Requires
// -----------------------------------

// Load environmental variables
require('dotenv').config()

// DB Settings
const pg = require('pg')
// Fix to stop auto-convert timestamps on select
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
    credentials: true }
const bodyParser = require('body-parser');
const createID = require('./createID.js')

const app = express();
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors(corsOptions));
// Sometimes cors doesn't work so expressly set headers as well
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.WEBSERVER_URL);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Load other packages
const moment = require('moment');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// -----------------------------------
// API Endpoints and Helper Functions
// -----------------------------------

// API Endpoints

// Creates a new calendar
app.post('/api/calendar', async (req, res, next) => {
    let calendarID = 'ubik' + createID().substring(4);
    let allowEditID = 'edit' + createID().substring(4)
    let currentTimeUTC = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    try {
        let result = await pool.query('INSERT INTO calendar(calendarID, allowEditID, dateTimeCreated) VALUES($1, $2, $3)', 
            [calendarID, allowEditID, currentTimeUTC]);
        //If successful, send the new calendar info
        res.status(201).send(JSON.stringify({calendarID:calendarID, allowEditID:allowEditID, dateTimeCreatedUTC:currentTimeUTC}));
    } 
    catch (err) {
        console.log(err);
        res.status(400).end();
    }
});

// Deletes an existing calendar
app.delete('/api/calendar', async (req, res, next) => {
    let calendarID = req.query.calendarID;
    let allowEditID = req.body.allowEditID;

    let authorizationValid = authorize(calendarID, allowEditID);
    if (authorizationValid) {
        try {
            // If 'RETURNING' gives row(s) then something was deleted
            let result = await pool.query('DELETE FROM calendar WHERE calendarID = $1 RETURNING *', 
                [calendarID]);
            result.rows[0] ? res.status(200).end() : res.status(404).end()
        }
        catch (err) {
            console.log(err);
            res.status(500).end();
        }
    }
    else {
        res.status(403).end();  
    }
});

// Gets info for an existing calendar and optionally an allowEditID
app.get('/api/calendar', async (req, res, next) => {
    let calendarID = req.query.calendarID;
    let allowEditID = req.query.allowEditID;

    // If only calendarID provided
    if(!allowEditID) {
        // Check that the calendar exists
        try {
            let result = await pool.query('SELECT COUNT(*) FROM calendar WHERE calendarID = $1', 
                [calendarID])
            if (Number(result.rows[0].count) === 0) {
                res.status(404).end()
            } 
            // If calendar does exist, return calendar info
            else { 
                let getCalendarResult = await pool.query('SELECT calendarID, allowEditID, dateTimeCreated FROM calendar WHERE calendarID = $1 AND allowEditID = $2', 
                    [calendarID, allowEditID]);
                res.status(200).send(getCalendarResult.rows[0]);
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).end();
        }
    }
    // If both calendarID and allowEditID provided
    else {
        // Check that the calendarID and allowEditID match up using the authorize function
        let authorizationValid = await authorize(calendarID, allowEditID);
        if (authorizationValid) {
            try {
                let getCalendarResult = await pool.query('SELECT calendarID, allowEditID, dateTimeCreated FROM calendar WHERE calendarID = $1 AND allowEditID = $2', 
                    [calendarID, allowEditID]);
                res.status(200).send(getCalendarResult.rows[0]);
            }
            catch (err) {
                console.log(err);
                res.status(500).end();
            }
        }
        else {
            res.status(403).end();  
        }
    }
});

// Creates a new event
app.post('/api/event', async (req, res, next) => {
    let calendarID = req.body.calendarID;
    let eventDescription = DOMPurify.sanitize(req.body.eventDescription);
    let startTime = req.body.startTime;
    let endTime = req.body.endTime;
    let eventID = createID();
    let allowEditID = req.body.allowEditID;
    let currentTimeUTC = moment().utc().format('YYYY-MM-DD HH:mm:ss');

    let authorizationValid = await authorize(calendarID, allowEditID);
    if (authorizationValid) {
        try {
            let result = await pool.query('INSERT INTO event (eventID, dateTimeCreated, calendarID, eventDescription, starttime, endtime) VALUES ($1, $2, $3, $4, $5, $6)', 
                [eventID, currentTimeUTC, calendarID, eventDescription, startTime, endTime]);
            res.status(201).end();
        }
        catch (err) {
            console.log(err);
            res.status(500).end();
        }
    }
    else {
        res.status(403).end();  
    }
});

// Deletes an event
app.delete('/api/event', async (req, res, next) => {
    let eventID = req.query.eventID;
    let allowEditID = req.body.allowEditID;
    
    let authorizationValid = await authorize(calendarID, allowEditID);
    if (authorizationValid) {
        try {
            let result = await pool.query('DELETE FROM event WHERE eventID = $1 RETURNING *', [eventID]);
            result.rows[0] ? res.status(200).end() : res.status(404).end()
        }
        catch (err) {
            console.log(err);
            res.status(500).end();
        }
    }
    else {
        res.status(403).end();  
    }
});

// Gets all of the events associated with a calendar
app.get('/api/events', async (req, res, next) => {
    let calendarID = req.query.calendarID;
    try {
        let result = await pool.query('SELECT eventID, dateTimeCreated, calendarID, eventDescription, starttime, endtime FROM event WHERE calendarID = $1', [calendarID])
        res.status(200).send(result.rows);
    }
    catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

// Fallback route
app.use('/', (req, res, next) => {
    res.status(404).end();
});

// Helper Functions

// Checks that calendarID matches up with corresponding allowEditID
async function authorize(calendarID, allowEditID) {
    try {
        //If they don't match up then count is 0
        let result = await pool.query('SELECT COUNT(*) FROM calendar WHERE calendarID = $1 AND allowEditID = $2', [calendarID, allowEditID])
        return (Number(result.rows[0].count) === 0) ? false : true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT);