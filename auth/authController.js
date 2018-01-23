var express = require('express');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');


router.post('/register', function(req,res){
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  User.create({
    name: req.body.name,
    email : req.body.email,
    password: hashedPassword
  },
  function(err, user){
    if(err) return res.status(500).send("There was a problem registering the user.")

    // create a token
    var token = jwt.sign({ id: user.id}, config.secret, {
      expiresIn: 86400 //expires in 24 hours
    });

    res.status(200).send({ auth: true, token: token})
  });
});


router.get('/me', function(req,res){
  var token = req.headers['x-access-token'];

  if(!token) return res.status(401).send({ auth: false, message: 'No token provided.'});

  jwt.verify(token, config.secret, function(err,decoded){
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenicate token.'});

    res.status(200).send(decoded);
  });
});


module.exports = router;
