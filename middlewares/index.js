const libs = require('../libs');
const multer = require('multer');

module.exports.uploadFiles = async function (req, res, next) {
    try {
        let layers = await libs.readDirectory(`${process.cwd()}/Layers`);
        for (const layer of layers) {
            await libs.deleteDirectory(`${process.cwd()}/Layers/${layer}`)
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
                    let directoryPath = `${process.cwd()}/Layers/${file.fieldname}`;
                    await libs.makeDirectory(directoryPath);
                    cb(null, directoryPath);
                },
                filename: (req, file, cb) => cb(null, `${file.originalname}`)
            })
        }).any()(req, res, next);
    } catch (error) {
        res.send(error.message);
    }
};