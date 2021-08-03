const Staging = require('../models/staging');
const Order = require('../models/order');
const User = require('../models/user');
const Result = require('../models/result');

const conf = require('../config/main');
const {winRates} = require('../config/main');

const getLast2digits = value => {
    let arr = [];
    const red = value.redAward.substr(3, 5);
    arr.push(red);
    const first = value.first.substr(3, 5);
    arr.push(first);
    const second = value.second.split('-').map((item) => {return item.substr(3, 5)});
    arr = arr.concat(second);
    const third = value.third.split('-').map((item) => {return item.substr(3, 5)});
    arr=arr.concat(third);
    const fourth = value.fourth.split('-').map((item) => {return item.substr(2, 4)});
    arr=arr.concat(fourth);
    const fifth = value.fifth.split('-').map((item) => {return item.substr(2, 4)});
    arr=arr.concat(fifth);
    const sixth = value.sixth.split('-').map((item) => {return item.substr(1, 3)});
    arr=arr.concat(sixth);
    const seventh = value.seventh.split('-');
    arr=arr.concat(seventh);
    return arr;
}

const getFirst2digits = value => {
    let arr = [];
    
}

const processBackpack = async (order, lottoNumbers) => {
    switch(order.digitType) {
        case 'lot2':
            const order_numbers = order.number.split(';');
            const last2digits = getLast2digits(lottoNumbers);
            const matched_count = order_numbers.filter(e => last2digits.includes(e)).length;
            const totalPoints = (2 * matched_count - 1) * winRates.northern.lot2;
            const ordered_userInfo = await User.findOne({_id: order.userId});
            await User.updateOne({_id: order.userId},{balance: ordered_userInfo.balance + totalPoints});
            await Order.updateOne({_id: order._id}, {processed: true});
            return;
        case 'lot2_1K':
            
            return;
        case 'lot3':
            return;
        case 'lot4': 
            return;
        default:
            return;
    }
} 

const createLottoNumbers = () => {
    const redAward = (""+Math.random()).substring(2,7);
    const first = (""+Math.random()).substring(2,7);
    const second = (""+Math.random()).substring(2,7) + "-" + (""+Math.random()).substring(2,7);
    const third = (""+Math.random()).substring(2,7) + "-" + (""+Math.random()).substring(2,7) + "-" + (""+Math.random()).substring(2,7) + "-"+ (""+Math.random()).substring(2,7) + "-" + (""+Math.random()).substring(2,7) + "-" + (""+Math.random()).substring(2,7);
    const fourth = (""+Math.random()).substring(2,6) + "-" + (""+Math.random()).substring(2,6) + "-" + (""+Math.random()).substring(2,6) + "-" +  (""+Math.random()).substring(2,6);
    const fifth = (""+Math.random()).substring(2,6) + "-" + (""+Math.random()).substring(2,6) + "-" + (""+Math.random()).substring(2,6) + "-"+ (""+Math.random()).substring(2,6) + "-" + (""+Math.random()).substring(2,6) + "-" + (""+Math.random()).substring(2,6);
    const sixth = (""+Math.random()).substring(2,5) + "-" + (""+Math.random()).substring(2,5) + "-" + (""+Math.random()).substring(2,5);
    const seventh = (""+Math.random()).substring(2,4) + "-" + (""+Math.random()).substring(2,4) + "-" + (""+Math.random()).substring(2,4) + "-"+ (""+Math.random()).substring(2,4);
    return {redAward: redAward, first: first, second: second, third: third, fourth: fourth, fifth: fifth, sixth: sixth, seventh: seventh};
}


const processOrders = async (io, prevEndTime) => {
  const lottoNumbers = createLottoNumbers();
  await Staging.updateOne({gameType: 'northern'}, {
    redAward: lottoNumbers.redAward, first: lottoNumbers.first, second: lottoNumbers.second, third: lottoNumbers.third, fourth: lottoNumbers.fourth, fifth: lottoNumbers.fifth, sixth: lottoNumbers.sixth, seventh: lottoNumbers.seventh
  });
  
  const orders = await Order.find({gameType: 'northern', processed: false});
    if (orders.length === 0) {
        const endTime = Date.now() + 86400000;
        await Staging.updateOne({gameType: "northern"}, {endTime: endTime });
        io.in('northern').emit('new game start');
        startLoopProcessor(io, endTime);
    }
    else {
        for(let order of orders) {
            switch(order.betType) {
                case 'backpack': {
                    await processBackpack(order, lottoNumbers);
                    break;
                }
                case 'loxien': {
                    console.log('loxien')
                    break;
                }
                case 'score': {
                    console.log('score');
                    break;
                }
                case 'headandtail': {
                    console.log('headandtail');
                    break;
                }
                case '3more': {
                    console.log('3more');
                    break;
                }
                case '4more': {
                    console.log('4more');
                    break;
                }
                default: {
                    console.log('default');
                    break;
                }
            }
        }
    }
}

const startLoopProcessor = async (io, endTime) => {
    let duration = endTime - Date.now();
    let interval = setInterval(() => {
        duration -= 1000;
        console.log(duration);
        io.in('northern').emit('timer', duration);
        if(duration < 0) {
            clearInterval(interval);
            processOrders(io, endTime);
        }
    }, 1000);
};

exports.startNorthernDaemon = async io => {
    const gameInfo = Staging.findOne({gameType: 'northern'});
    if (gameInfo && gameInfo.endTime > Date.now()) {
        startLoopProcessor(io, gameInfo.endTime);
    } else {
        const endTime = Date.now() + 86400000; //set time duration
        if (gameInfo && gameInfo.endTime <= Date.now()) {
            await Staging.updateOne({gameType: 'northern'}, {endTime: endTime});
        } else {
            const newStaging = new Staging({
                gameType: 'northern',
                endTime: endTime
            });
            await newStaging.save();
        }
        startLoopProcessor(io, endTime);
    }

}

