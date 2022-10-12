const joi = require('joi');
const { DATABASE } = require('../Config/appConstants');

module.exports.registerSchema = {
    body: joi.object({
        userName: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
        userType: joi.string().valid(DATABASE.USER_TYPES.ADMIN, DATABASE.USER_TYPES.USER).optional()
    })
};

module.exports.loginSchema = {
    body: joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).required()
    })
};

module.exports.createCollectionSchema = {
    body: joi.object({
        name: joi.string().required(),
        height: joi.number().required(),
        width: joi.number().required()
    })
};

module.exports.addLayerSchema = {
    body: joi.object({
        collectionId: joi.string().hex().length(24).required(),
        name: joi.string().required()
    })
};

module.exports.getLayersSchema = {
    params: joi.object({
        collectionId: joi.string().hex().length(24).required()
    })
};

module.exports.uploadImagesSchema = {
    params: joi.object({
        layerId: joi.string().hex().length(24).required()
    })
};

module.exports.getImagesSchema = {
    params: joi.object({
        layerId: joi.string().hex().length(24).required()
    })
};

module.exports.generateNFTSchema = {
    body: joi.object({
        collectionId: joi.string().hex().length(24).required(),
        editions:joi.number().positive().required()
    })
};