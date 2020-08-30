//testing unhandled exception log for troubleshooting
process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
  });

//Load environmental variables
require('dotenv').config()

// API Settings
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const createID = require('./createID.js')
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// DB Settings


//API
app.get('/api/test', (req, res, next) => {
    res.send('test reached');
});

app.post('/api/newCalendar', (req, res, next) => {
    let calendarID = createID();
    connection.query('INSERT INTO calendar (calendarID) VALUES (' + 
                        connection.escape(calendarID) + 
                    ')', 
        function (error, results, fields) {
        if (error) throw error;
    });
    res.send(calendarID);
});

app.delete('/api/deleteCalendar', (req, res, next) => {
    let calendarID = req.query.calendarID;
    connection.query('DELETE FROM calendar WHERE calendarID =' + 
                        connection.escape(calendarID),
        function (error, results, fields) {
        if (error) throw error;
    });
    //should inform if not exists?
    res.send(calendarID + ' deleted');
});

app.get('/api/calendarExists', (req, res, next) => {
    connection.query('SELECT COUNT(*) FROM calendar WHERE calendarID =' + 
                        connection.escape(req.query.calendarID),
        function (error, results, fields) {
        if (error) throw error;
        try {
            results = JSON.parse(JSON.stringify(results[0]["COUNT(*)"]));
        }
        catch {
            console.log('error going from ' + req.query.calendarID + ' to ' + results[0])
        }
        results === 0 ? results = false : results = true;
        res.send(results);
    });
});

app.get('/api/loadEvents', (req, res, next) => {
    connection.query('SELECT eventdescription, starttime, length FROM event WHERE calendarID =' + 
                        connection.escape(req.query.calendarID),
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    });
});

app.post('/api/createEvent', (req, res, next) => {
    console.log(req.body);
    let calendarID = req.body.calendarID;
    let eventDescription = req.body.eventDescription;
    let starttime = req.body.starttime;
    let length = req.body.length;
    connection.query('INSERT INTO event (calendarID, eventDescription, starttime, length) VALUES (' + 
                        connection.escape(calendarID) + ',' + 
                        connection.escape(eventDescription) + ',' + 
                        connection.escape(starttime) + ',' + 
                        connection.escape(length) + 
                        ')', 
        function (error, results, fields) {
        if (error) throw error;
    });
    res.send({"calendarID": calendarID, "eventDescription": eventDescription});
});

app.use('/', (req, res, next) => {
    //always runs
    res.send('ok main page');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);