'use strict';

var bcrypt = require('bcrypt-nodejs'),
    config = require('../config'),
    jwt = require('jsonwebtoken');

exports.schema = {
    _id: Number,
    name: {type: String, required: true},
    sex: {type: String, required: true},
    role: {type: String, required: true, enum: config.roles},
    password: {type: String, required: true},
};

exports.methods = {
    verifyPassword: function (passwordString) {
        return bcrypt.compareSync(passwordString, this.password);
    },
    generateToken: function (validFor) {
        var expiresIn = validFor || '1h';
        var token = jwt.sign({
            id: this._id,
            name: this.name,
            role: this.role,
        }, config.secret, {
            expiresIn: expiresIn,
        });
        console.log(token);
        return token;
    },
    splitName: function () {
        if (this.name.indexOf(' ') !== -1) {
            var nameSegments = fullName.split(' ');
            var name = {};
            name.first = nameSegments[0];
            name.last = nameSegments[1];
            return name;
        }
        else return {first: this.name, last: ''};
    }
};
exports.statics = {
    allUsers: function (callback) {
        this.find().sort('name.last name.first').select('-password').exec(callback);
    }
};
exports.pre = {
    'save': function (next) {
        if (!this.isModified('password')) return next();
        this.password = bcrypt.hashSync(this.password);
        next();
    }
};
