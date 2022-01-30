const { sendFile } = require('express/lib/response');
const db = require('../util/database');

//class wout construct illeg? why not jst method.
module.exports = class AdminUser { 
    //no try catch
    static findOne(userName) {

        return db.execute('SELECT * FROM adminusers WHERE adminusers.userName = ?', [userName]);
      
  
       }
      };