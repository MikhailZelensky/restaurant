var express = require('express');
var router = express.Router();

var table_controller = require('./controllers/tableController');
var dish_controller = require('./controllers/dishController');
var tableReservation_controller = require('./controllers/tableReservationController');

router.get('/', table_controller.index);

router.get('/menu', dish_controller.dish_list);


router.get('/date', tableReservation_controller.tableReservation_date_get);

router.post('/date', tableReservation_controller.tableReservation_date_post);

router.get('/date/reservation', tableReservation_controller.reservation_get);

router.post('/date/reservation', tableReservation_controller.reservation_post);

router.get('/tableReservation/:id', tableReservation_controller.reservation_code);


module.exports = router;
