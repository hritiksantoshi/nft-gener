const mongoose = require('mongoose');
const { APP_CONSTANTS } = require('../Config');
const userTypes = [
    APP_CONSTANTS.DATABASE.USER_TYPES.USER,
    APP_CONSTANTS.DATABASE.USER_TYPES.ADMIN
];
const Schema = mongoose.Schema;
const UserModel = new Schema({
    userName: {
        type: Schema.Types.String, index: true, required: true
    },
    email: {
        type: Schema.Types.String, index: true, required: true
    },
    password: {
        type: Schema.Types.String, index: true, required: true
    },
    userType: {
        type: Schema.Types.String,
        enum: userTypes,
        default:userTypes[0],
        required: true
    },
    isDeleted: {
        type: Schema.Types.Boolean,
        default: false
    },
    isBlocked:{
        type: Schema.Types.Boolean,
        default: false
    },
    createdOn: { 
        type: Schema.Types.Date, 
        default: new Date() 
    },
    updatedOn: { 
        type: Schema.Types.Date, 
        default: new Date() 
    }
});

module.exports = mongoose.model('users', UserModel);