const Staging = require('../models/staging');
const Order = require('../models/order');
const User = require('../models/user');
const Result = require('../models/result');
const History = require('../models/history');
const {
    createMegaLottoNumbers
} = require('./lib');
const {durations, winRates} = require('../config/game');

const processOrders = async (io, prevEndTime) => {
    console.log('[PROCESS_ORDER]');
    let lottoNumbers = createMegaLottoNumbers();
    console.log(lottoNumbers);
    let newResult = new Result({
        endTime: prevEndTime,
        gameType: 'mega',
        numbers: lottoNumbers
    });

    await newResult.save();
    await Staging.updateOne({gameType: 'mega'}, {numbers: lottoNumbers});
    let orders = await Order.find({gameType: 'mega', processed: false});
    if (orders.length === 0) {
        let endTime = Date.now() + durations.mega;
        await Staging.updateOne({gameType: "mega"}, {endTime: endTime });
        io.in('mega').emit('new game start');
        startLoopProcess(io, endTime);
    } else {
        for(let order of orders) {
            switch(order.betType) {
                
                default:
                    break;
            }
        }
        // await Order.deleteMany({});
        let endTime = Date.now() + durations.mega;
        await Staging.updateOne({gameType: "mega"}, {endTime: endTime });
        io.in('mega').emit('new game start');
        startLoopProcess(io, endTime);
    }

    await newResult.save();
    await Staging.updateOne

}

const startLoopProcess = async (io, endTime) => {
    let duration = endTime - Date.now();
    let interval = setInterval(() => {
        duration -= 1000;
        console.log(duration);
        io.in('mega').emit('timer', duration);
        if(duration < 0) {
            clearInterval(interval);
            processOrders(io, endTime);
        }
    }, 1000);
};

exports.startMegaDaemon = async io => {
    console.log('[START]:[MEGA_DAEMON]');
    let gameInfo = await Staging.findOne({gameType: 'mega'});
    if (gameInfo) {
        if (gameInfo.endTime > Date.now()) {
            startLoopProcess(io, gameInfo.endTime);
        } else {
            let newEndTime = Date.now() + durations.mega;
            await Staging.updateOne({gameType: 'mega'}, {endTime: newEndTime});
            startLoopProcess(io, newEndTime);
        }
    } else {
        let endTime = Date.now() + durations.mega;
        let newStaging = new Staging({
            gameType: "mega",
            endTime: endTime
        });
        await newStaging.save();
        startLoopProcess(io, endTime);
    }
}
