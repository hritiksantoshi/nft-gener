const FS = require('../Lib/FileSystem');
const multer = require('multer');
const Models = require('../Models');
const { MESSAGES, STATUS_CODES } = require('../Config/appConstants');
const { errorResponse, sendResponse } = require('../Lib/ResponseManager');

module.exports = async function (req, res, next) {
    try {
        let layer = await Models.Layers.findOne({ _id: req.params.layerId, isDeleted: false });
        if(!layer){
            return sendResponse(res,STATUS_CODES.NOT_FOUND,MESSAGES.LAYER_NOT_FOUND);
        }
        let collection = await Models.Collections.findOne({_id:layer.collectionId,isDeleted:false});
        if (collection && collection.userId == req.loggedUser.id) {
            req.layer = layer;
            req.uploadedFiles = [];
            multer({
                fileFilter: function (req, file, cb) {
                    if (file.mimetype !== 'image/png') {
                        req.fileValidationError = "IMAGE_MIMETYPE_NOT_SUPPORTED!";
                        return cb(null, false);
                    }
                    cb(null, true);
                },
                storage: multer.diskStorage({
                    destination: async (req, file, cb) => {
                        let directoryPath = `${process.cwd()}/${req.layer.path}`;
                        await FS.makeDirectory(directoryPath);
                        cb(null, directoryPath);
                    },
                    filename: (req, file, cb) => {
                        req.uploadedFiles.push(file.originalname);
                        cb(null, `${file.originalname}`);
                    }
                })
            }).any()(req, res, next);
        } else {
            return sendResponse(res,STATUS_CODES.NOT_FOUND,MESSAGES.COLLECTION_NOT_FOUND)
        }
    } catch (error) {
        return errorResponse(res, MESSAGES.SERVER_ERROR);
    }
};