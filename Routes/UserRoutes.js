const router = require('express').Router();
const Controllers = require('../controllers');
const Middlewares = require('../middlewares');
router.post('/register',Controllers.UserController.createUser);
router.post('/login',Controllers.UserController.login);
router.post('/generateNFT', Middlewares.UploadFiles,Controllers.UserController.createNft);
module.exports = router;