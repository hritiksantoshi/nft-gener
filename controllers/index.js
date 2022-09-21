const fs = require('fs');
const libs = require('../libs');
const hashlips = require("../hashlips");

module.exports.createNft = async (req, res) => {
    try {
        if (req.fileValidationError) {
            let layers = await libs.readDirectory(`${process.cwd()}/Layers`);
            for (const layer of layers) {
                await libs.deleteDirectory(`${process.cwd()}/Layers/${layer}`)
            };
            res.send(req.fileValidationError);
        }
        else {
            const buildDir = `${process.cwd()}/build`;
            const layersDir = `${process.cwd()}/Layers`;
            let layersOrder = [];
            let { height, width , editions } = req.body;
            let format = {
               height: parseInt(height),
               width: parseInt(width)
            };
            for (const layer of req.layers) {
                if (fs.existsSync(`${process.cwd()}/Layers/${layer}`)) {
                    let files = await libs.readDirectory(`${process.cwd()}/Layers/${layer}`);
                    layersOrder.push({ name: layer, number: files.length });
                }
            };
            
            await hashlips.generateNFt(layersDir, buildDir, layersOrder, format, parseInt(editions));
            res.send({
                preview:'/image/1.png'
            });
        }    
    } catch (error) {
        res.send(error.message);
    }
};