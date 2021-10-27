const axios = require('axios');
const config = require("../config");

exports.getBalanceFromMainService = (req, res) => {
    const {token, userId} = req.body;
    console.log(token, userId);
    axios.get(`${config.SERVICE_URL}/get-balance`, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if(response.data.code === 0) {
            console.log(response.data);
            return res.send({code: 0, balance: response.data.data.balance});
        } else {
            console.log(response.data);
            return res.send({code: 1, balance: null, msg: 'Main service error!'});
        }
    })
    .catch(error => {
        console.log('[ERROR]:[GET_BALANCE]', error);
        return res.send({code: 2, balance: null, msg: 'Something went wrong!'});
    });
}