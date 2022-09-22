const mongoose = require('mongoose');
const {APP_CONSTANTS} = require('../Config');
function connect() {
    return new Promise((connect,error)=>{
        const DBURL = `mongodb+srv://${APP_CONSTANTS.DATABASE.USERNAME}:${APP_CONSTANTS.DATABASE.PASSWORD}@${APP_CONSTANTS.DATABASE.CLUSTER_LINK}.mongodb.net/${APP_CONSTANTS.DATABASE.NAME}?retryWrites=true&w=majority`;
        mongoose.connect(DBURL,(err,connected)=>{
            if(err) return error(err);
            else if(connected) return connect("Database Connected SuccessFully!");
        })
    })
}
module.exports = {connect};