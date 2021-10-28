/*
 * Access to the data base (JSON file to start with)
 * For logins ... 
 *
 */

const fs = require('fs');

exports.db = {
  "dbFilename" : "./site/dbase.json",
  "db" : undefined,
  "loadDB" : function() {
    this.db = JSON.parse(fs.readFileSync(this.dbFilename, 'utf8'));
  },
  "authenticate" : function(user,passwd) {
    entry = this.db.users.find(e => e.user == user);
    return (entry != undefined && entry.password == passwd) ? true : false;
  }
};
