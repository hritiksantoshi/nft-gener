// initalizing modules
const path = require('path');
const express = require('express');
const swaggerUI = require('swagger-ui-express');


// importing constants
const app = express();
const Routes = require('./Routes');
const { APP_CONSTANTS } = require('./Config');
const DB = require('./Lib/Database');
const swaggerJson = require('./swagger.json');

// initalizing Apis
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/Images', express.static(path.join(__dirname, './Uploads')));
app.use('/docs',swaggerUI.serve,swaggerUI.setup(swaggerJson));
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