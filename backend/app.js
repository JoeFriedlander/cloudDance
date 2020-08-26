const fs = require('fs');
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
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'removed for security',
  database : 'ubikalDB'
});
connection.connect();

//Stream to write calendars to file
var calendarFileStream = fs.createWriteStream("calendars.txt", {flags:'a'});

//API
app.post('/api/createCalendar', (req, res, next) => {
    console.log(req.body);
    let calendarID = createID();
    connection.query('INSERT INTO calendar (calendarID) VALUES (' + 
                        connection.escape(calendarID) + 
                    ')', 
        function (error, results, fields) {
        if (error) throw error;
    });
    calendarFileStream.write(calendarID + '\r\n');
    res.send(calendarID);
});

app.get('/api/allCalendars', (req, res, next) => {
    fs.readFile('./calendars.txt', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        res.send(data.split('\r\n'));
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
    calendarFileStream.write(calendarID + ' ' + eventDescription + '\r\n');
    res.send({"calendarID": calendarID, "eventDescription": eventDescription});
});

app.use('/', (req, res, next) => {
    //always runs
    res.send('ok main page');
});

app.listen(3000);