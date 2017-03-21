'use strict';

var config = require('../../config'),
    jwt = require('../helpers/jwt'),
    db = require('mongoose-simpledb').db;
module.exports = function(app, express) {
    var router = express.Router();
    //returns all DB users
    router.get('/all', function (req, res) {
        db.User.allUsers(function (err, users) {
            res.json(users);
        })
    });
    router.post('/login', function (req, res) {
        db.User.findOne({name: req.body.name}).exec(function (err, user) {
            if (err) res.status(500);
            if (!user) res.json({
                success: false,
                message: 'User does not exist'
            });
            else {
                var correct = user.verifyPassword(req.body.password);
                if (correct) {
                    console.log('Password correct');
                    var token = user.generateToken();
                    console.log('Token generated');
                    res.json({success: true, message: 'Login Successful', token: token});
                }
                else res.json({success: false, message: 'Incorrect Password'});
            }
        })
    });
    router.post('/signup', function (req, res) {
        var user = new db.User({
            name: req.body.name,
            sex: req.body.sex,
            role: req.body.role,
            password: req.body.password
        });
        user.save(function (err, newUser) {
            if (err) res.json({success: false, message: 'There was an error with creating the new user'});
            else {
                res.json({success: true, message: 'User successfully created!'});
            };
        });
    });
//    router.use(function (req, res, next) {
//        var token = req.body.token || req.headers['x-access-token'];
//        if(token) {
//            var verifiedToken = jwt.verifyToken(token);
//            if (!verifiedToken) res.status(401).json({success: false, message: 'Authentication Failed'});
//            req.token = verifiedToken;
//            next();
//        }
//        else res.status(403).json({success: false, message: 'No Token Found'})
//    });
    router.get('/currentUser', function (req, res) {
        console.log('Getting current user');
        console.log(req.token);
        res.json(req.token);
    });
    router.post('/home', function (req, res) {

    });

    return router;
}
