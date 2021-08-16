const Staging = require('../models/staging');
const Order = require('../models/order');
const User = require('../models/user');
const Result = require('../models/result');
const History = require('../models/history');

const {durations, winRates} = require('../config/game');

const processOrders = async (io, prevEndTime) => {
  console.log('[PROCESS_ORDER]');
  let lottoNumbers = create27LottoNumbers();
  let newResult = new Result({
      endTime: prevEndTime,
      gameType: 'vip',
      numbers: lottoNumbers
  });

  await newResult.save();
  await Staging.updateOne({gameType: 'vip'}, {numbers: lottoNumbers});
  let orders = await Order.find({gameType: 'vip', processed: false});
  console.log(orders);
  if (orders.length === 0) {
      let endTime = Date.now() + durations.normal;
      await Staging.updateOne({gameType: "vip"}, {endTime: endTime });
      io.in('vip').emit('new game start', 'vip');
      startLoopProcess(io, endTime);
  }
  else {
      for(let order of orders) {
          switch(order.betType) {
              case 'backpack': {
                  console.log('[BACKPACK]');
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
              case 'threeMore': {
                  await processThreeMore(order, lottoNumbers);
                  break;
              }
              case 'fourMore': {
                  await processFourMore(order, lottoNumbers);
                  break;
              }
              case 'slide': {
                  await processSlide(order, lottoNumbers);
                  break;
              }
              case 'jackpot': {
                  await processJackpot(order, lottoNumbers);
                  break;
              }
              default:
                  break;
          }
      }
      // await Order.deleteMany({});
      let endTime = Date.now() + durations.normal;
      await Staging.updateOne({gameType: "vip"}, {endTime: endTime });
      io.in('vip').emit('new game start', 'vip');
      startLoopProcess(io, endTime);
  }
}

const startLoopProcess = async (io, endTime) => {
  let duration = endTime - Date.now();
  let interval = setInterval(() => {
      duration -= 1000;
      console.log(duration);
      io.in('vip').emit('timer', {duration: duration, game: 'vip'});
      if(duration < 0) {
          clearInterval(interval);
          processOrders(io, endTime);
      }
  }, 1000);
};

exports.startVipDaemon = async io => {
  console.log('[START]:[VIP_DAEMON]');
  let gameInfo = await Staging.findOne({gameType: 'vip'});
  if (gameInfo) {
      if (gameInfo.endTime > Date.now()) {
          startLoopProcess(io, gameInfo.endTime);
      } else {
          let newEndTime = Date.now() + durations.normal;
          await Staging.updateOne({gameType: 'vip'}, {endTime: newEndTime});
          startLoopProcess(io, newEndTime);
      }
  } else {
      let endTime = Date.now() + durations.normal;
      let newStaging = new Staging({
          gameType: 'vip',
          endTime: endTime
      });
      await newStaging.save();
      startLoopProcess(io, endTime);
  }
};