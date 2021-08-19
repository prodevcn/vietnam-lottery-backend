const Staging = require("../../models/staging");
const Order = require("../../models/order");
const User = require("../../models/user");
const Result = require("../../models/result");
const History = require("../../models/history");
const { durations, winRates } = require("../../config/game");

const {
  create18LottoNumbers,
  getLast2digits_18,
  getLast3digits_18,
  getLast4digits_18,
  getFirstPrizeFirst2digits_18,
  getRedAwardFirst2digits_18,
  getFirstPrizeLast2digits_18,
  getRedAwardLast2digits_18,
  get3PinHeadAndTail_18,
  get3PinRedAward_18,
  get4PinRedAward_18,
  getScoreHeadAndTail_18,
} = require("../lib");

const saveHistory = async (order, totalPoints, matched_count, lottoNumbers) => {
  let ordered_userInfo = await User.findOne({ _id: order.userId });
  console.log(lottoNumbers);
  let newHistory = new History({
    userId: order.userId,
    gameType: "saigon",
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
  await User.updateOne({ _id: order.userId }, { balance: ordered_userInfo.balance + totalPoints });
  await Order.updateOne({ _id: order._id }, { processed: true, status: matched_count > 0 ? "win" : "lose" });
};

const processBackpack = async (order, lottoNumbers) => {
  let totalPoints = 0;
  let matched_count = 0;
  let order_numbers = order.numbers.split(";");
  order_numbers.pop();
  console.log("[PROCESS:BACKPACK]");
  switch (order.digitType) {
    case "lot2":
      let last2digits = getLast2digits_18(lottoNumbers);
      matched_count = order_numbers.filter((e) => last2digits.includes(e)).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot18.backpack.lot2 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "lot2_1K":
      let first2digits = getLast2digits_18(lottoNumbers);
      matched_count = order_numbers.filter((e) => first2digits.includes(e)).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot18.backpack.lot2_1K * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "lot3":
      let last3digits = getLast3digits_18(lottoNumbers);
      matched_count = order_numbers.filter((e) => last3digits.includes(e)).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot18.backpack.lot3 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "lot4":
      let last4digits = getLast4digits_18(lottoNumbers);
      matched_count = order_numbers.filter((e) => last4digits.includes(e)).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot18.backpack.lot4 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    default:
      return;
  }
};

const processLoxien = async (order, lottoNumbers) => {
  let totalPoints = 0;
  let matched_count = 0;
  let order_numbers = order.numbers.split(";");
  order_numbers.pop();
  let last2digits = getLast2digits_18(lottoNumbers);
  console.log("[PROCESS:LOXIEN]]");
  switch (order.digitType) {
    case "xien2":
      for (let pair of order_numbers) {
        let elements = pair.split("&");
        if (elements.every((e) => last2digits.includes(e))) {
          matched_count++;
        }
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot18.loxien.loxien2 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "xien3":
      for (let pair of order_numbers) {
        let elements = pair.split("&");
        if (elements.every((e) => last2digits.includes(e))) {
          matched_count++;
        }
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot18.loxien.loxien3 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "xien4":
      for (let pair of order_numbers) {
        let elements = pair.split("&");
        if (elements.every((e) => last2digits.includes(e))) {
          matched_count++;
        }
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot18.loxien.loxien3 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    default:
      return;
  }
};

const processScore = async (order, lottoNumbers) => {
  let totalPoints = 0;
  let matched_count = 0;
  let order_numbers = order.numbers.split(";");
  order_numbers.pop();
  switch (order.digitType) {
    case "first":
      let firstPrizeLast2digit = getFirstPrizeLast2digits_18(lottoNumbers);
      matched_count = order_numbers.filter((e) => e == firstPrizeLast2digit).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot18.score.first * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "special_topics":
      let redAwardLast2digit = getRedAwardLast2digits_18(lottoNumbers);
      matched_count = order_numbers.filter((e) => e == redAwardLast2digit).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot18.score.special_topics * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "special_headline":
      let redAwardFirst2digit = getRedAwardFirst2digits_18(lottoNumbers);
      matched_count = order_numbers.filter((e) => e == redAwardFirst2digit).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot18.score.special_headline * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "special_heading":
      matched_count = order_numbers.filter((e) => e == lottoNumbers.eighth).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot18.score.special_heading * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "special_headandtail":
      let headandtail = getScoreHeadAndTail_18(lottoNumbers);
      matched_count = order_numbers.filter((e) => headandtail.includes(e)).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot18.score.special_headandtail * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "first_de":
      let firstPrizeFirst2digit = getFirstPrizeFirst2digits_18(lottoNumbers);
      matched_count = order_numbers.filter((e) => e == firstPrizeFirst2digit).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot18.score.first_de * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    default:
      return;
  }
};

const processHeadAndTail = async (order, lottoNumbers) => {
  let totalPoints = 0;
  let matched_count = 0;
  let order_numbers = order.numbers.split(";");
  order_numbers.pop();
  switch (order.digitType) {
    case "head":
      let tenthDigit = lottoNumbers.redAward.substr(4, 1);
      matched_count = order_numbers.filter((e) => e == tenthDigit).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot18.headandtail.head * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "tail":
      let unitDigit = lottoNumbers.redAward.substr(5, 1);
      matched_count = order_numbers.filter((e) => e == unitDigit).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot18.headandtail.tail * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    default:
      return;
  }
};

const processThreeMore = async (order, lottoNumbers) => {
  let totalPoints = 0;
  let matched_count = 0;
  let order_numbers = order.numbers.split(";");
  order_numbers.pop();
  switch (order.digitType) {
    case "pin3":
      matched_count = order_numbers.filter((e) => e == lottoNumbers.seventh).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot18.threeMore.pin3 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "pin3_headandtail":
      let pin3HeadAndTail = get3PinHeadAndTail_18(lottoNumbers);
      matched_count = order_numbers.filter((e) => pin3HeadAndTail.includes(e)).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot18.threeMore.pin3_headandtail * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "special_pin3":
      let pin3Special = get3PinRedAward_18(lottoNumbers);
      matched_count = order_numbers.filter((e) => e == pin3Special).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot18.threeMore.special_pin3 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    default:
      return;
  }
};

const processFourMore = async (order, lottoNumbers) => {
  let totalPoints = 0;
  let order_numbers = order.numbers.split(";");
  order_numbers.pop();
  let pin4Special = get4PinRedAward_18(lottoNumbers);
  let matched_count = order_numbers.filter((e) => e == pin4Special).length;
  if (matched_count == 0) {
    totalPoints = 0;
  } else {
    totalPoints = (2 * matched_count - 1) * winRates.lot18.fourMore * order.multiple;
  }
  await saveHistory(order, totalPoints, matched_count, lottoNumbers);
  return;
};

const processSlide = async (order, lottoNumbers) => {
  let totalPoints = 0;
  let matched_count = 0;
  let order_numbers = order.numbers.split(";");
  order_numbers.pop();
  let last2digits = getLast2digits_18(lottoNumbers);
  switch (order.digitType) {
    case "slide4":
      for (let pair of order_numbers) {
        let elements = pair.split("&");
        if (elements.every((e) => !last2digits.includes(e))) {
          matched_count++;
        }
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot18.slide.slide4 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "slide8":
      for (let pair of order_numbers) {
        let elements = pair.split("&");
        if (elements.every((e) => !last2digits.includes(e))) {
          matched_count++;
        }
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot18.slide.slide8 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    case "slide10":
      for (let pair of order_numbers) {
        let elements = pair.split("&");
        if (elements.every((e) => !last2digits.includes(e))) {
          matched_count++;
        }
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints = (2 * matched_count - 1) * winRates.lot18.slide.slide10 * order.multiple;
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    default:
      return;
  }
};

const processOrders = async (io, prevEndTime) => {
  let lottoNumbers = create18LottoNumbers();
  let newResult = new Result({
    endTime: prevEndTime,
    gameType: "saigon",
    numbers: lottoNumbers,
  });

  await newResult.save();
  await Staging.updateOne({ gameType: "saigon" }, { numbers: lottoNumbers });
  let orders = await Order.find({ gameType: "saigon", processed: false });
  if (orders.length === 0) {
    let endTime = Date.now() + durations.normal;
    await Staging.updateOne({ gameType: "saigon" }, { endTime: endTime });
    io.in("saigon").emit("new game start", "saigon");
    startLoopProcess(io, endTime);
  } else {
    for (let order of orders) {
      switch (order.betType) {
        case "backpack": {
          await processBackpack(order, lottoNumbers);
          break;
        }
        case "loxien": {
          await processLoxien(order, lottoNumbers);
          break;
        }
        case "score": {
          await processScore(order, lottoNumbers);
          break;
        }
        case "headandtail": {
          await processHeadAndTail(order, lottoNumbers);
          break;
        }
        case "threeMore": {
          await processThreeMore(order, lottoNumbers);
          break;
        }
        case "fourMore": {
          await processFourMore(order, lottoNumbers);
          break;
        }
        case "slide": {
          await processSlide(order, lottoNumbers);
          break;
        }
        case "jackpot": {
          await processJackpot(order, lottoNumbers);
          break;
        }
        default:
          break;
      }
    }
    // await Order.deleteMany({});
    let endTime = Date.now() + durations.normal;
    await Staging.updateOne({ gameType: "saigon" }, { endTime: endTime });
    io.in("saigon").emit("new game start", "saigon");
    startLoopProcess(io, endTime);
  }
};

const startLoopProcess = async (io, endTime) => {
  let duration = endTime - Date.now();
  let interval = setInterval(() => {
    duration -= 1000;
    io.in("saigon").emit("timer", { duration: duration, game: "saigon" });
    if (duration < 0) {
      clearInterval(interval);
      processOrders(io, endTime);
    }
  }, 1000);
};

exports.startSaigonDaemon = async (io) => {
  console.log("[START]:[SAIGON_DAEMON]");
  let gameInfo = await Staging.findOne({ gameType: "saigon" });
  if (gameInfo) {
    if (gameInfo.endTime > Date.now()) {
      startLoopProcess(io, gameInfo.endTime);
    } else {
      let newEndTime = Date.now() + durations.normal;
      await Staging.updateOne({ gameType: "saigon" }, { endTime: newEndTime });
      startLoopProcess(io, newEndTime);
    }
  } else {
    let endTime = Date.now() + durations.normal;
    let newStaging = new Staging({
      gameType: "saigon",
      endTime: endTime,
    });
    await newStaging.save();
    startLoopProcess(io, endTime);
  }
};
