const Staging = require('../models/staging');
const Order = require('../models/order');
const User = require('../models/user');
const Result = require('../models/result');
const History = require('../models/history');
const {
    createLottoNumbers,
    getLast2digits,
    getFirst2digits,
    getLast3digits,
    getLast4digits,
    getFirstPrizeFirst2digits,
    getRedAwardFirst2digits,
    getFirstPrizeLast2digits,
    getRedAwardLast2digits,
    get7thNumbers,
    get3PinNumbers,
    get3PinHeadAndTail,
    get3PinRedAward,
    get4PinRedAward,
} = require('./lib');
const {durations, winRates} = require('../config/game');

const saveHistory = async (order, totalPoints, matched_count) => {
    const ordered_userInfo = await User.findOne({_id: order.userId});
    const newHistory = new History({
        userId: order.userId,
        gameType: order.userId,
        betType: order.betType,
        digitType: order.digitType,
        resultNumbers: lottoNumbers,
        numbers: order.numbers,
        multiple: order.multiple,
        bettingAmount: order.bettingAmount,
        winningAmount: totalPoints,
        processed: true,
        status: matched_count > 0 ? 'win' : 'lose'
    });
    await newHistory.save();
    await User.updateOne({_id: order.userId},{balance: ordered_userInfo.balance + totalPoints});
    await Order.updateOne({_id: order._id}, {processed: true});
}

const processBackpack = async (order, lottoNumbers) => {
    let totalPoints = 0;
    switch(order.digitType) {
        case 'lot2':
            const order_numbers = order.numbers.split(';');
            order_numbers.pop();
            const last2digits = getLast2digits(lottoNumbers);
            const matched_count = order_numbers.filter(e => last2digits.includes(e)).length;
            if (matched_count == 0) {
                totalPoints = 0;
            } else {
                totalPoints = (2 * matched_count - 1) * winRates.northern.backpack.lot2 * order.multiple;
            }
            await saveHistory(order, totalPoints, matched_count);
            return;
        case 'lot2_1K':
            const order_numbers = order.numbers.split(';');
            order_numbers.pop();
            const first2digits = getFirst2digits(lottoNumbers);
            const matched_count = order_numbers.filter(e => first2digits.includes(e)).length;
            if (matched_count == 0) {
                totalPoints = 0;
            } else {
                totalPoints = (2 * matched_count - 1) * winRates.northern.backpack.lot2_1K * order.multiple;
            }
            await saveHistory(order, totalPoints, matched_count);
            return;
        case 'lot3':
            const order_numbers = order.numbers.split(';');
            order_numbers.pop();
            const last3digits = getLast3digits(lottoNumbers);
            const matched_count = order_numbers.filter(e => last3digits.includes(e)).length;
            if (matched_count == 0) {
                totalPoints = 0;
            } else {
                totalPoints = (2 * matched_count - 1) * winRates.northern.backpack.lot3 * order.multiple;
            }
            await saveHistory(order, totalPoints, matched_count);
            return;
        case 'lot4': 
            const order_numbers = order.numbers.split(';');
            order_numbers.pop();
            const last4digits = getLast4digits(lottoNumbers);
            const matched_count = order_numbers.filter(e => last4digits.includes(e)).length;
            if (matched_count == 0) {
                totalPoints = 0;
            } else {
                totalPoints = (2 * matched_count - 1) * winRates.northern.backpack.lot4 * order.multiple;
            }
            await saveHistory(order, totalPoints, matched_count);
            return;
        default:
            return;
    }
} 

const processLoxien = async (order, lottoNumbers) => {
    let totalPoints = 0;
    switch(order.digitType) {
        case 'xien2':
            let matched_count = 0;
            const order_numbers = order.numbers.split(';');
            order_numbers.pop();
            const last2digits = getLast2digits(lottoNumbers);
            for(let pair of order_numbers) {
                const elements = pair.split('&');
                if (elements.every(e => last2digits.includes(e))) {
                    matched_count ++;
                }
            }
            if (matched_count == 0) {
                totalPoints = 0;
            } else {
                totalPoints = (2 * matched_count - 1) * winRates.northern.loxien.loxien2 * order.multiple;
            }
            await saveHistory(order, totalPoints, matched_count);
            return;
        case 'xien3':
            let matched_count = 0;
            const order_numbers = order.numbers.split(';');
            order_numbers.pop();
            const last2digits = getLast2digits(lottoNumbers);
            for(let pair of order_numbers) {
                const elements = pair.split('&');
                if (elements.every(e => last2digits.includes(e))) {
                    matched_count ++;
                }
            }
            if (matched_count == 0) {
                totalPoints = 0;
            } else {
                totalPoints = (2 * matched_count - 1) * winRates.northern.loxien.loxien3 * order.multiple;
            }
            await saveHistory(order, totalPoints, matched_count);
            return;
        case 'xien4':
            let matched_count = 0;
            const order_numbers = order.numbers.split(';');
            order_numbers.pop();
            const last2digits = getLast2digits(lottoNumbers);
            for(let pair of order_numbers) {
                const elements = pair.split('&');
                if (elements.every(e => last2digits.includes(e))) {
                    matched_count ++;
                }
            }
            if (matched_count == 0) {
                totalPoints = 0;
            } else {
                totalPoints = (2 * matched_count - 1) * winRates.northern.loxien.loxien3 * order.multiple;
            }
            await saveHistory(order, totalPoints, matched_count);
            return;
        default:
            return;
    }
}

