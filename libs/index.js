const fs = require('fs/promises');
const deleteFile = async function(filePath){
    await fs.unlink(filePath);
};
const readDirectory = async function (directoryPath) {
    return await fs.readdir(directoryPath);
}
const makeDirectory = async function (directoryPath) {
    return await fs.mkdir(directoryPath,{ recursive: true });
}
const deleteDirectory = async function (directoryPath) {
    let files = await fs.readdir(directoryPath);
    for (const file of files) {
      await deleteFile(`${directoryPath}/${file}`);
    }
    await fs.rmdir(directoryPath);
};
module.exports = {
    deleteDirectory,
    readDirectory,
    makeDirectory,
    deleteFile
}