// initalizing constants
const path = require('path');
const express = require('express');

// importing modules
const app = express();
const controllers = require('./controllers');
const middlewares = require('./middlewares');

// initalizing Apis
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/images', express.static(path.join(__dirname, './build/images')));
app.post('/sign_up',controllers.createUser);
app.post('/generateNFT', middlewares.uploadFiles,controllers.createNft);

// starting Server
app.listen(8000, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${8000}`);
});