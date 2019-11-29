//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan');


Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);

// Express body parser
app.use(express.urlencoded({ extended: true }));

app.use(morgan('combined'))

const url_env = process.env.HTTP_TEST_SERVER;

 var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
   
     mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

console.log(process.env.PORT );
console.log(process.env.OPENSHIFT_NODEJS_PORT);
console.log(process.env.IP);
console.log(process.env.OPENSHIFT_NODEJS_IP );


if (mongoURL == null) {
  var mongoHost, mongoPort, mongoDatabase, mongoPassword, mongoUser;
  // If using plane old env vars via service discovery
  if (process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
    mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'];
    mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'];
    mongoDatabase = process.env[mongoServiceName + '_DATABASE'];
    mongoPassword = process.env[mongoServiceName + '_PASSWORD'];
    mongoUser = process.env[mongoServiceName + '_USER'];

  // If using env vars from secret from service binding  
  } else if (process.env.database_name) {
    mongoDatabase = process.env.database_name;
    mongoPassword = process.env.password;
    mongoUser = process.env.username;
    var mongoUriParts = process.env.uri && process.env.uri.split("//");
    if (mongoUriParts.length == 2) {
      mongoUriParts = mongoUriParts[1].split(":");
      if (mongoUriParts && mongoUriParts.length == 2) {
        mongoHost = mongoUriParts[0];
        mongoPort = mongoUriParts[1];
      }
    }
  }

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
  }
}
var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};

//dashboard Page
app.get('/', function (req, res) {
  res.render("welcome.html")
});

//Display Events
app.get('/events', function (req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "*");
  res.render('events.html');
});

//adding New Events
app.get('/addNewEvents', function (req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "*");
  res.render('addNewEvents.html');
});

//Login Page
app.get('/login', function (req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "*");
  res.render('login.html');
 
});


//Login Validation
app.post('/login', function (req, res) {
  const userName = req.body.userName;
  const password = req.body.password
  
  if (userName == "RamyaThiru" && password == "ramya") {
    res.render("dashboard.html");
  }
  else{
    console.log("validation Error");
    res.render('login.html')
  }
});

//Adding new Events
app.post('/addNewEvents', function (req, res) {
  const reqobj = {
    id : req.body.id,
    organizationId : req.body.organizationId,
    departmentId : req.body.departmentId,
    employeeName : req.body.employeeName,
    eventName : req.body.eventName,
    date : req.body.date
  }
  console.log("Response which is send" +reqobj);
  const fetch = require("node-fetch");
  return fetch(url_env, {
    method: 'POST',
    body: JSON.stringify({
      id : req.body.id,
      organizationId : req.body.organizationId,
      departmentId : req.body.departmentId,
      employeeName : req.body.employeeName,
      eventName : req.body.eventName,
      date : req.body.date
    }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': '*'
    }
}).then(() => res.render("dashboard.html"))
.catch(err => console.log(err));
});

//cancel
app.get('/dashboard', function (req, res) {
  
  res.render('dashboard.html');
 
});


// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port,ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
