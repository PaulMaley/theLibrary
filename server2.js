/*
 * Server code ... run on Heroku
 *
 */

const http = require('http');
const process = require('process');
const routes = require('./route.js');
const session = require("./session.js");
//const fs = require('fs');

const hostname = '127.0.0.1'; 

/* Environment variable set by Heroku */
const port = process.env.PORT;

/* 
 * Main dispatch code 
 * - Unpack request
 * - Check session
 * - dispatch accordingly
 *
 * Request method will be "put" with login data or load request 
 * and "get" for all other requests
 */
reqListener = (req,res) => {
  // Parse the request (type: IncomingMessage)
  const {headers, method, url} = req;
  console.log(`method: ${method}`);
  console.log(`url: ${url}`);
  let mURL = new URL(req.url, `http://${req.headers.host}`);
  console.log(mURL);
  let path = mURL.pathname.replace(/^\/|\/$/g, '');
  console.log(path);
  //console.log(req);
 
  // Collect together body data (POST requests)
  let body = []; 
  req.on('data', (chunk) => {body.push(chunk);}); 
 
  // Check request for valid session 
  const sessionFlag = session.session.hasSession(req);  



  // BUGS TO FIX 
  // 1) if you go to the login page with a session already
  //    valid you get stuck there !!!!
  // 2) Add session time out or log off
  // 3) change order of if(sessionFlag) and req.on() ..
  //    so as we treat the body correctly in both cases



  // Dispatch
  if (sessionFlag) {
    // Valid session - execute request
    req.on('end', () => {
      if (path in routes.routes) {
        routes.routes[path]({url: mURL},res);
      } else {  
        routes.routes['unknown']({},res);
      }});
    } else {
    // No valid session - execute login
    req.on('end', () => {
      body = Buffer.concat(body).toString();
      console.log(body);
      if (method === 'GET' && url === '/login') {
        routes.routes['login']({loginData : undefined},res);
      } else if (method === 'POST' && url === '/login') {
      // Verify login - Just accept for the mo
      if (true) {
        // make a new session and add to response
        const s = session.session.newSession();
        res.setHeader('Set-Cookie','LibSessionId='+s);  
        routes.routes['bookshelves']({},res);
      } else { 
        // else resend login page with fail notice
        // REMOVE NEXT LINE
        routes.routes['login']({loginData : undefined, 
                                reason : "Failed login"},res);
        }
      } else {
        routes.routes['unknown']({},res);
      }
    });
  }
}

/*
 * Start the server 
 */
const server = http.createServer(reqListener);
server.listen(port, hostname,
  () => {console.log(`Svr starting: http://${hostname}:${port}`)});
