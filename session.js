/*
 * Manage login sessions
 *   Session objects are just ints ... to modify
 *   TODO: newSession should check that the user doesn't 
 *   already have a valid session. Is this possible?
 *   Either switch to use existing session or make sure
 *   it's not possible.
 */

module.exports = {
  validSessions : [],
  sessionCounter : 0,
  newSession : function(userid){this.sessionCounter += 1;
                         this.validSessions.push(
                            {user: userid, session: this.sessionCounter});
                         return this.sessionCounter;},
  isValidSession : function(s){
    //return s in this.validSessions;
    return this.validSessions.find(e => e.session == s);
  },
  removeSession : function(s){
    this.validSessions.filter(e => e.session != s);
  },
  hasSession: (req) => {
    let hs = false;
    if (! ('cookie' in req.headers)) {
      console.log('No session');
      //hs is false;
    } else {
      // Look for "LibSessionId=ddd"
      const reg = /LibSessionId=([0-9]+)/;
      const m = req.headers.cookie.match(reg);
      console.log(`session id : ${m[1]}`);
      // parse to find if there is a sessionId
      // Check that this is a valid session ... i.e. in the list !!
      if (m !== null) {
      // if so return true
        hs = true;
      } else { 
        hs = false;
      }
    }  
    return hs;
  },
  getSessionId: (req) => {
    // Look for "LibSessionId=ddd"
    const reg = /LibSessionId=([0-9]+)/;
    const m = req.headers.cookie.match(reg);
    console.log(`session id : ${m[1]}`);
    return m[1];
  }
};

/*
// Seesion functions
// Return values: NoSession | Session <session data>
// Class variable .... HOWTO in js ?
let sessionCounter = 1; 

class Session {
  constructor() {
  }  
}

class NoSession extends Session {
  constructor() {
    super();
  }
}

class ValidSession extends Session {
  constructor() {
    super();
    this.sessionId = sessionCounter;
    sessionCounter += 1;
  }
}

// Should combine the next two to give (NoSession | SessionId)
// Return bool
const hasSession = function(req) {
  let hs = false;
  if (! ('cookie' in req.headers)) {
    console.log('No session');
    //hs is false;
  } else {
    // Look for "LibSessionId=ddd"
    const reg = /LibSessionId=([0-9]+)/;
    const m = req.headers.cookie.match(reg);
    //console.log(m);
    // parse to find if there is a sessionId
    if (m !== null) {
    // if so return true
      hs = true;
    } else { 
      hs = false;
    }
  }  
  return hs;
}

// Return Session (object) Just an Id for the momennt
// already tested that there is one
const getSession = function(req) {
  const reg = /LibSessionId=([0-9]+)/;
  const m = req.headers.cookie.match(reg);
  return parseInt(m[1]);    
}

// Temporary .... no objects just make a new Id
// Returns an Int
const newSession = function() {
  sessionCounter += 1;
  return sessionCounter;
}
*/
