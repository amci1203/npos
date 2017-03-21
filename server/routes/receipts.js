'use strict'

var config = require('../../config'),
    jwt = require ('../helpers/tokens'),
    secret = config.secret,
    db = require('mongoose-simpledb').db;
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
    //Get all receipts
    router.get('/all', function (req, res) {
        Receipt.find({}).sort()
    })
    //Save new receipt
    router.post('/new', function (req, res) {
        var receipt = new Receipt(req.body.receipt);
        receipt.save(function (err, record) {
            if (err) res.json({
                success: false,
                message: 'There was an error with creating the new receipt',
                error: err
            });
            else res.json({
                success: true,
                message: 'Receipt successfully saved',
            });
        })
    });
    //Auxillary route; serves payment options to front-end
    router.get('_/payment_options', function (req, res) {
        res.json(config.paymentOptions);
    })
    //Get open tables for a given server
    router.get('/open/:server', function (req, res) {
        Receipt.find({server: req.params.server, closed: false}, function (err, docs) {
            if (err) console.log(err);
            else res.json(docs);
        })
    });
    //Get receipt by its ID
    router.get('/:receiptId', function (req, res) {
        Receipt.findOne({_id: req.params.receiptId}, function (err, doc) {
            if (err) res.status(500).send('There seems to be an internal error. Please try again later.')
            else res.json({success: true, receipt: doc})
        })
    });
    //Edit receipt by its ID
    router.post('/:receiptId', function (req, res) {
        Receipt.findOne({_id: req.params.receiptId}, function (err, doc) {
            if (err) res.status(500).send('There seems to be an internal error. Please try again later.')
            else {
                req.body.receipt.lastModified = new Date();
                doc.update({}, { $set: req.body.receipt})
            }
        })
    })
    return router;
}
