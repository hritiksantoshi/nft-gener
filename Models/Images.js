const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ImageModel = new Schema({
    layerId: {
        type: Schema.Types.ObjectId, ref:'layers',index: true, required: true
    },
    name: {
        type: Schema.Types.String, index: true, required: true
    },
    imageUrl: {
        type: Schema.Types.String, index: true, required: true
    },
    imagePath: {
        type: Schema.Types.String, index: true, required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('images', ImageModel);