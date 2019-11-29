const express = require('express')
const router = express.Router();



//Login Validation
router.post('/login', function (req, res) {
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
  

//Display Events
router.get('/viewevents', function (req, res) {
    res.setHeader("Access-Control-Allow-Credentials", "*");
    res.render('events.html');
  });
  
//adding New Events
router.get('/addNewEvents', function (req, res) {
    res.setHeader("Access-Control-Allow-Credentials", "*");
    res.render('addNewEvents.html');
  });  

//Adding new Events
router.post('/addNewEvents', function (req, res) {
    const reqobj = {
      id : req.body.id,
      organizationId : req.body.organizationId,
      departmentId : req.body.departmentId,
      employeeName : req.body.employeeName,
      eventName : req.body.eventName,
      date : req.body.date
    }
    console.log("Response which is send" +reqobj);
    console.log(JSON.stringify(reqobj));

    const fetch = require("node-fetch");
    return fetch('http://employee-events-employee-events.192.168.99.105.nip.io/employee/', {
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
  }).then(() => res.send("Succesfuully Posted"))
  .catch(err => console.log(err));
  });
 
// error handling
router.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send('Something bad happened!');
  });
    


module.exports = router;