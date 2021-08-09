const User = require('../models/user');
const Order = require('../models/order');

exports.saveBet = (req, res) => {
    const {userId, betAmount} = req.body;
    User.findOne({_id: userId})
        .then(async user => {
            if(user.balance < betAmount) {
                return res.json({msg: 'Insufficient balance'});
            } else {
                const newOrder = new Order(req.body);
                await User.updateOne({_id: userId}, {balance: user.balance - betAmount});
                newOrder.save()
                    .then(order => {
                        order.status = 'success';
                        return res.send(order);
                    })
                    .catch(err => {
                        console.log('[ERROR]:[SAVE_BET_INFO]', err);
                        return res.json({msg: 'Something went wrong, server in not responding'});            
                    })
            }
        })
        .catch(err => {
            console.log('[ERROR]:[BETTING_USER_FETCH]', err);
            return res.json({msg: 'Something went wrong, server in not responding'});
        });

};

exports.fetchBets = (req, res) => {
    const {userId} = req.params;
    Order.find({userId: userId})
        .then(orders => {
            return res.send(orders);
        })
        .catch(err => {
            console.log('[ERROR]:[GET_ORDERS]', err);
            return res.json({msg: 'Something went wrong, server in not responding'});            
        });
}
