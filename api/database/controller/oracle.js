'use strict';
/*jshint esversion: 6 */
/* jshint node: true */

var async = require('async');
var oracledb = require('oracledb');
var dbConfig = require('../conf/dbconf.js');
var csv = require('express-csv');

var pool;

// const dbConf = {
//     "": process.env.TWITTER_USER || 'username'
// };

function init() {
    oracledb.outFormat = oracledb.OBJECT;

    oracledb.createPool({
            user: dbConfig.user,
            password: dbConfig.password,
            connectString: dbConfig.connectString,
            // poolAlias: 'shpool',
            // Default values shown below
            externalAuth: false, // whether connections should be established using External Authentication
            poolMax: dbConfig.poolMax, // maximum size of the pool. Increase UV_THREADPOOL_SIZE if you increase poolMax
            poolMin: dbConfig.poolMin, // start with no connections; let the pool shrink completely
            // poolIncrement: 1, // only grow the pool by one connection at a time
            poolTimeout: dbConfig.poolTimeout, // terminate connections that are idle in the pool for 60 seconds
            poolPingInterval: dbConfig.poolPingInterval, // check aliveness of connection if in the pool for 60 seconds
            queueRequests: dbConfig.queueRequests, // let Node.js queue new getConnection() requests if all pool connections are in use
            _enableStats: dbConfig._enableStats,
            // queueTimeout: 60000, // terminate getConnection() calls in the queue longer than 60000 milliseconds
            // poolAlias: 'myalias' // could set an alias to allow access to the pool via a name
            stmtCacheSize: dbConfig.stmtCacheSize // number of statements that are cached in the statement cache of each connection
        },
        function (err, DBpool) {
            if (err) {
                console.error("createPool() error: " + err.message);
                return;
            }
            pool = DBpool;
        }
    );
}


