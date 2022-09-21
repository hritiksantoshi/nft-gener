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
app.use('/image', express.static(path.join(__dirname, './build')));
app.post('/NFT', middlewares.uploadFiles,controllers.createNft);
console.log('test123')
// starting Server
app.listen(8000, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${8000}`);
});