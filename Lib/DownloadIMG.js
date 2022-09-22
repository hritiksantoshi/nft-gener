async function downloadImage(fileUrl, filePath) {
    const fs = require("fs");
    const { createCanvas, loadImage } = require("canvas");
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext("2d");
    const image = await loadImage(fileUrl);
    ctx.drawImage(image, 0, 0, 512, 512);
    fs.writeFileSync(filePath, canvas.toBuffer("image/png"));
}

downloadImage('https://www.google.com/images/srpr/logo3w.png', `${process.cwd()}/image.png`)
    .then(() => console.log('file downloaded!'))
    .catch((error) => console.error(error));