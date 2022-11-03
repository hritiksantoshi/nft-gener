const UniversalFunctions = require('../Lib/UniversalFunctions');
const Model = require('../Models');
const fs = require('fs');
const { STATUS_CODES, MESSAGES } = require('../Config/appConstants');
const Bcrypt = require('../Lib/Bcrypt');
const FS = require('../Lib/FileSystem');
const hashlips = require("../Lib/HashLip");
const JWT = require('../Lib/JsonWebToken');

module.exports.register = async function (payload) {
    try {
        let user = await Model.Users.findOne({
            email: payload.email
        });

        if (user) {
            return UniversalFunctions.returnError(STATUS_CODES.UNPROCESSABLE_ENTITY, MESSAGES.EMAIL_ALREADY_TAKEN);
        }
        else {
            payload.password = await Bcrypt.hashPassword(payload.password);
            user = await Model.Users.create(payload);
            let accessToken = JWT.Sign(user);
            return UniversalFunctions.returnData(STATUS_CODES.CREATED, MESSAGES.USER_REGISTER_SUCCESSFULLY, { accessToken });
        };
    } catch (error) {
        throw error;
    }
};

module.exports.login = async function (payload) {
    try {
        let user = await Model.Users.findOne({
            email: payload.email,
            isBlocked: false,
            isDeleted: false
        });

        if (user) {
            let passwordIsCorrect = await Bcrypt.comparePassword(payload.password, user.password);
            if (!passwordIsCorrect) {
                return UniversalFunctions.returnError(STATUS_CODES.BAD_REQUEST, MESSAGES.INVALID_PASSWORD);
            }
            let accessToken = JWT.Sign(user);
            return UniversalFunctions.returnData(STATUS_CODES.SUCCESS, MESSAGES.USER_LOGIN_SUCCESSFULLY, { accessToken });
        }
        else {
            return UniversalFunctions.returnError(STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        };
    } catch (error) {
        throw error;
    }
};

module.exports.createCollection = async function (payload) {
    try {
        let { loggedUser } = payload;
        if (loggedUser) {
            let { height, width, name } = payload.body;
            let existing = await Model.Collections.findOne({ userId: loggedUser._id, name, isDeleted: false });
            if (existing) {
                return UniversalFunctions.returnError(STATUS_CODES.UNPROCESSABLE_ENTITY, MESSAGES.COLLECTION_ALREADY_EXIST);
            }
            let format = {
                height: parseInt(height),
                width: parseInt(width)
            };
            const path = `Uploads/${loggedUser.id}/${name}`;
            let collection = await Model.Collections.create({
                name,
                format,
                path,
                userId: loggedUser._id
            });
            const buildDir = `${process.cwd()}/${path}/build`;
            const layersDir = `${process.cwd()}/${path}/Layers`;
            await FS.makeDirectory(layersDir);
            await FS.makeDirectory(buildDir);

            return UniversalFunctions.returnData(STATUS_CODES.CREATED, MESSAGES.COLLECTION_CREATED_SUCCESSFULLY, { collection });
        }
        else {
            return UniversalFunctions.returnError(STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        };

    } catch (error) {
        throw error;
    }
};

module.exports.getCollections = async function (payload) {
    try {
        let { loggedUser } = payload;
        if (loggedUser) {
            let collections = await Model.Collections.find({ userId: loggedUser._id, isDeleted: false });
            return UniversalFunctions.returnData(STATUS_CODES.SUCCESS, MESSAGES.COLLECTIONS_LOADED_SUCCESSFULLY, { collections });
        }
        else {
            return UniversalFunctions.returnError(STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        };
    } catch (error) {
        throw error;
    }
};

module.exports.addLayer = async function (payload) {
    try {
        let { loggedUser } = payload;
        let { name, collectionId } = payload.body;
        if (loggedUser) {
            let collection = await Model.Collections.findOne({ userId: loggedUser._id, _id: collectionId, isDeleted: false });
            if (!collection) {
                return UniversalFunctions.returnError(STATUS_CODES.NOT_FOUND, MESSAGES.COLLECTION_NOT_FOUND);
            }
            let path = `${collection.path}/Layers/${name}`;
            let layer = await Model.Layers.findOne({
                collectionId: collection._id,
                name,
                isDeleted: false
            });
            if (layer) {
                return UniversalFunctions.returnError(STATUS_CODES.UNPROCESSABLE_ENTITY, MESSAGES.LAYER_ALREADY_EXIST);
            }
            await FS.makeDirectory(`${process.cwd()}/${path}`);
            layer = await Model.Layers.create({
                name,
                collectionId: collection._id,
                path
            });
            collection.layersOrder.push(layer._id);
            await Model.Collections.findByIdAndUpdate(collection._id, {
                layersOrder: collection.layersOrder
            });
            return UniversalFunctions.returnData(STATUS_CODES.CREATED, MESSAGES.LAYER_CREATED_SUCCESSFULLY, { layer });
        }
        else {
            return UniversalFunctions.returnError(STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        };
    } catch (error) {
        throw error;
    }
};

module.exports.getLayers = async (payload) => {
    try {
        let { loggedUser } = payload;
        if (loggedUser) {
            let collection = await Model.Collections.findOne({ userId: loggedUser._id, _id: payload.params.collectionId, isDeleted: false });
            if (!collection) {
                return UniversalFunctions.returnError(STATUS_CODES.NOT_FOUND, MESSAGES.COLLECTION_NOT_FOUND);
            };
            let layers = await Model.Layers.find({ collectionId: collection._id, isDeleted: false });
            return UniversalFunctions.returnData(STATUS_CODES.SUCCESS, MESSAGES.LAYERS_LOADED_SUCCESSFULLY, { layers });
        }
        else {
            return UniversalFunctions.returnError(STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        };
    } catch (error) {
        throw error;
    }
};

module.exports.uploadImages = async function (payload) {
    try {
        let { layer } = payload;
        if (payload.fileValidationError) {
            let directoryPath = `${process.cwd()}/${layer.path}`;
            for (let file of payload.uploadedFiles) {
                await FS.deleteFile(`${directoryPath}/${file}`);
            };
            return UniversalFunctions.returnError(STATUS_CODES.UNPROCESSABLE_ENTITY, payload.fileValidationError);
        }
        else {
            let layerDir = `${process.cwd()}/${layer.path}`;
            const [a, ...layerUrl] = layer.path.split('/');
            const Images = [];
            for (let file of payload.uploadedFiles) {
                if (fs.existsSync(`${layerDir}/${file}`)) {
                    Images.push({
                        name: file,
                        layerId: layer._id,
                        imagePath: `${layer.path}/${file}`,
                        imageUrl: `/Images/${layerUrl.join('/')}/${file}`,
                    });
                }
            };
            let images = await Model.Images.insertMany(Images);
            return UniversalFunctions.returnData(STATUS_CODES.SUCCESS, MESSAGES.IMAGES_UPLOADED_SUCCESSFULLY, { images });
        }
    } catch (error) {
        throw error;
    }
};

module.exports.getImages = async function (payload) {
    try {
        let { loggedUser } = payload;
        if (loggedUser) {
            let layer = await Model.Layers.findOne({ _id: payload.params.layerId, isDeleted: false });
            if (!layer) {
                return UniversalFunctions.returnError(STATUS_CODES.NOT_FOUND, MESSAGES.LAYER_NOT_FOUND);
            };
            let collection = await Model.Collections.findOne({ userId: loggedUser._id, _id: layer.collectionId, isDeleted: false });
            if (!collection) {
                return UniversalFunctions.returnError(STATUS_CODES.NOT_FOUND, MESSAGES.COLLECTION_NOT_FOUND);
            };
            let Images = await Model.Images.find({ layerId: layer._id, isDeleted: false });
            return UniversalFunctions.returnData(STATUS_CODES.SUCCESS, MESSAGES.IMAGES_LOADED_SUCCESSFULLY, { Images });
        }
        else {
            return UniversalFunctions.returnError(STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        };
    } catch (error) {
        throw error;
    }
};

module.exports.generateNfts = async function (payload) {
    try {
        let { loggedUser } = payload;
        if (loggedUser) {
            let layersOrder = [];
            let { editions, collectionId } = payload.body;
            console.log(payload.body);
            let collection = await Model.Collections.findOne({ userId: loggedUser._id, _id: collectionId, isDeleted: false });
            if (!collection) {
                return UniversalFunctions.returnError(STATUS_CODES.NOT_FOUND, MESSAGES.COLLECTION_NOT_FOUND);
            };
            console.log(collection.name);
            for (const layerId of collection.layersOrder) {
                let layer = await Model.Layers.findOne({ _id: layerId, isDeleted: false });
                console.log(fs.existsSync(`${process.cwd()}/Uploads/${collection.userId}/${collection.name}/Layers/${layer.name}`));
                console.log(`${process.cwd()}/${layer.path}`);
                if (layer && fs.existsSync(`${process.cwd()}/Uploads/${collection.userId}/${collection.name}/Layers/${layer.name}`)) {
                   
                    let Images = await Model.Images.find({ layerId, isDeleted: false });
                    for (let Image of Images) {
                        if (!fs.existsSync(`${process.cwd()}/${Image.imagePath}`)) {
                            return UniversalFunctions.returnError(STATUS_CODES.NOT_FOUND, MESSAGES.IMAGE_NOT_FOUND);
                        }
                    }
                    layersOrder.push({ name: layer.name, number: Images.length });
                  
                }
                else {
                    return UniversalFunctions.returnError(STATUS_CODES.NOT_FOUND, MESSAGES.LAYER_NOT_FOUND);
                }
            };
        
            await hashlips.generateNFt(collection, layersOrder, parseInt(editions));
            // let nfts = await Model.Nts.find({collectionId:collection._id,isDeleted:false});
            let nfts = (await FS.readDirectory(`${process.cwd()}/${collection.path}/build/images`)).map((name) => `/Images/${collection.path.replace('Uploads', '')}/build/images/${name}`);
    
            return UniversalFunctions.returnData(STATUS_CODES.SUCCESS, MESSAGES.SUCCESS, { nfts });
        }
        else {
            return UniversalFunctions.returnError(STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        };
    } catch (error) {
        throw error;
    }
};

module.exports.deleteCollection = async function (payload) {
    try {
        let { loggedUser } = payload;
        if (loggedUser) {
            let { collectionId } = payload.params;
            let collection = await Model.Collections.findOne({ userId: loggedUser._id, _id: collectionId });
            if (!collection) {
                return UniversalFunctions.returnError(STATUS_CODES.NOT_FOUND, MESSAGES.COLLECTION_NOT_FOUND);
            };
            for (const layerId of collection.layersOrder) {
                await Model.Images.deleteMany({ layerId });    // deleting images from database
            };
            await Model.Layers.deleteMany({ collectionId });    // deleting layers from database
            fs.rmSync(`${process.cwd()}/${collection.path}`, { recursive: true });  // deleting collection folder
            await Model.Collections.deleteOne({ _id: collectionId }); // deleting collection from database
            return UniversalFunctions.returnError(STATUS_CODES.SUCCESS, MESSAGES.COLLECTION_DELETED_SUCCESSFULLY);
        }
        else {
            return UniversalFunctions.returnError(STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        };

    } catch (error) {
        throw error;
    }
}