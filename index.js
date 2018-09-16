const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const worker = require('./controllers/wokers');

//worker.start();
// Get our API routes
const api = require('./routes/api');

const app = express();

console.log("Body parser called");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,authorization,access-control-allow-origin");
  res.header("Access-Control-Allow-authorization", "*");
  next();
});

app.use(function(req, res, next) {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", 0);
  next();
  });

app.disable('etag');


app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

app.get('*', function(req, res){
  res.setHeader('Last-Modified', (new Date()).toUTCString());
  res.sendFile(path.join(__dirname, 'src/index.html'));
});

server.listen(port, function(){
  console.log(new Date());
  console.log(port);
});