'use strict';
/*jshint esversion: 6 */
/* jshint node: true */


module.exports = {
    user: process.env.NODE_ORACLEDB_USER || "APPS",

    // Instead of hard coding the password, consider prompting for it,
    // passing it in an environment variable via process.env, or using
    // External Authentication.
    password: process.env.NODE_ORACLEDB_PASSWORD || "1",

    // For information on connection strings see:
    // https://github.com/oracle/node-oracledb/blob/master/doc/api.md#connectionstrings
    connectString: process.env.NODE_ORACLEDB_STRING || "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=<HOST>)(PORT=<PORT>))(CONNECT_DATA=(SERVER=DEDICATED)(SID=<SID>)))",

    // Setting externalAuth is optional.  It defaults to false.  See:
    // https://github.com/oracle/node-oracledb/blob/master/doc/api.md#extauth
    externalAuth: process.env.NODE_ORACLEDB_EXTERNALAUTH || false,

    dbWords: ["select", "order", "limit", "offset", "meta", "schema"],

    bannedTables: ["system_params", "sec"],
    tableConfig: [{
        "name": "system_params",
        "restrictedColums": ["CREATEDBY", "CREATED", "PASSWORD*", "SECURITY", "ACTIVATED", "STARTDATE", "ENDDATE","ID_NUMBER", "PASSPORT_ID", "UPDATED"]
    }, "sec"],
    dbSelectAll: process.env.NODE_ORACLEDB_SELECTALL || true,

    respondMeta: process.env.NODE_ORACLEDB_RESPOND_META || false,
    extendedMetaData: process.env.NODE_ORACLEDB_RESPOND_META_EXTENDED || true,
    schema: {
        schemaSpecific: process.env.NODE_ORACLEDB_SCHEMA_SPECIFIC || true,
        allowCrossSchema: process.env.NODE_ORACLEDB_SCHEMA_CROSS || false,
        schemaName: "APPS",
    },

    // poolAlias: 'shpool',
    // Default values shown below
    // externalAuth: false, // whether connections should be established using External Authentication
    poolMax: process.env.O_POOL_MAX || 4, // maximum size of the pool. Increase UV_THREADPOOL_SIZE if you increase poolMax
    poolMin: process.env.O_POOL_MIN || 2, // start with no connections; let the pool shrink completely
    // poolIncrement: 1, // only grow the pool by one connection at a time
    poolTimeout: process.env.O_POOL_TIMEOUT || 2, // terminate connections that are idle in the pool for 60 seconds
    poolPingInterval: process.env.O_PING_INTERVAL || 60, // check aliveness of connection if in the pool for 60 seconds
    queueRequests: true, // let Node.js queue new getConnection() requests if all pool connections are in use
    _enableStats: true,
    // queueTimeout: 60000, // terminate getConnection() calls in the queue longer than 60000 milliseconds
    // poolAlias: 'myalias' // could set an alias to allow access to the pool via a name
    stmtCacheSize: process.env.O_STMT_CACHE_SIZE || 400 // number of statements that are cached in the statement cache of each connection
};