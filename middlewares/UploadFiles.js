const FS = require('../Lib/FileSystem');
const multer = require('multer');

module.exports = async function (req, res, next) {
    try {
        let layersDir = `${process.cwd()}/Layers`;
        await FS.makeDirectory(layersDir);
        let layers = await FS.readDirectory(layersDir);
        for (const layer of layers) {
            await FS.deleteDirectory(`${layersDir}/${layer}`)
        };
        req.layers = [];
        multer({
            fileFilter: function (req, file, cb) {
                if (file.mimetype !== 'image/png') {
                    req.fileValidationError = "Image Mimetype Not Supported!";
                    return cb(null, false);
                }
                cb(null, true);
            },
            storage: multer.diskStorage({
                destination: async (req, file, cb) => {
                    if (!req.layers.includes(file.fieldname)) {
                        req.layers.push(file.fieldname);
                    }
                    let directoryPath = `${layersDir}/${file.fieldname}`;
                    await FS.makeDirectory(directoryPath);
                    cb(null, directoryPath);
                },
                filename: (req, file, cb) => cb(null, `${file.originalname}`)
            })
        }).any()(req, res, next);
    } catch (error) {
        res.send(error.message);
    }
};