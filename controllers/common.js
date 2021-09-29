const axios = require('axios');
const conf = require("../config/main");

exports.getBalanceFromMainService = (req, res) => {
    const {token, userId} = req.body;
    axios.get(`${conf.service_url}/get-balance`, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if(response.data.code === 0) {
            return res.send({code: 0, balance: response.data.data.balance});
        } else {
            return res.send({code: 1, balance: null, msg: 'Main service error!'});
        }
    })
    .catch(error => {
        console.log('[ERROR]:[GET_BALANCE]', error);
        return res.send({code: 2, balance: null, msg: 'Something went wrong!'});
    });
}