const processScore = async (order, lottoNumbers) => {
    let totalPoints = 0;
    switch(order.digitType) {
        case 'first':
            const order_numbers = order.numbers.split(';');
            order_numbers.pop();
            const firstPrizeLast2digit = getFirstPrizeLast2digits(lottoNumbers);
            const matched_count = order_numbers.filter(e => e == firstPrizeLast2digit).length;
            if (matched_count == 0) {
                totalPoints = 0;
            } else {
                totalPoints = (2 * matched_count - 1) * winRates.northern.score.first * order.multiple;
            }
            await saveHistory(order, totalPoints, matched_count);
            return;
        case 'special_topics':
            const order_numbers = order.numbers.split(';');
            order_numbers.pop();
            const redAwardLast2digit = getRedAwardLast2digits(lottoNumbers);
            const matched_count = order_numbers.filter(e => e == redAwardLast2digit).length;
            if (matched_count == 0) {
                totalPoints = 0;
            } else {
                totalPoints = (2 * matched_count - 1) * winRates.northern.score.special_topics * order.multiple;
            }
            await saveHistory(order, totalPoints, matched_count);
            return;
        case 'special_headline':
            const order_numbers = order.numbers.split(';');
            order_numbers.pop();
            const redAwardLast2digit = getRedAwardFirst2digits(lottoNumbers);
            const matched_count = order_numbers.filter(e => e == redAwardLast2digit).length;
            if (matched_count == 0) {
                totalPoints = 0;
            } else {
                totalPoints = (2 * matched_count - 1) * winRates.northern.score.special_headline * order.multiple;
            }
            await saveHistory(order, totalPoints, matched_count);
            return;
        case 'problem':
            const order_numbers = order.numbers.split(';');
            order_numbers.pop();
            const seventhNumbers = get7thNumbers(lottoNumbers);
            const matched_count = order_numbers.filter(e => seventhNumbers.includes(e)).length;
            if (matched_count == 0) {
                totalPoints = 0;
            } else {
                totalPoints = (2 * matched_count - 1) * winRates.northern.score.problem * order.multiple;
            }
            await saveHistory(order, totalPoints, matched_count);
            return;
        case 'first_de':
            const order_numbers = order.numbers.split(';');
            order_numbers.pop();
            const firstPrizeFirst2digit = getFirstPrizeFirst2digits(lottoNumbers);
            const matched_count = order_numbers.filter(e => e == firstPrizeFirst2digit).length;
            if (matched_count == 0) {
                totalPoints = 0;
            } else {
                totalPoints = (2 * matched_count - 1) * winRates.northern.score.first_de * order.multiple;
            }
            await saveHistory(order, totalPoints, matched_count);
            return;
        default:
            return;
    }
}

const processHeadAndTail = async (order, lottoNumbers) => {
    let totalPoints = 0;
    switch(order.digitType) {
        case 'head':
            const order_numbers = order.numbers.split(';');
            order_numbers.pop();
            const tenthDigit = lottoNumbers.redAward.substr(3, 4);
            const matched_count = order_numbers.filter(e => e == tenthDigit).length;
            if (matched_count == 0) {
                totalPoints = 0;
            } else {
                totalPoints = (2 * matched_count - 1) * winRates.northern.headandtail.head * order.multiple;
            }
            await saveHistory(order, totalPoints, matched_count);
            return;
        case 'tail':
            const order_numbers = order.numbers.split(';');
            order_numbers.pop();
            const unitDigit = lottoNumbers.redAward.substr(4, 5);
            const matched_count = order_numbers.filter(e => e == unitDigit).length;
            if (matched_count == 0) {
                totalPoints = 0;
            } else {
                totalPoints = (2 * matched_count - 1) * winRates.northern.headandtail.tail * order.multiple;
            }
            await saveHistory(order, totalPoints, matched_count);
            return;
        default:
            return;
    }
};

