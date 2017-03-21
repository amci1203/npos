'use strict';

exports.schema = {
    genre: String,
    category: String,
    items: [{
        name: {type: String, required: true},
        price: {type: Number, required: true},
        ingredients: [{
            name: String,
            measurement_unit: String,
            amount: Number
        }]
    }]
};
exports.statics = {
    getMenu: function (callback) {
        return this.find().sort('genre category').exec(callback(err, results));
    },
    addCategory: function(category, genre, callback) {
        return this.insert({genre: genre, category: category}, callback(err, insertedId));
    }
};
exports.methods = {
    addItem: function (db, item, price, ingredients) {
        var newItem = {
            name: item,
            price: price,
            ingredients: ingredients
        }
        db.update({category: this.category}, {$push: {items: newItem} }, {upsert: true}, function (err) {
            if (err) return {success: false, message: 'There was a problem with adding the new item. Please try again later.'};
            else {
                this.items.push(newItem)
                return {success: true, message: 'Item Successfully added!'};
             }
        })
    }
};
