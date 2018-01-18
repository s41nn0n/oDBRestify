'use strict';
/*jshint esversion: 6 */
/* jshint node: true */


module.exports = function(app) {
    var dbController = require('../database/controller/oracle');
    var oDBAdmin = require('../admin/admin.api');
    
    app.route('/')
      .get(oDBAdmin.doAdminGet)
      ;

    app.route('/rpc/:rpcName')
      . get(dbController.doDBConnectionGet)
      ;

    app.route('/:table')
      .get(dbController.doDBConnectionGet)
      // .put(dbController.doDBConnection)
      // .delete(dbController.doDBConnection)
      ;
};