var http = require('http'); // Import Node.js core module
var fs = require('fs');
const token = require('./request.js');

var server = http.createServer(function (req, res) {   //create web server

  let path = req.url.split("?")[0]
  if (path === '/') { //check the URL of the current request

    res.writeHead(200, {'Content-Type': 'text/html'});
    var readStream = fs.createReadStream('./index.html','utf8');
    readStream.pipe(res);
  }
  else if (path === "/results") {

    res.writeHead(200, { 'Content-Type': 'text/html' });
    readStream = fs.createReadStream('./results.html','utf8');
    readStream.pipe(res);
  }
  else if (req.url === "/answersConfig.js") {
    readStream = fs.createReadStream('./answersConfig.js','utf8');
    res.writeHead(200, {"Content-Type": "text/javascript"});
    readStream.pipe(res);
  }
  else if (req.url === "/search-bar.css") {
    res.writeHead(200, {"Content-Type": "text/css"});
    readStream = fs.createReadStream('./search-bar.css','utf8');
    readStream.pipe(res);
  }
  else if (req.url === "/auth") {
    res.writeHead(200, {"Content-Type": "application/json"});

    let tokenPromise = token.getToken();

    tokenPromise.then(function(result) {
      let authInfo = result;
      // console.log(authInfo)
      res.write(JSON.stringify({
        "token": authInfo[0],
        "expires_at": authInfo[1]
      }));
      res.end();
    });
  }
  else
    res.end('Invalid Request!');

});

server.listen(5000);

console.log('Node.js web server at port 5000 is running..')
