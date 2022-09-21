
module.exports.generateNFt = async function (layersDir, buildDir, layersOrder, format, edition) {
  console.log(format);
  // importing modules
  const fs = require("fs");
  const { createCanvas, loadImage } = require("canvas");

  // initalizing constants
  const canvas = createCanvas(format.width, format.height);
  const metDataFile = '_metadata.json';
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = format.smoothing;

  let metadata = [];
  let attributes = [];
  let hash = [];
  let decodedHash = [];
  const Exists = new Map();
  let occurence = {};

  // initalizing functions
  const getElements = (path, total) => {
    return fs
      .readdirSync(path)
      .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
      .map((i, index) => {
        return {
          id: index + 1,
          name: cleanName(i),
          fileName: i,
          rarity: addRarity(i, total),
        };
      });
  };

  const addRarity = (_str, total) => {
    let itemRarity;
    let name = _str.slice(0, -4);
    if (name.includes('#')) {
      itemRarity = (name.split("#")[1] / 100) * edition;
    }
    else {
      itemRarity = edition / total;
    }
    return itemRarity;
  };

  const cleanName = (_str) => {
    let name = _str.slice(0, -4).replace('#', "");
    return name;
  };

  const saveLayer = (_canvas, _edition) => {
    fs.writeFileSync(`${buildDir}/images/${_edition}.png`, _canvas.toBuffer("image/png"));
  };

  const addMetadata = (_edition) => {
    let dateTime = Date.now();
    let tempMetadata = {
      hash: hash.join(""),
      decodedHash: decodedHash,
      edition: _edition,
      date: dateTime,
      attributes: attributes,
    };
    metadata.push(tempMetadata);
    attributes = [];
    hash = [];
    decodedHash = [];
  };

  const addAttributes = (_element, _layer) => {
    let tempAttr = {
      id: _element.id,
      layer: _layer.name,
      name: _element.name,
      rarity: _element.rarity,
    };
    attributes.push(tempAttr);
    hash.push(_layer.id);
    hash.push(_element.id);
    decodedHash.push({ [_layer.id]: _element.id });
  };

  const drawLayer = async (_layer, _edition) => {
    let draw = true;
    do {
      const rand = Math.random();
      let element = _layer.elements[Math.floor(rand * _layer.number)] ? _layer.elements[Math.floor(rand * _layer.number)] : null;
      if (element) {
        let rarityR = Math.round(element.rarity);
        let count = occurence[_layer.name].filter((val) => val == element.id).length;
        if (count < rarityR || (element.rarity > 0 && rarityR == 0 && count == 0 )) {
          occurence[_layer.name].push(element.id);
          addAttributes(element, _layer);
          const image = await loadImage(`${_layer.location}${element.fileName}`);

          ctx.drawImage(
            image,
            _layer.position.x,
            _layer.position.y,
            _layer.size.width,
            _layer.size.height
          );
          saveLayer(canvas, _edition);
          draw = false;
        }
      }
    } while (draw);
  };
  const saveMetaData = (_editionCount) => {
    let data = metadata.find((meta) => meta.edition == _editionCount);
    fs.writeFileSync(`${buildDir}/json/${_editionCount}.json`,
      JSON.stringify(data, null, 2)
    );
  };

  // step 1 making build dir
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
  fs.mkdirSync(`${buildDir}/json`);
  fs.mkdirSync(`${buildDir}/images`);

  // step 2 creating Nfts Files
  const layers = layersOrder.map((layerObj, index) => ({
    id: index,
    name: layerObj.name,
    location: `${layersDir}/${layerObj.name}/`,
    elements: getElements(`${layersDir}/${layerObj.name}/`, layerObj.number),
    position: { x: 0, y: 0 },
    size: { width: format.width, height: format.height },
    number: layerObj.number
  }));

  let numDupes = 0;

  layersOrder.forEach(({ name }) =>
    occurence[name] = []
  );

  for (let i = 1; i <= edition; i++) {
    await layers.forEach(async (layer) => {
      await drawLayer(layer, i);
    });

    let key = hash.toString();
    if (Exists.has(key)) {
      console.log(`Duplicate creation for edition ${i}. Same as edition ${Exists.get(key)}`);
      numDupes++;
      if (numDupes > edition) break; //prevents infinite loop if no more unique items can be created
      i--;
    } else {
      Exists.set(key, i);
      addMetadata(i);
      saveMetaData(i);
      console.log("Creating edition " + i);
    }
  }

  // step 3 creating metaData File
  fs.stat(`${buildDir}/${metDataFile}`, (err) => {
    if (err == null || err.code === 'ENOENT') {
      fs.writeFileSync(`${buildDir}/json/${metDataFile}`, JSON.stringify(metadata, null, 2));
    } else {
      console.log('Oh no, error: ', err.code);
    }
  });
}