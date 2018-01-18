'use strict';
/*jshint esversion: 6 */
/* jshint node: true */


var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

const appConf = {
    "port": process.env.PORT || 3000,
};


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });


var routes = require('./api/routes/routes'); //importing route
routes(app); //register the route


app.listen(appConf.port);


console.log('RESTful API server started on: ' + appConf.port);