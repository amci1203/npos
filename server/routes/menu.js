'use strict'

var config = require('../../config'),
    db = require('mongoose-simpledb').db,
    jwt = require ('../helpers/jwt'),
    secret = config.secret;
module.exports = function (app, express) {
    var router = express.Router();
//    router.use( function (req, res, next) {
//        var token = req.body.token || req.headers['x-access-token'];
//        if (token) var decoded = jwt.verifyToken(token);
//        if (decoded.position === 'employee') res.status(401).json({
//            success: false,
//            message: 'Current user is unauthorized to make/modify receipts'
//        });
//        else next();
//    });
    router.post('/seed', function (req, res) {
        var data = require('../../data/menuSeed');
        data.forEach(function (category) {
            var newCategory = new db.Menu(category);
            newCategory.save(function (err, result) {
                if (err) res.status(500);
                else console.log(result)
            })
            res.send('Done');
        })
    })
    router.get('/all', function (res, req) {
        db.Menu.getMenu(function (err, items) {
            if (!err) res.json(items);
            else console.log(err);
        })
    });
    router.get('/:category', function (req, res) {
        Menu.find({category: req.params.category}, 'items', function (err, items) {
            if (err) res.status(500).json({success: false, message: 'Error'})
            res.json(items);
        })
    });
    router.post('/new', function (req, res) {
        var newCategory = new Menu({
            genre: req.body.genre,
            category: req.body.category
        });
        newCategory.save(function (err) {
            if (err) res.status(500).send('There was an internal error. Refresh the page and try again.');
            else console.log('Successfully added new category');
        });
    });
    router.post('/:category/new', function (req, res) {
        Menu.update(
            {category: req.params.category},
            {$push: {
                items: {
                    name: req.body.item,
                    price: req.body.price
                }
            }},
            {upsert: true},
            function (err) {
                if (err) res.status(500).send('There was an internal error. Refresh the page and try again.');
                else console.log('Successfully added new item');
            }
        )
    });

    return router;
}