exports.doDBConnectionGet = function (req, res) {
    var stopRequest = false;

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


    // res.links({
    //     next: 'http://api.example.com/users?page=2',
    //     last: 'http://api.example.com/users?page=5'
    // });


    /*
        This needs to do some smart stuff to get the sql.
    */
    if (!req.params.table) {
        res.status(400).send();
        return;
    }

    if (dbConfig.bannedTables.forEach(bannedName => {
            if (new RegExp(bannedName).test(req.params.table)) {
                stopRequest = true;
                res.status(403).send('');
                return;
            }
            if (stopRequest) {
                return;
            }
        }));
    if (stopRequest) {
        return;
    }

    var select = '';
    var sql = '';
    if (req.params.table == "favicon.ico") {
        res.status(404).send('');
        return;
    }
    if (req.query.select) {
        select = req.query.select;
    } else {
        if (dbConfig.dbSelectAll) {
            select = "*";
        } else {
            stopRequest = true;
            res.status(428).send('You cannot select all data from a table, please specify colums to select');
            return;
        }
    }

    if (dbConfig.schema.schemaSpecific) {
        if (dbConfig.schema.allowCrossSchema) {
            if (req.query.schema) {
                req.params.table = req.query.schema + "." + req.params.table;
            } else {
                req.params.table = dbConfig.schema.schemaName + "." + req.params.table;            
            }
        } else {
            req.params.table = dbConfig.schema.schemaName + "." + req.params.table;
        }
    }

    sql = 'SELECT ' + select + ' FROM ' + req.params.table;

    for (var propName in req.query) {
        if (req.query.hasOwnProperty(propName)) {
            console.log(propName, " = ", req.query[propName]);
        }
    }

    if (req.query.order) {
        sql += ' ORDER BY ';
        const leng = req.query.order.split(",").length;
        var count = 0;
        req.query.order.split(",").forEach(orders => {
            count++;
            orders.split(".").forEach(items => {
                if (items.toUpperCase() == 'NULLSFIRST') {
                    items = 'NULLS FIRST';
                } else if (items.toUpperCase() == 'NULLSLAST') {
                    items = 'NULLS LAST';
                }

                if (items !== '') {
                    sql += items + ' ';
                }
            });
            if (leng > 1) {
                if (count !== leng)
                    sql += ', ';
            }
        });
    }

    if (req.query.limit) {
        if (req.query.offset) {
            sql += ' OFFSET ' + req.query.offset + ' ROWS FETCH NEXT ' + parseInt(req.query.limit) + ' ROWS ONLY ';
        } else {
            sql += ' FETCH FIRST ' + parseInt(req.query.limit) + ' ROWS ONLY';
        }
    }

    // res.json({
    //             "success":true, 
    //             "params":req.params["table"],
    //             "getters":req.query
    //         });
    if (stopRequest) {
        return;
    }
    res.header("O_SQL", sql);

    pool.getConnection(function (err, connection) {
        if (err) {
            // console.error("getConnection() error", err);
            if (err == 'YES') {
                return;
            }
            res.status(500).send('DB Not connected');
            // handleError(res, "getConnection() error", err);
            return;
        }

        /*
            Still to Impliment Better
        */
        connection.clientId = "Chris";
        //What module are we working in?
        connection.module = "End-to-end example";
        //What are we doing?
        connection.action = "Query departments";

        var resultSet;

        res.format({
            text: function () {
                // res.status(415).send('Unsupported').end();
                // err = 'YES';
                // return;
                oracledb.outFormat = oracledb.OBJECT;
                
            },
            csv: function () {
                //We want the output as a Array Formay and not the Object.
                oracledb.outFormat = oracledb.ARRAY;
            },

            json: function () {
                oracledb.outFormat = oracledb.OBJECT;

            },

            'default': function () {
                oracledb.outFormat = oracledb.OBJECT;

            }
        });

        // console.error("Connection");


        console.log("Connections open: " + pool.connectionsOpen);
        console.log("Connections in use: " + pool.connectionsInUse);
        console.log(sql);
        connection.execute(
            sql, // bind variable value
            [], {
                extendedMetaData: dbConfig.extendedMetaData
            },
            function (err, result) {
                // console.log("here");
                if (err) {
                    console.error("execute() error release() error", err);
                    connection.close(function (err) {
                        if (err) {
                            // Just logging because handleError call below will have already
                            // ended the response.
                            res.status(400).send('Error executing -> ', err);
                            console.error("execute() error release() error", err);
                        }
                        res.status(400).send('Error executing');
                    });
                    // handleError(res, "execute() error", err);
                    return;
                } else {
                    doRelease(connection);
                    // result.metaData = null;

                    if (result.rows && result.rows.length == 0) {
                        res.status(406).send(
                            res.json({
                                message: "",
                                details: ""
                            })
                        );

                    }

                    // resultSet = result.rows;

                    res.format({
                        html: function () {
                            res.send('<p>hey</p>');
                        },
                        text: function () {
                            res.send('<p>hey</p>');
                        },

                        csv: function () {
                            var r = [];
                            r[0] = [];

                            result.metaData.forEach(element => {
                                r[0].push(element.name);
                            });

                            result.rows.forEach(element => {
                                r.push(element);
                            });

                            res.csv(
                                r
                            );
                        },

                        json: function () {
                            returnJSON(req, res, dbConfig, result);
                        },

                        'default': function () {
                            returnJSON(req, res, dbConfig, result);
                        }
                    });
                }
            }
        );
    });
};

function returnJSON(req, res, dbConfig, result) {

    var doMeta = false;
    if (req.query.meta != undefined) {
        doMeta = (req.query.meta === 'true');
    } else {
        doMeta = dbConfig.respondMeta;
    }

    if (doMeta) {
        res.json(
            result
        );
    } else {
        res.json(
            result.rows
        );
    }
    
}


function doRelease(connection) {
    connection.close(
        function (err) {
            if (err) {
                console.error(err.message);
            }
        });
}


process
    .on('SIGTERM', function () {
        pool.close();
        console.log("\nTerminating");
        process.exit(0);
    })
    .on('SIGINT', function () {
        pool.close();
        console.log("\nTerminating");
        process.exit(0);
    });

init();