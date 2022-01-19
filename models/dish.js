var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DishSchema = new Schema(
    {
        name: { type: String, required: true, max: 30 },
        price: { type: String }
    }
);

module.exports = mongoose.model('Dish', DishSchema);