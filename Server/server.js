var express = require('express');
var bodyParser = require('body-parser');

var env = require('dotenv/config');
var path = require('path');
var uuid = require("uuid/v4");

var app = express();

app.use( bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send('1ance Test Server');
});

app.listen(5500, function(){
    console.log('Server Started on Port 5500..');
});

var mysql = require('mysql');

var db = mysql.createConnection({
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT,
  database : process.env.RDS_NAME
});

db.connect(function(error) {
  if (error) {
    console.error('Database connection failed: ' + error.stack);
    return;
  }

  console.log('Connected to database.');
});


//Auth Middleware
function authMiddleware(req,res,next) {
	if(!req.query.auth) {
		return res.status(400).json({message: "unauthorized access"});
	}

	//Check this token against the database
	var dbQuery = "select * from Users where AuthToken = ?";
	db.get(dbQuery, [req.query.auth], function(err, user) {
		if(err) {
			return res.status(500).json({message: "Internal server error"});
		}
		if(!user) {
			return res.status(400).json({message: "unauthorized access"});
		}
        // check if expired
        var currentTime = new Date(); 
		var tokenTimestamp = new Date(parseInt(user.AuthTokenIssued)); 

		var millisInHour = 1000 * 60 * 60; 
		if(currentTime - tokenTimestamp > millisInHour) {
			return res.status(400).json({message: "auth token expired"});
		}
		return next();
	});
};

// Add User into User credentials Table
app.get('/signUp', (req, res) => {
    var email = 'purduepete@purdue.com'; 
    var password = "pass123";
    let user = {
        Email: email, 
        Password: password
    };

    let query = 'INSERT INTO Users SET ?';
    
    db.query(query, user, (error, response) => {
        console.log(response);
        
        if(error) {
            res.send(JSON.stringify({
                "status": 500, 
                "error": error, 
                "response": null,
                "message": "Internal server error"
            }));
        }
        
        else {
            res.send(JSON.stringify({
                "status": 200, 
                "error": null, 
                "response": response,
                "message": "success"
            }));
        }
    });
});


// Get list of Posts
app.get('/getPosts', (req, res) => {
    let query = 'SELECT * FROM Posts';
    
    db.query(query, (error, response) => {
        console.log(response);
        
        if(error) {
            res.send(JSON.stringify({
                "status": 500, 
                "error": error, 
                "message": "Internal server error",
                "response": null
            }));
        }
        
        else {
            res.send(JSON.stringify({
                "status": 200, 
                "error": null, 
                "response": response,
                "message": "success"
            }));
        }
    });
});

//Login
app.post('/login', function(req, res) {
	var Email = req.body.Email;
	var Password = req.body.Password;

	if(!Email || !Password) {
		return res.status(401).json({message: "invalid_credentials"});
	}

	var dbQuery = "select * from Users where Email = ? and Password = ?";
	var requestParams = [Email, Password];

	db.get(dbQuery, requestParams, function(err, user) {
		if(err) {
			return res.status(500).json({message: "Internal server error"});
		}

		if(user == null) {
			return res.status(401).json({message: "invalid_credentials"});
		}

		// valid user, issue them an auth token
		var authToken = uuid();
		var currentTime = new Date().getTime().toString();
		// Store the auth token in the database
        db.run("UPDATE Users SET AuthToken = ?, AuthTokenIssued = ? WHERE Email = ?",[authToken,currentTime,Email],function(err){
			if(err) {
				return res.status(500).json({message: "Internal server error"});
			}
			return res.status(200).json({message: "success", authToken: authToken});
		});
	});
});
