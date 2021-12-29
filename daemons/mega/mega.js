const axios = require('axios');
const Staging = require("../../models/staging");
const Order = require("../../models/order");
const User = require("../../models/user");
const Result = require("../../models/result");
const History = require("../../models/history");
const config = require('../../config');
const { createMegaLottoNumbers, getAllLot6Numbers } = require("../lib");
const { durations, winRates } = require("../../config/game");

const getCombinations = (arr, selectNumber) => {
  const results = [];
  if (selectNumber === 1) return arr.map((value) => [value]);
  arr.forEach((fixed, index, origin) => {
    const rest = origin.slice(index + 1);
    const combinations = getCombinations(rest, selectNumber - 1);
    const attached = combinations.map((combination) => [fixed, ...combination]);
    results.push(...attached);
  });

  return results;
}

const saveHistory = async (order, totalPoints, matched_count, lottoNumbers) => {
  let ordered_userInfo = await User.findOne({ userId: order.userId });
  let newHistory = new History({
    userId: order.userId,
    gameType: "mega",
    betType: order.betType,
    digitType: order.digitType,
    resultNumbers: lottoNumbers,
    numbers: order.numbers,
    multiple: order.multiple,
    betAmount: order.betAmount,
    winningAmount: totalPoints,
    processed: true,
    status: matched_count > 0 ? "win" : "lose",
  });
  await newHistory.save();
  await axios
      .post(
        `${config.SERVICE_URL}/create-transaction`, 
        {
          game: "lottopoka", 
          transactionId: order._id + 'f', 
          type: 'win',
          amount: totalPoints, 
        },
        {
          headers: {
            'Authorization': ordered_userInfo.token,
            'Content-Type': 'application/json'
          }
        }
      );
  await Order.updateOne({ _id: order._id }, { processed: true, status: matched_count > 0 ? "win" : "lose" });
};

const processNormal = async (order, lottoNumbers) => {
  let totalPoints = 0;
  let matched_count = 0;
  let order_numbers = order.numbers.split(";");
  order_numbers.pop();
  matched_count = order_numbers.filter((e) => getAllLot6Numbers(lottoNumbers).includes(e)).length;
  if (matched_count == 0) {
    totalPoints = 0;
  } else {
    totalPoints = (2 * matched_count - 1) * (winRates).lot6.normal.normal * order.multiple;
  }
  await saveHistory(order, totalPoints, matched_count, lottoNumbers);
  return;  
};

