const router = require('express').Router();
const { registerSchema, loginSchema, createCollectionSchema, addLayerSchema, getLayersSchema, uploadImagesSchema, getImagesSchema, generateNFTSchema } = require('../Validations/UserValidations');
const { DATABASE } = require('../Config/appConstants');
const Controllers = require('../controllers');
const Middlewares = require('../middlewares');

router.post('/register', Middlewares.Validate(registerSchema), Controllers.UserController.createUser);
router.post('/login', Middlewares.Validate(loginSchema), Controllers.UserController.login);
router.use(Middlewares.Authorize(DATABASE.USER_TYPES.USER));
router.post('/createCollection', Middlewares.Validate(createCollectionSchema), Controllers.UserController.createCollection);
router.get('/getCollections', Controllers.UserController.getCollections);
router.post('/addLayer/:collectionId', Middlewares.Validate(addLayerSchema), Controllers.UserController.addLayer);
router.get('/getLayers/:collectionId', Middlewares.Validate(getLayersSchema), Controllers.UserController.getLayers);
router.post('/uploadImages/:layerId', Middlewares.Validate(uploadImagesSchema), Middlewares.UploadFiles, Controllers.UserController.uploadImages);
router.get('/getImages/:layerId', Middlewares.Validate(getImagesSchema), Controllers.UserController.getImages);
router.post('/generateNFT/:collectionId', Middlewares.Validate(generateNFTSchema), Controllers.UserController.generateNfts);

module.exports = router;