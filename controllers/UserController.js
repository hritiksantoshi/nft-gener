const fs = require('fs');
const { STATUS_CODES, MESSAGES } = require('../Config/appConstants');
const Bcrypt = require('../Lib/Bcrypt');
const FS = require('../Lib/FileSystem');
const hashlips = require("../Lib/HashLip");
const JWT = require('../Lib/JsonWebToken');
const { sendResponse, forBiddenResponse } = require('../Lib/ResponseManager');
const { Users } = require('../Models');
module.exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await Users.findOne({email,isBlocked:false,isDeleted:false});

        let correct = await Bcrypt.comparePassword(password,user.password);
        if(correct){
            let accessToken = JWT.Sign(user);
            await sendResponse(res,STATUS_CODES.SUCCESS,MESSAGES.USER_LOGIN_SUCCESSFULLY,{user,accessToken});    
        }
        else{
            await forBiddenResponse(res,MESSAGES.INCORRECT_DETAILS);
        }
    } catch (error) {
        throw error;
    }
};
module.exports.createUser = async (req, res) => {
    try {
        let { email, password, userName } = req.body;
        password = await Bcrypt.hashPassword(password);
        let user = await Users.create({email,password,userName});
        let accessToken = JWT.Sign(user);
        await sendResponse(res,STATUS_CODES.CREATED,MESSAGES.USER_REGISTER_SUCCESSFULLY,{user,accessToken});
    } catch (error) {
        throw error;
    }
}
module.exports.createNft = async (req, res) => {
    try {
        if (req.fileValidationError) {
            let layers = await FS.readDirectory(`${process.cwd()}/Layers`);
            for (const layer of layers) {
                await FS.deleteDirectory(`${process.cwd()}/Layers/${layer}`)
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
                    let files = await FS.readDirectory(`${layersDir}/${layer}`);
                    layersOrder.push({ name: layer, number: files.length });
                }
            };
            
            await hashlips.generateNFt(layersDir, buildDir, layersOrder, format, parseInt(editions));
            let nfts =  (await FS.readDirectory(`${buildDir}/images`)).map((name)=>`/images/${name}`);
            res.send({
                nfts:{...nfts}
            });
        }    
    } catch (error) {
        res.send(error.message);
    }
};