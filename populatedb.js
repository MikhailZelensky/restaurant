#! /usr/bin/env node


var userArgs = process.argv.slice(2);
var async = require('async')
var Table = require('./models/table')
var Dish = require('./models/dish')
var TableReservation = require('./models/tableReservation')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var tables = []
var dishes = []
var tableReservations = []


function tableCreate(name, cb) {
  tabledetail = { name:name }
  var table = new Table(tabledetail);
       
  table.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Table: ' + table);
    tables.push(table)
    cb(null, table)
  }  );
}
function dishCreate(name, price, cb) {
  dishdetail = { name:name, price:price }
  var dish = new Dish(dishdetail);
       
  dish.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Dish: ' + dish);
    dishes.push(dish)
    cb(null, dish)
  }  );
}
function tableReservationCreate(table, d_begin, d_end, cb) {
  tableReservationdetail = { table:table }
  if (d_begin != false) tableReservationdetail.date_of_begin = d_begin
  if (d_end != false) tableReservationdetail.date_of_end = d_end
  
  var tableReservation = new TableReservation(tableReservationdetail);
       
  tableReservation.save(function (err) {
    if (err) {
		console.log('ERROR CREATING TableReservation: ' + tableReservation);
      cb(err, null)
      return
    }
    console.log('New TableReservation: ' + tableReservation);
    tableReservations.push(tableReservation)
    cb(null, tableReservation)
  }  );
}


function createTables(cb) {
    async.series([
        function(callback) {
          tableCreate('Столик1', callback);
        },
        function(callback) {
          tableCreate('Столик2', callback);
        },
        function(callback) {
          tableCreate('Столик3', callback);
        },
        function(callback) {
          tableCreate('Столик4', callback);
        },
        function(callback) {
          tableCreate('Столик5', callback);
        }
        ],
        // optional callback
        cb);
}

function createDishes(cb) {
    async.series([
        function(callback) {
          dishCreate('Оливье', '150 рублей', callback);
        },
        function(callback) {
          dishCreate('Спагетти', '170 рублей', callback);
        },
        function(callback) {
          dishCreate('Суп', '120 рублей', callback);
        },
        function(callback) {
          dishCreate('Шашлык', '300 рублей', callback);
        },
        function(callback) {
          dishCreate('Стакан воды', '20 рублей', callback);
        }
        ],
        // optional callback
        cb);
}

function createTableReservations(cb) {
    async.series([
        function (callback) {
            tableReservationCreate(tables[0], new Date(2022, 0, 20, 15), new Date(2022, 0, 20, 18), callback);
        },
        function (callback) {
            tableReservationCreate(tables[1], new Date(2022, 0, 22, 12), new Date(2022, 0, 22, 16), callback);
        },
        function (callback) {
            tableReservationCreate(tables[0], new Date(2022, 0, 20, 12), new Date(2022, 0, 20, 14), callback);
        }
        ],
        // optional callback
        cb);
}

async.series([
    createTables,
	createDishes,
	createTableReservations
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('TABLEReservations: '+tableReservations);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