const processMultiple = async (order, lottoNumbers) => {
  let totalPoints = 0;
  let matched_count = 0;
  let order_numbers = order.numbers.split(";");
  let paired_numbers_arr = [];
  order_numbers.pop();
  switch(order.digitType) {
    case "multiple4":
      paired_numbers_arr = getCombinations(order_numbers, 4);
      for (let paired_numbers of paired_numbers_arr) {
        let sub_matched_count = paired_numbers.filter((e) => getAllLot6Numbers(lottoNumbers).includes(e)).length;
        if (sub_matched_count == 4) matched_count ++; 
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot6.multiple.multiple4 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "multiple3":
      paired_numbers_arr = getCombinations(order_numbers, 3);
      for (let paired_numbers of paired_numbers_arr) {
        let sub_matched_count = paired_numbers.filter((e) => getAllLot6Numbers(lottoNumbers).includes(e)).length;
        if (sub_matched_count == 3) matched_count ++; 
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot6.multiple.multiple4 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "multiple3_2":
      paired_numbers_arr = getCombinations(order_numbers, 3);
      for (let paired_numbers of paired_numbers_arr) {
        let sub_matched_count = paired_numbers.filter((e) => getAllLot6Numbers(lottoNumbers).includes(e)).length;
        if (sub_matched_count == 3) matched_count ++; 
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot6.multiple.multiple4 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "multiple2":
      paired_numbers_arr = getCombinations(order_numbers, 2);
      for (let paired_numbers of paired_numbers_arr) {
        let sub_matched_count = paired_numbers.filter((e) => getAllLot6Numbers(lottoNumbers).includes(e)).length;
        if (sub_matched_count == 2) matched_count ++; 
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot6.multiple.multiple4 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    default:
      return;   
  }
};

const processSlide = async (order, lottoNumbers) => {
  let totalPoints = 0;
  let matched_count = 0;
  let order_numbers = order.numbers.split(";");
  let paired_numbers_arr = [];
  order_numbers.pop();
  switch(order.digitType) {
    case "slide5":
      paired_numbers_arr = getCombinations(order_numbers, 5);
      for (let paired_numbers of paired_numbers_arr) {
        let sub_matched_count = paired_numbers.filter((e) => getAllLot6Numbers(lottoNumbers).includes(e)).length;
        if (sub_matched_count == 0 ) matched_count ++; 
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot6.slide.slide5 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "slide5":
      paired_numbers_arr = getCombinations(order_numbers, 5);
      for (let paired_numbers of paired_numbers_arr) {
        let sub_matched_count = paired_numbers.filter((e) => getAllLot6Numbers(lottoNumbers).includes(e)).length;
        if (sub_matched_count == 0 ) matched_count ++; 
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot6.slide.slide5 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "slide6":
      paired_numbers_arr = getCombinations(order_numbers, 6);
      for (let paired_numbers of paired_numbers_arr) {
        let sub_matched_count = paired_numbers.filter((e) => getAllLot6Numbers(lottoNumbers).includes(e)).length;
        if (sub_matched_count == 0 ) matched_count ++; 
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot6.slide.slide6 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "slide7":
      paired_numbers_arr = getCombinations(order_numbers, 7);
      for (let paired_numbers of paired_numbers_arr) {
        let sub_matched_count = paired_numbers.filter((e) => getAllLot6Numbers(lottoNumbers).includes(e)).length;
        if (sub_matched_count == 0 ) matched_count ++; 
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot6.slide.slide7 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "slide8":
      paired_numbers_arr = getCombinations(order_numbers, 8);
      for (let paired_numbers of paired_numbers_arr) {
        let sub_matched_count = paired_numbers.filter((e) => getAllLot6Numbers(lottoNumbers).includes(e)).length;
        if (sub_matched_count == 0 ) matched_count ++; 
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot6.slide.slide8 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "slide9":
      paired_numbers_arr = getCombinations(order_numbers, 9);
      for (let paired_numbers of paired_numbers_arr) {
        let sub_matched_count = paired_numbers.filter((e) => getAllLot6Numbers(lottoNumbers).includes(e)).length;
        if (sub_matched_count == 0 ) matched_count ++; 
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot6.slide.slide9 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "slide10":
      paired_numbers_arr = getCombinations(order_numbers, 10);
      for (let paired_numbers of paired_numbers_arr) {
        let sub_matched_count = paired_numbers.filter((e) => getAllLot6Numbers(lottoNumbers).includes(e)).length;
        if (sub_matched_count == 0 ) matched_count ++; 
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot6.slide.slide10 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    default:
      return;
  }
};

const processSelect = async (order, lottoNumbers) => {
  let totalPoints = 0;
  let matched_count = 0;
  let order_numbers = order.numbers.split(";");
  let paired_numbers_arr = [];
  order_numbers.pop();
  switch(order.digitType) {
    case "slide5":
      paired_numbers_arr = getCombinations(order_numbers, 5);
      for (let paired_numbers of paired_numbers_arr) {
        let sub_matched_count = paired_numbers.filter((e) => getAllLot6Numbers(lottoNumbers).includes(e)).length;
        if (sub_matched_count == 1 ) matched_count ++; 
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot6.slide.slide5 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "slide5":
      paired_numbers_arr = getCombinations(order_numbers, 5);
      for (let paired_numbers of paired_numbers_arr) {
        let sub_matched_count = paired_numbers.filter((e) => getAllLot6Numbers(lottoNumbers).includes(e)).length;
        if (sub_matched_count == 1 ) matched_count ++; 
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot6.slide.slide5 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "slide6":
      paired_numbers_arr = getCombinations(order_numbers, 6);
      for (let paired_numbers of paired_numbers_arr) {
        let sub_matched_count = paired_numbers.filter((e) => getAllLot6Numbers(lottoNumbers).includes(e)).length;
        if (sub_matched_count == 1 ) matched_count ++; 
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot6.slide.slide6 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "slide7":
      paired_numbers_arr = getCombinations(order_numbers, 7);
      for (let paired_numbers of paired_numbers_arr) {
        let sub_matched_count = paired_numbers.filter((e) => getAllLot6Numbers(lottoNumbers).includes(e)).length;
        if (sub_matched_count == 1 ) matched_count ++; 
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot6.slide.slide7 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "slide8":
      paired_numbers_arr = getCombinations(order_numbers, 8);
      for (let paired_numbers of paired_numbers_arr) {
        let sub_matched_count = paired_numbers.filter((e) => getAllLot6Numbers(lottoNumbers).includes(e)).length;
        if (sub_matched_count == 1 ) matched_count ++; 
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot6.slide.slide8 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "slide9":
      paired_numbers_arr = getCombinations(order_numbers, 9);
      for (let paired_numbers of paired_numbers_arr) {
        let sub_matched_count = paired_numbers.filter((e) => getAllLot6Numbers(lottoNumbers).includes(e)).length;
        if (sub_matched_count == 1 ) matched_count ++; 
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot6.slide.slide9 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "slide10":
      paired_numbers_arr = getCombinations(order_numbers, 10);
      for (let paired_numbers of paired_numbers_arr) {
        let sub_matched_count = paired_numbers.filter((e) => getAllLot6Numbers(lottoNumbers).includes(e)).length;
        if (sub_matched_count == 1 ) matched_count ++; 
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot6.slide.slide10 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    default:
      return;
  }
};

const processOrders = async (io, prevEndTime) => {
  let lottoNumbers = createMegaLottoNumbers();
  let newResult = new Result({
    endTime: prevEndTime,
    gameType: "mega",
    numbers: lottoNumbers,
  });
  await newResult.save();
  await Staging.updateOne({ gameType: "mega" }, { numbers: lottoNumbers });
  let orders = await Order.find({ gameType: "mega", processed: false });
  if (orders.length === 0) {
    let endTime = Date.now() + durations.perMinute;
    await Staging.updateOne({ gameType: "mega" }, { endTime: endTime });
    io.in("mega").emit("START_NEW_GAME", "mega");
    startLoopProcess(io, endTime);
  } else {
    for (let order of orders) {
      switch (order.betType) {
        case "normal":
          await processNormal(order, lottoNumbers);
          break;
        case "multiple":
          await processMultiple(order, lottoNumbers);
          break;
        case "slide":
          await processSlide(order, lottoNumbers);
          break;
        case "select":
          await processSelect(order, lottoNumbers);
          break;
        default:
          break;
      }
    }
    // await Order.deleteMany({});
    let endTime = Date.now() + durations.perMinute;
    await Staging.updateOne({ gameType: "mega" }, { endTime: endTime });
    io.in("mega").emit("START_NEW_GAME", "mega");
    startLoopProcess(io, endTime);
  }
  await newResult.save();
  await Staging.updateOne;
};

const startLoopProcess = async (io, endTime) => {
  let duration = endTime - Date.now();
  let interval = setInterval(() => {
    duration -= 1000;
    io.in("mega").emit("TIMER", { duration: duration, game: "mega" });
    if (duration < 0) {
      clearInterval(interval);
      processOrders(io, endTime);
    }
  }, 1000);
};

exports.startMegaDaemon = async (io) => {
  console.log("[START]:[MEGA_DAEMON]");
  let gameInfo = await Staging.findOne({ gameType: "mega" });
  if (gameInfo) {
    if (gameInfo.endTime > Date.now()) {
      const endT = new Date(gameInfo.endTime).getTime();
      startLoopProcess(io, endT);
    } else {
      let newEndTime = Date.now() + durations.perMinute;
      await Staging.updateOne({ gameType: "mega" }, { endTime: newEndTime });
      startLoopProcess(io, newEndTime);
    }
  } else {
    let endTime = Date.now() + durations.perMinute;
    let newStaging = new Staging({
      gameType: "mega",
      endTime: endTime,
    });
    await newStaging.save();
    startLoopProcess(io, endTime);
  }
};
