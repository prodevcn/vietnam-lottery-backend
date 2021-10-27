const User = require("../models/user");
const Order = require("../models/order");
const axios = require('axios');
const config = require('../config');

exports.saveBet = async (req, res) => {
  const orders = req.body;
  for (let order of orders) {
    const { userId, betAmount } = order;
    const user = await User.findOne({ userId: userId });
    const balance = (await axios.get(`${config.SERVICE_URL}/get-balance`, {
      headers: {
          'Authorization': user.token,
          'Content-Type': 'application/json'
      }
    })).data.data.balance;
    
    if (balance < betAmount) {
      return res.json({ msg: "Insufficient balance" });
    }
    const newOrder = new Order(order);
    await User.updateOne({ userId: userId }, { balance: user.balance - betAmount });
    const savedOrder = await newOrder.save();
    await axios
      .post(
        `${config.SERVICE_URL}/create-transaction`, 
        {
          game: "lottopoka", 
          transactionId: savedOrder._id, 
          type: 'bet',
          amount: betAmount, 
        },
        {
          headers: {
            'Authorization': user.token,
            'Content-Type': 'application/json'
          }
        }
      );
  }
  return res.json({ msg: "success" });
  // User.findOne({_id: userId})
  //     .then(async user => {
  //         if(user.balance < betAmount) {
  //             return res.json({msg: 'Insufficient balance'});
  //         } else {
  //             const newOrder = new Order(req.body);
  //             await User.updateOne({_id: userId}, {balance: user.balance - betAmount});
  //             newOrder.save()
  //                 .then(order => {
  //                     order.status = 'success';
  //                     return res.send(order);
  //                 })
  //                 .catch(err => {
  //                     console.log('[ERROR]:[SAVE_BET_INFO]', err);
  //                     return res.json({msg: 'Something went wrong, server in not responding'});
  //                 })
  //         }
  //     })
  //     .catch(err => {
  //         console.log('[ERROR]:[BETTING_USER_FETCH]', err);
  //         return res.json({msg: 'Something went wrong, server in not responding'});
  //     });
};

exports.fetchBets = (req, res) => {
  const { userId } = req.params;
  Order.find({ userId: userId })
    .then((orders) => {
      return res.send(orders);
    })
    .catch((err) => {
      console.log("[ERROR]:[GET_ORDERS]", err);
      return res.json({ msg: "Something went wrong, server in not responding" });
    });
};
