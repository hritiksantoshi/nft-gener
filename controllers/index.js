const fs = require('fs');
const libs = require('../libs');
const hashlips = require("../hashlips");
module.exports.createUser = async (req, res) => {
    try {
        let { email, password, full_name} = req.body;
    } catch (error) {
        
    }
}
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
                if (fs.existsSync(`${layersDir}/${layer}`)) {
                    let files = await libs.readDirectory(`${layersDir}/${layer}`);
                    layersOrder.push({ name: layer, number: files.length });
                }
            };
            
            await hashlips.generateNFt(layersDir, buildDir, layersOrder, format, parseInt(editions));
            let nfts =  (await libs.readDirectory(`${buildDir}/images`)).map((name)=>`/images/${name}`);
            res.send({
                nfts:{...nfts}
            });
        }    
    } catch (error) {
        res.send(error.message);
    }
};