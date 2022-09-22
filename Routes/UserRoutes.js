const router = require('express').Router();
const Controllers = require('../Controllers');
const Middlewares = require('../Middlewares');
router.post('/register',Controllers.UserController.createUser);
router.post('/login',Controllers.UserController.login);
router.post('/generateNFT', Middlewares.UploadFiles,Controllers.UserController.createNft);
module.exports = router;