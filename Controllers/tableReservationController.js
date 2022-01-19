var TableReservation = require('../models/tableReservation');
var Table = require('../models/table');
const { body, validationResult } = require('express-validator');

function getAsDate(day, time, h=0) {
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    hours += Number(h);
    if (hours > 23) {
        hours = 23;
        minutes = 0;
    }
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    time = sHours + ":" + sMinutes + ":00";
    var d = new Date(day);
    var n = d.toISOString().substring(0, 10);
    var newDate = new Date(n + "T" + time);
    return newDate;
}

exports.tableReservation_date_get = function (req, res) {
    res.render('date', {title: 'Выберите дату, время и количество часов'});
};

exports.tableReservation_date_post = [
    body('date', 'Некорректная дата').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('booking_time', 'Некорректное количество часов'),
    body('time', 'Некорректное время'),

    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('date', { title: 'Выберите дату, время и количество часов', date: req.body, errors: errors.array() });
            return;
        }
        else {
            var tables = [];
            Table.find({}, function (err, results) {
                tables = results
            })
            var d_begin = getAsDate(req.body.date, req.body.time);
            var d_end = getAsDate(req.body.date, req.body.time, req.body.booking_time);
            TableReservation.find({})
                .populate('table')
                .exec(function (err, reservations) {
                    if (err) { return next(err); }
                    res.render('date', { title: 'Выберите дату, время и количество часов', reservations: reservations, date: req.body, d_begin: d_begin, d_end: d_end, tables: tables});
                });
        }
    }
];

exports.reservation_get = function (req, res) {

    res.render('reservation', { title: 'Ваш код'});
};
exports.reservation_post = [
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('reservation', { title: 'Ваш код', date: req.body, errors: errors.array() });
            return;
        }
        else {
            Table.find({ 'name': req.body.name }).exec(function (err, results) {
                var reservation = new TableReservation({
                    table: results[0],
                date_of_begin: req.body.date_b,
                date_of_end: req.body.date_e
            });
            reservation.save(function (err) {
                if (err) { return next(err); }
                res.redirect(reservation.url);
            });
            });
        }

    }
];

exports.reservation_code = function (req, res, next) {
    res.render('reservation', { title: 'Ваш код', id: req.params.id });
};  

