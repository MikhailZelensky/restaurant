var Dish = require('./models/dish');

exports.dish_list = function (req, res, next) {
    Dish.find({}, 'name price')
        .populate('name')
        .exec(function (err, list_dishes) {
            if (err) { return next(err); }
            res.render('dish_list', { title: 'Меню', dish_list: list_dishes });
        });
};


