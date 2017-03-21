'use strict';

var config = require('../config'),
    ItemSchema = {
        item: String,
        quantity: {type: Number, default: 1},
        ingredients: [String],
        price: Number
    };
exports.schema = {
    id: {type: Number, required: true, },
    created: {type: Date, default: Date.now, required: true},
    lastModified: Date,
    server: {type: String, required: true},
    cashier: {type: String, required: true, default: ''},
    paid: {type: Boolean, required: true, default: false},
    payment: {type: String, required: true, enum: config.paymentOptions, default: ''},
    items: [ItemSchema],
    subTotal: {type: Number, required: true},
    tax: Number,
    gratuity: Number,
    closed: {type: Boolean, default: false}
}

//exports.pre = {
//    'update': function() {
//        this.update({},{ $set: { lastModified: new Date() } });
//    }
//}
