var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TableSchema = new Schema(
    {
        name: { type: String, required: true, max: 20 }
    }
);

module.exports = mongoose.model('Table', TableSchema);