const process3more = async (order, lottoNumbers) => {
    let totalPoints = 0;
    switch(order.digitType) {
        case 'pin3':
            const order_numbers = order.numbers.split(';');
            order_numbers.pop();
            const pin3Numbers = get3PinNumbers(lottoNumbers);
            const matched_count = order_numbers.filter(e => pin3Numbers.includes(e)).length;
            if (matched_count == 0) {
                totalPoints = 0;
            } else {
                totalPoints = (2 * matched_count - 1) * winRates.northern.threeMore.pin3 * order.multiple;
            }
            await saveHistory(order, totalPoints, matched_count);
            return;
        case 'pin3_headandtail':
            const order_numbers = order.numbers.split(';');
            order_numbers.pop();
            const pin3HeadAndTail = get3PinHeadAndTail(lottoNumbers);
            const matched_count = order_numbers.filter(e => pin3HeadAndTail.includes(e)).length;
            if (matched_count == 0) {
                totalPoints = 0;
            } else {
                totalPoints = (2 * matched_count - 1) * winRates.northern.threeMore.pin3_headandtail * order.multiple;
            }
            await saveHistory(order, totalPoints, matched_count);
            return;
        case 'special_pin3':
            const order_numbers = order.numbers.split(';');
            order_numbers.pop();
            const pin3Special = get3PinRedAward(lottoNumbers);
            const matched_count = order_numbers.filter(e => e == pin3Special).length;
            if (matched_count == 0) {
                totalPoints = 0;
            } else {
                totalPoints = (2 * matched_count - 1) * winRates.northern.threeMore.special_pin3 * order.multiple;
            }
            await saveHistory(order, totalPoints, matched_count);
            return;
        default:
            return;
    }
};

const process4more = async (order, lottoNumbers) => {
    let totalPoints = 0;
    const order_numbers = order.numbers.split(';');
    order_numbers.pop();
    const pin4Special = get4PinRedAward(lottoNumbers);
    const matched_count = order_numbers.filter(e => e == pin4Special).length;
    if (matched_count == 0) {
        totalPoints = 0;
    } else {
        totalPoints = (2 * matched_count - 1) * winRates.northern.fourMore * order.multiple;
    }
    await saveHistory(order, totalPoints, matched_count);
    return;
};

const processSlide = async (order, lottoNumbers) => {
    let totalPoints = 0;
    switch(order.digitType) {
        case 'slide4':
            let matched_count = 0;
            const order_numbers = order.numbers.split(';');
            order_numbers.pop();
            const last2digits = getLast2digits(lottoNumbers);
            for(let pair of order_numbers) {
                const elements = pair.split('&');
                if (elements.every(e => !last2digits.includes(e))) {
                    matched_count ++;
                }
            }
            if (matched_count == 0) {
                totalPoints = 0;
            } else {
                totalPoints = (2 * matched_count - 1) * winRates.northern.slide.slide4 * order.multiple;
            }
            await saveHistory(order, totalPoints, matched_count);
            return;
        case 'slide8':
            let matched_count = 0;
            const order_numbers = order.numbers.split(';');
            order_numbers.pop();
            const last2digits = getLast2digits(lottoNumbers);
            for(let pair of order_numbers) {
                const elements = pair.split('&');
                if (elements.every(e => !last2digits.includes(e))) {
                    matched_count ++;
                }
            }
            if (matched_count == 0) {
                totalPoints = 0;
            } else {
                totalPoints = (2 * matched_count - 1) * winRates.northern.slide.slide8 * order.multiple;
            }
            await saveHistory(order, totalPoints, matched_count);
            return;
        case 'slide12':
            let matched_count = 0;
            const order_numbers = order.numbers.split(';');
            order_numbers.pop();
            const last2digits = getLast2digits(lottoNumbers);
            for(let pair of order_numbers) {
                const elements = pair.split('&');
                if (elements.every(e => !last2digits.includes(e))) {
                    matched_count ++;
                }
            }
            if (matched_count == 0) {
                totalPoints = 0;
            } else {
                totalPoints = (2 * matched_count - 1) * winRates.northern.slide.loxien2 * order.multiple;
            }
            await saveHistory(order, totalPoints, matched_count);
            return;
        default:
            return;
    }
};


const processOrders = async (io, prevEndTime) => {
    const lottoNumbers = createLottoNumbers();
    const newResult = new Result({
        endTime: prevEndTime,
        gameType: 'northern',
        numbers: lottoNumbers
    });

    await newResult.save();
    await Staging.updateOne({gameType: 'northern'}, {numbers: lottoNumbers});
    const orders = await Order.find({gameType: 'northern', processed: false});
    if (orders.length === 0) {
        const endTime = Date.now() + durations.normal;
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
                    await processLoxien(order, lottoNumbers);
                    break;
                }
                case 'score': {
                    await processScore(order, lottoNumbers);
                    break;
                }
                case 'headandtail': {
                    await processHeadAndTail(order, lottoNumbers);
                    break;
                }
                case '3more': {
                    await process3more(order, lottoNumbers);
                    break;
                }
                case '4more': {
                    await process4more(order, lottoNumbers);
                    break;
                }
                case 'slide': {
                    await processSlide(order, lottoNumbers);
                    break;
                }
                default:
                    break;
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
    const gameInfo = await Staging.findOne({gameType: 'northern'});
    if (gameInfo) {
        if (gameInfo.endTime > Date.now()) {
            startLoopProcessor(io, gameInfo.endTime);
        } else {
            const newEndTime = Date.now() + durations.normal;
            await Staging.updateOne({gameType: 'northern'}, {endTime: newEndTime});
            startLoopProcessor(io, newEndTime);
        }
    } else {
        const endTime = Date.now() + durations.normal;
        const newStaging = new Staging({
            gameType: 'northern',
            endTime: endTime
        });
        await newStaging.save();
        startLoopProcessor(io, endTime);
    }
};

