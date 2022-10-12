const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CollectionModel = new Schema({
    userId: {
        type: Schema.Types.ObjectId, ref: 'users', index: true, required: true
    },
    name: {
        type: Schema.Types.String, index: true, required: true
    },
    format: {
        type: Object({
            height: Schema.Types.Number,
            width: Schema.Types.Number
        }),
        required: true
    },
    layersOrder: {
        type: Array(Schema.Types.ObjectId),
        default: []
    },
    path: {
        type: Schema.Types.String, index: true, required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('collections', CollectionModel);