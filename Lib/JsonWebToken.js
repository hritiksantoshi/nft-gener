const  { APP_CONSTANTS } = require('../Config');

const jwt = require('jsonwebtoken');

function Sign(payload) {
    return jwt.sign({ _id: payload._id },  APP_CONSTANTS.SERVER.JWT_SECRET_KEY, { expiresIn: "1d" });
};

function Verify(token) {
    return jwt.verify(token, APP_CONSTANTS.SERVER.JWT_SECRET_KEY);
};

module.exports = { Sign, Verify };