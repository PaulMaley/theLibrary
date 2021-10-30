/*
 * Routing table and functions
 */
const fs = require('fs');

exports.routes = {
  home: function(data, res) {
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
    if (data.loginData == undefined) {
      console.log(`Login: data=${data} 1`);
      // return the login page
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      let pageData = fs.readFileSync('./site/login.html');
      res.end(pageData);
    } else {
      console.log(`Login: data=${data} 2`);
      // Process the login data
      // Correct login ?
      //   Make a new session Id add to the header
      //   data['sessionId'] = newSession();
      //    res.setHeader('Set-Cookie', `LibSessionId=${data.sessionId}`);
      this.bookshelves({},res);
    }
  },
  request: function(data, res) {
   // Need access to the session data !!
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Request sent to librarian -- you wish!!\n');  
  },
  bookshelves: function(data, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    let pageData = fs.readFileSync('./site/catalog.html');
    res.end(pageData);
  },
  // Request for resource ... required resource is in search params
  resource: function(data, res) {
    console.log("Resource request")
    // Read the file synchronously ... it's very small !!
    // OK this is no longer true for the images !!!!!! TO FIX
    // Shelves are only resource for the moment ... to rethink
    // Apart from the catalog page  FUCKWIT. 
    shelfNo = data.url.searchParams.get('shelf');
    console.log(`Shelf no ${shelfNo} requested`);
    try {
      //const page = fs.readFileSync('./'+path, 'utf8');
      res.statusCode = 200;
      // image
      console.log("Image requested");
      let imData = fs.readFileSync('./site/shelves/shelf'+shelfNo+'.jpeg');
      res.setHeader('Content-Type', 'jpeg');
      res.end(imData);
    } catch (err) {
      console.error(err);
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Page not found dude! An unholy mess.\n');  
    }
  },
  image: function(data, res) {
    console.log("Image request")
    console.log("Why am I here?")
    // Read the file synchronously ... it's very small !!
    // OK this is no longer true for the images !!!!!! TO FIX
    // Shelves are only resource for the moment ... to rethink
    // Apart from the catalog page  FUCKWIT. 
    img = data.url.searchParams.get('image');
    console.log(`Image ${img} requested`);
    try {
      //const page = fs.readFileSync('./'+path, 'utf8');
      res.statusCode = 200;
      // image ATTN: Type 
      console.log("Image requested");
      let imData = fs.readFileSync('./site/shelves/' + img);
      res.setHeader('Content-Type', 'jpeg');
      res.end(imData);
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

