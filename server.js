/*
 * Haskell web serers are too fucking hard ... back to js
 * (But, man, where are the fucking types ????)
 */

// For https
//const http = require('https');

const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1'; 
const port = process.env.PORT;

// For https
const httpsOptions = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

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

// This function is called anytime a request is received
reqListener = (req,res) => {
  // Parse the request (type: IncomingMessage)
  let mURL = new URL(req.url, `http://${req.headers.host}`);
//  console.log(mURL);
//  console.log(req.url);
//  console.log(req.headers);
  // WTF does this do ??? and why did I put it there ?
  let path = mURL.pathname.replace(/^\/|\/$/g, '');
  console.log(path);

  // For holding session data (and other stuff ?)
  data = {};

  // Get session status - first visit no valid cookie
  if (! hasSession(req)) {
    // Create a session and redirect to login page
    data['sessionId'] = newSession();
    path = 'login';
  } else {
    // Has session
    data['sessionId'] = getSession(req); 
    // So we have requestd route and a sessionId
    // What is the logic/achitecture for using them?
  }

  // Now I need to shove stuff into an event queue ?
  req.on("data", function() {/*Do nothing*/});

  // Routing - depends on URL but also session info
  req.on("end", function() {
    // Route the request
    if (path in routes) {
      routes[path](data,res);
    } else if (/^site/.test(path)) {
      // This is a direct access to a file 
      routes['site'](path,data,res);
    } else {
      routes['unknown'](data,res);
    }
  });
}

log = () => {console.log(`Svr starting: http://${hostname}:${port}`)}

const server = http.createServer(httpsOptions, reqListener);
server.listen(port, hostname, log);

die = () => {server.close(() => {console.log('Svr terminating')})}
process.on('SIGTERM', die);

// Routing ...
// Dictionary of route functions 
// What is <data> ?
const routes = {
  root: function(data, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Root ...  man!\n');  
  },
  contact: function(data, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`Contact ...  man!\nYour Id: ${data.sessionId}\n`);  
  },
  login: function(data, res) {
    // data contains a (new) sessionId - add to the header
    res.setHeader('Set-Cookie', `LibSessionId=${data.sessionId}`);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Enter your id and password man!\n');  
  },
  site: function(path,data, res) {
    // Read the file synchronously ... it's very small !!
    // OK this is no longer true for the images !!!!!! TO FIX
    try {
      //const page = fs.readFileSync('./'+path, 'utf8');
      res.statusCode = 200;
      if (/\.jpeg$/.test(path)) {
        // image
        let data = fs.readFileSync('./'+path);
        res.setHeader('Content-Type', 'text/jpeg');
        res.end(data);
      } else {
        // html 
        let data = fs.readFileSync('./'+path,'utf8');
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      }
    } catch (err) {
      console.error(err);
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Page not found dude! An unholy mess.\n');  
    }
  },
  unknown: function(data, res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Page not found dude!\n');  
  }
}

