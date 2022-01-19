var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TableReservationSchema = new Schema(
    {
        table: { type: Schema.ObjectId, ref: 'Table', required: true },
        date_of_begin: { type: Date },
        date_of_end: { type: Date },
    }
);


TableReservationSchema
    .virtual('url')
    .get(function () {
        return '/catalog/tableReservation/' + this._id;
    });

module.exports = mongoose.model('TableReservation', TableReservationSchema);