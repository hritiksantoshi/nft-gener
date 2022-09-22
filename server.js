// initalizing constants
const path = require('path');
const express = require('express');
const { APP_CONSTANTS } = require('./Config');
const DB = require('./Lib/Database');

// importing modules
const app = express();
const Routes = require('./Routes');
// const controllers = require('./Controllers');
// const middlewares = require('./middlewares');

// initalizing Apis
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/images', express.static(path.join(__dirname, './build/images')));
app.use('/api',Routes);

// connecting Database
DB.connect().then((connected) => {

    console.log(connected);

    // starting Server
    app.listen(process.env.PORT || APP_CONSTANTS.SERVER.PORT, (error) => {

        if (error) throw error;

        else console.log(`⚡️[server]: Server is running at http://localhost:${APP_CONSTANTS.SERVER.PORT}`);
    });

}).catch((error) => {

    console.log("Database Connection Error:", error);

});