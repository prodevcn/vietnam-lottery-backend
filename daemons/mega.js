/** import models */
const Staging = require('../models/staging');
const Order = require('../models/order');
const User = require('../models/user');
const Result = require('../models/result');
/** import outers */
const conf = require('../config/main');
const {duration} = require('../config/game');

const createLotNumbers

const processOrders = async (io, prevEndTime) => {
    
};

const startLoopProcessor = async (io, endTime) => {
    let duration = endTime - Date.now();
    let interval = setInterval(() => {
        duration -= 1000;
        console.log(duration);
        io.in('mega').emit('timer', duration);
        if(duration < 0) {
            clearInterval(interval);
            processOrders(io.endTime);
        }
    }, 1000);
};

exports.startMegaDaemon = async (io) => {
    const gameInfo = await Staging.findOne({gameType: 'mega'});
    if (gameInfo && gameInfo.endTime > Date.now()) {
        startLoopProcessor(io, gameInfo.endTime);
    } else {
        const endTime = Date.now() + duration;
        if (gameInfo && gameInfo.endTime <= Date.now()) {
            await Staging.updateOne({gameType: 'mega'}, {endTime: endTime});
        } else {
            const newStaging = new Staging({
                gameType: 'mega',
                endTime: endTime
            });
            await newStaging.save();
        }
        startLoopProcessor(io, endTime);
    }
};