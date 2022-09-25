const joi = require('joi');
const { DATABASE } = require('../Config/appConstants');

module.exports.LoginSchema = {
    body: joi.object({
        userName: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
        userType: joi.string().valid(DATABASE.USER_TYPES.ADMIN,DATABASE.USER_TYPES.USER).optional()
    })
    
};