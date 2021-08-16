const Staging = require('../../models/staging');
const Order = require('../../models/order');
const User = require('../../models/user');
const Result = require('../../models/result');
const History = require('../../models/history');
const {durations, winRates} = require('../../config/game');

const {
  create18LottoNumbers,
} = require('../lib');




const processOrders = async (io, prevEndTime) => {
  let lottoNumbers = create18LottoNumbers();
  let newResult = new Result({
      endTime: prevEndTime,
      gameType: 'saigon',
      numbers: lottoNumbers
  });

  await newResult.save();
  await Staging.updateOne({gameType: 'saigon'}, {numbers: lottoNumbers});
  let orders = await Order.find({gameType: 'saigon', processed: false});
  if (orders.length === 0) {
      let endTime = Date.now() + durations.normal;
      await Staging.updateOne({gameType: "saigon"}, {endTime: endTime });
      io.in('saigon').emit('new game start', 'saigon');
      startLoopProcess(io, endTime);
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
      await Staging.updateOne({gameType: "saigon"}, {endTime: endTime });
      io.in('saigon').emit('new game start', 'saigon');
      startLoopProcess(io, endTime);
  }
}


const startLoopProcess = async (io, endTime) => {
  let duration = endTime - Date.now();
  let interval = setInterval(() => {
      duration -= 1000;
      console.log(duration);
      io.in('saigon').emit('timer', {duration: duration, game: 'saigon'});
      if(duration < 0) {
          clearInterval(interval);
          processOrders(io, endTime);
      }
  }, 1000);
};

exports.startSaigonDaemon = async io => {
  console.log('[START]:[SAIGON_DAEMON]');
  let gameInfo = await Staging.findOne({gameType: 'saigon'});
  if (gameInfo) {
      if (gameInfo.endTime > Date.now()) {
          startLoopProcess(io, gameInfo.endTime);
      } else {
          let newEndTime = Date.now() + durations.normal;
          await Staging.updateOne({gameType: 'saigon'}, {endTime: newEndTime});
          startLoopProcess(io, newEndTime);
      }
  } else {
      let endTime = Date.now() + durations.normal;
      let newStaging = new Staging({
          gameType: 'saigon',
          endTime: endTime
      });
      await newStaging.save();
      startLoopProcess(io, endTime);
  }
};

