var jwt = require('jsonwebtoken'),
    secret = require('../../config').secret;
module.exports = {
    verifyToken: function (token) {
        try {
            var decoded = jwt.verify(token, secret);
            return decoded;
        }
        catch(err) {
            console.log(err);
        }
    }
};
