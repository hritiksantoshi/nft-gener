const { UserHandlers } = require('../Handlers');
const { sendResponse, errorResponse } = require('../Lib/ResponseManager');

module.exports.login = async (req, res) => {
    try {
        const response = await UserHandlers.login(req.body);
        return sendResponse(res, response.status, response.message, response.data);
    } catch (error) {
        return errorResponse(res, error);
    }
};

module.exports.createUser = async (req, res) => {
    try {
        const response = await UserHandlers.register(req.body);
        await sendResponse(res, response.status, response.message, response.data);
    } catch (error) {
        return errorResponse(res, error);
    }
};

module.exports.createCollection = async (req, res) => {
    try {
        const response = await UserHandlers.createCollection(req);
        await sendResponse(res, response.status, response.message, response.data);
    } catch (error) {
        return errorResponse(res, error);
    }
};

module.exports.addLayer = async (req, res) => {
    try {
        const response = await UserHandlers.addLayer(req);
        await sendResponse(res, response.status, response.message, response.data);
    } catch (error) {
        return errorResponse(res, error);
    }
};

module.exports.getCollections = async (req, res) => {
    try {
        req.body.loggedUser = req.loggedUser;
        const response = await UserHandlers.getCollections(req);
        await sendResponse(res, response.status, response.message, response.data);
    } catch (error) {
        return errorResponse(res, error);
    }
};

module.exports.getLayers = async (req, res) => {
    try {
        req.body.loggedUser = req.loggedUser;
        const response = await UserHandlers.getLayers(req);
        await sendResponse(res, response.status, response.message, response.data);
    } catch (error) {
        return errorResponse(res, error);
    }
};

module.exports.uploadImages = async (req, res) => {
    try {
        const response = await UserHandlers.uploadImages(req);
        await sendResponse(res, response.status, response.message, response.data);
    } catch (error) {
        return errorResponse(res, error);
    }
};

module.exports.getImages = async (req, res) => {
    try {
        const response = await UserHandlers.getImages(req);
        await sendResponse(res, response.status, response.message, response.data);
    } catch (error) {
        return errorResponse(res, error);
    }
};

module.exports.generateNfts = async (req, res) => {
    try {
        const response = await UserHandlers.generateNfts(req);
        await sendResponse(res, response.status, response.message, response.data);
    } catch (error) {
        return errorResponse(res, error);
    }
};