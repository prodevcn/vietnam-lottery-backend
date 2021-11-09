const _ = require("lodash");
const axios = require('axios');
const config = require('../config');
const parse = require('node-html-parser');
const {sendEmail} = require('../helpers/mailer');

exports.getLast2digits = (value) => {
  let arr = [];
  const red = value.redAward.substr(3, 2);
  arr.push(red);
  const first = value.first.substr(3, 2);
  arr.push(first);
  const second = value.second.split("-").map((item) => {
    return item.substr(3, 2);
  });
  arr = arr.concat(second);
  const third = value.third.split("-").map((item) => {
    return item.substr(3, 2);
  });
  arr = arr.concat(third);
  const fourth = value.fourth.split("-").map((item) => {
    return item.substr(2, 2);
  });
  arr = arr.concat(fourth);
  const fifth = value.fifth.split("-").map((item) => {
    return item.substr(2, 2);
  });
  arr = arr.concat(fifth);
  const sixth = value.sixth.split("-").map((item) => {
    return item.substr(1, 2);
  });
  arr = arr.concat(sixth);
  const seventh = value.seventh.split("-");
  arr = arr.concat(seventh);
  return arr;
};

exports.getFirst2digits = (value) => {
  let arr = [];
  const red = value.redAward.substr(0, 2);
  arr.push(red);
  const first = value.first.substr(0, 2);
  arr.push(first);
  const second = value.second.split("-").map((item) => {
    return item.substr(0, 2);
  });
  arr = arr.concat(second);
  const third = value.third.split("-").map((item) => {
    return item.substr(0, 2);
  });
  arr = arr.concat(third);
  const fourth = value.fourth.split("-").map((item) => {
    return item.substr(0, 2);
  });
  arr = arr.concat(fourth);
  const fifth = value.fifth.split("-").map((item) => {
    return item.substr(0, 2);
  });
  arr = arr.concat(fifth);
  const sixth = value.sixth.split("-").map((item) => {
    return item.substr(0, 2);
  });
  arr = arr.concat(sixth);
  return arr;
};

exports.getLast3digits = (value) => {
  let arr = [];
  const red = value.redAward.substr(2, 3);
  arr.push(red);
  const first = value.first.substr(2, 3);
  arr.push(first);
  const second = value.second.split("-").map((item) => {
    return item.substr(2, 3);
  });
  arr = arr.concat(second);
  const third = value.third.split("-").map((item) => {
    return item.substr(2, 3);
  });
  arr = arr.concat(third);
  const fourth = value.fourth.split("-").map((item) => {
    return item.substr(1, 3);
  });
  arr = arr.concat(fourth);
  const fifth = value.fifth.split("-").map((item) => {
    return item.substr(1, 3);
  });
  arr = arr.concat(fifth);
  const sixth = value.sixth.split("-");
  arr = arr.concat(sixth);
  return arr;
};

exports.getLast4digits = (value) => {
  let arr = [];
  const red = value.redAward.substr(1, 4);
  arr.push(red);
  const first = value.first.substr(1, 4);
  arr.push(first);
  const second = value.second.split("-").map((item) => {
    return item.substr(1, 4);
  });
  arr = arr.concat(second);
  const third = value.third.split("-").map((item) => {
    return item.substr(1, 4);
  });
  arr = arr.concat(third);
  const fourth = value.fourth.split("-");
  arr = arr.concat(fourth);
  const fifth = value.fifth.split("-");
  arr = arr.concat(fifth);
  return arr;
};

/** process for score */

exports.getFirstPrizeFirst2digits = (value) => {
  return value.first.substr(0, 2);
};

exports.getFirstPrizeLast2digits = (value) => {
  return value.first.substr(3, 2);
};

exports.getRedAwardFirst2digits = (value) => {
  return value.redAward.substr(0, 2);
};

exports.getRedAwardLast2digits = (value) => {
  return value.redAward.substr(3, 2);
};

exports.get7thNumbers = (value) => {
  return value.seventh.split("-");
};

exports.get3PinNumbers = (value) => {
  return value.sixth.split("-");
};

exports.get3PinHeadAndTail = (value) => {
  let arr = [];
  const sixth = value.sixth.split("-");
  arr.concat(sixth);
  const redAward = value.redAward.substr(2, 3);
  arr.push(redAward);
  return arr;
};

exports.get3PinRedAward = (value) => {
  return value.redAward.substr(2, 3);
};

exports.get4PinRedAward = (value) => {
  return value.redAward.substr(1, 4);
};

/** create random numbers for lottery */
exports.create27LottoNumbers = () => {
  const redAward = ("" + Math.random()).substring(2, 7);
  const first = ("" + Math.random()).substring(2, 7);
  const second = ("" + Math.random()).substring(2, 7) + "-" + ("" + Math.random()).substring(2, 7);
  const third =
    ("" + Math.random()).substring(2, 7) +
    "-" +
    ("" + Math.random()).substring(2, 7) +
    "-" +
    ("" + Math.random()).substring(2, 7) +
    "-" +
    ("" + Math.random()).substring(2, 7) +
    "-" +
    ("" + Math.random()).substring(2, 7) +
    "-" +
    ("" + Math.random()).substring(2, 7);
  const fourth =
    ("" + Math.random()).substring(2, 6) +
    "-" +
    ("" + Math.random()).substring(2, 6) +
    "-" +
    ("" + Math.random()).substring(2, 6) +
    "-" +
    ("" + Math.random()).substring(2, 6);
  const fifth =
    ("" + Math.random()).substring(2, 6) +
    "-" +
    ("" + Math.random()).substring(2, 6) +
    "-" +
    ("" + Math.random()).substring(2, 6) +
    "-" +
    ("" + Math.random()).substring(2, 6) +
    "-" +
    ("" + Math.random()).substring(2, 6) +
    "-" +
    ("" + Math.random()).substring(2, 6);
  const sixth = ("" + Math.random()).substring(2, 5) + "-" + ("" + Math.random()).substring(2, 5) + "-" + ("" + Math.random()).substring(2, 5);
  const seventh =
    ("" + Math.random()).substring(2, 4) +
    "-" +
    ("" + Math.random()).substring(2, 4) +
    "-" +
    ("" + Math.random()).substring(2, 4) +
    "-" +
    ("" + Math.random()).substring(2, 4);
  return { redAward: redAward, first: first, second: second, third: third, fourth: fourth, fifth: fifth, sixth: sixth, seventh: seventh };
};

exports.createMegaLottoNumbers = () => {
  var numbers = [];
  var size = 6;
  var lowest = 1;
  var highest = 45;
  for (var i = 0; i < size; i++) {
    var add = true;
    var randomNumber = Math.floor(Math.random() * highest) + 1;
    for (var y = 0; y < highest; y++) {
      if (numbers[y] == randomNumber) {
        add = false;
      }
    }
    if (add) {
      numbers.push(randomNumber);
    } else {
      i--;
    }
  }
  var highestNumber = 0;
  for (var m = 0; m < numbers.length; m++) {
    for (var n = m + 1; n < numbers.length; n++) {
      if (numbers[n] < numbers[m]) {
        highestNumber = numbers[m];
        numbers[m] = numbers[n];
        numbers[n] = highestNumber;
      }
    }
  }
  const labels = ["first", "second", "third", "fourth", "fifth", "sixth"];
  const _target = {};
  for (let index = 0; index < 6; index++) {
    _target[labels[index]] = numbers[index] > 9 ? numbers[index].toString() : "0" + numbers[index];
  }
  return _target;
};

exports.create18LottoNumbers = () => {
  const redAward = ("" + Math.random()).substring(2, 8);
  const first = ("" + Math.random()).substring(2, 7);
  const second = ("" + Math.random()).substring(2, 7);
  const third = ("" + Math.random()).substring(2, 7) + "-" + ("" + Math.random()).substring(2, 7);
  const fourth =
    ("" + Math.random()).substring(2, 7) +
    "-" +
    ("" + Math.random()).substring(2, 7) +
    "-" +
    ("" + Math.random()).substring(2, 7) +
    "-" +
    ("" + Math.random()).substring(2, 7) +
    "-" +
    ("" + Math.random()).substring(2, 7) +
    "-" +
    ("" + Math.random()).substring(2, 7) +
    "-" +
    ("" + Math.random()).substring(2, 7);
  const fifth = ("" + Math.random()).substring(2, 6);
  const sixth = ("" + Math.random()).substring(2, 6) + "-" + ("" + Math.random()).substring(2, 6) + "-" + ("" + Math.random()).substring(2, 6);
  const seventh = ("" + Math.random()).substring(2, 5);
  const eighth = ("" + Math.random()).substring(2, 4);
  return { redAward: redAward, first: first, second: second, third: third, fourth: fourth, fifth: fifth, sixth: sixth, seventh: seventh, eighth: eighth };
};

exports.getLast2digits_18 = (value) => {
  let arr = [];
  const red = value.redAward.substr(4, 2);
  arr.push(red);
  const first = value.first.substr(3, 2);
  arr.push(first);
  const second = value.second.substr(3, 2);
  arr.push(second);
  const third = value.third.split("-").map((item) => {
    return item.substr(3, 2);
  });
  arr = arr.concat(third);
  const fourth = value.fourth.split("-").map((item) => {
    return item.substr(3, 2);
  });
  arr = arr.concat(fourth);
  const fifth = value.fifth.substr(2, 2);
  arr.push(fifth);
  const sixth = value.sixth.split("-").map((item) => {
    return item.substr(2, 2);
  });
  arr = arr.concat(sixth);
  const seventh = value.seventh.substr(1, 2);
  arr.push(seventh);
  const eighth = value.eighth;
  arr.push(eighth);
  return arr;
};

exports.getLast3digits_18 = (value) => {
  let arr = [];
  const red = value.redAward.substr(3, 3);
  arr.push(red);
  const first = value.first.substr(2, 3);
  arr.push(first);
  const second = value.second.substr(2, 3);
  arr.push(second);
  const third = value.third.split("-").map((item) => {
    return item.substr(2, 3);
  });
  arr = arr.concat(third);
  const fourth = value.fourth.split("-").map((item) => {
    return item.substr(2, 3);
  });
  arr = arr.concat(fourth);
  const fifth = value.fifth.substr(1, 3);
  arr = arr.concat(fifth);
  const sixth = value.sixth.split("-").map((item) => {
    return item.substr(1, 3);
  });
  arr = arr.concat(sixth);
  const seventh = value.seventh;
  arr.push(seventh);
  return arr;
};

exports.getLast4digits_18 = (value) => {
  let arr = [];
  const red = value.redAward.substr(2, 4);
  arr.push(red);
  const first = value.first.substr(1, 4);
  arr.push(first);
  const second = value.second.substr(1, 4);
  arr.push(second);
  const third = value.third.split("-").map((item) => {
    return item.substr(1, 4);
  });
  arr = arr.concat(third);
  const fourth = value.fourth.split("-").map((item) => {
    return item.substr(1, 4);
  });
  arr = arr.concat(fourth);
  const fifth = value.fifth;
  arr.push(fifth);
  const sixth = value.sixth.split("-");
  arr = arr.concat(sixth);
  return arr;
};

exports.getFirstPrizeFirst2digits_18 = (value) => {
  return value.first.substr(0, 2);
};

exports.getFirstPrizeLast2digits_18 = (value) => {
  return value.first.substr(3, 2);
};

exports.getRedAwardFirst2digits_18 = (value) => {
  return value.redAward.substr(0, 2);
};

exports.getRedAwardLast2digits_18 = (value) => {
  return value.redAward.substr(4, 2);
};

exports.get7thNumbers_18 = (value) => {
  return value.seventh.split("-");
};

exports.get3PinNumbers_18 = (value) => {
  return value.sixth.split("-");
};

exports.get3PinHeadAndTail_18 = (value) => {
  let arr = [];
  arr.push(value.seventh);
  const redAward = value.redAward.substr(3, 3);
  arr.push(redAward);
  return arr;
};

exports.get3PinRedAward_18 = (value) => {
  return value.redAward.substr(3, 3);
};

exports.get4PinRedAward_18 = (value) => {
  return value.redAward.substr(2, 4);
};

exports.getScoreHeadAndTail_18 = (value) => {
  let arr = [];
  arr.push(value.redAward.substr(4, 2));
  arr.push(value.eighth);
  return arr;
};

exports.getAllLot6Numbers = (value) => {
  return Object.keys(value).map((item) => {return value[item]})
}

exports.getNorthernResultsFromConfirmURL = async () => {
  const data = (await axios.get(config.RESULT_URL_NORTHERN)).data;
  const phrase = parse.parse(data);
  const tbody = phrase.getElementsByTagName('tbody')[0];
  const tableRows = tbody.getElementsByTagName('tr');
  const lottoPairs = [];
  let lottoPair;
  
  const jackpot = tableRows[0].getElementsByTagName('td')[1].childNodes[0].rawText;
  lottoPair = tableRows[0].getElementsByTagName('td')[3].childNodes[0].rawText;
  lottoPairs.push(lottoPair.replace(/\s/g, ''));

  lottoPairs.push(tableRows[1].getElementsByTagName('td')[3].childNodes[0].rawText.replace(/\s/g, ''));

  const firstPrize = tableRows[2].getElementsByTagName('td')[1].childNodes[0].rawText;
  lottoPairs.push(tableRows[2].getElementsByTagName('td')[3].childNodes[0].rawText.replace(/\s/g, ''));

  let elements = tableRows[3].getElementsByTagName('td')[1].getElementsByTagName('span');
  lottoPairs.push(tableRows[3].getElementsByTagName('td')[3].childNodes[0].rawText.replace(/\s/g, ''));
  const secondPrize = elements[0].childNodes[0].rawText + '-' + elements[1].childNodes[0].rawText;
  
  
  elements = tableRows[4].getElementsByTagName('td')[1].getElementsByTagName('span');
  lottoPairs.push(tableRows[4].getElementsByTagName('td')[3].childNodes[0].rawText.replace(/\s/g, ''));
  const thirdPrize = 
    elements[0].childNodes[0].rawText + '-' +
    elements[1].childNodes[0].rawText + '-' +
    elements[2].childNodes[0].rawText + '-' +
    elements[3].childNodes[0].rawText + '-' +
    elements[4].childNodes[0].rawText + '-' +
    elements[5].childNodes[0].rawText;
  
  elements = tableRows[5].getElementsByTagName('td')[1].getElementsByTagName('span');
  lottoPairs.push(tableRows[5].getElementsByTagName('td')[3].childNodes[0].rawText.replace(/\s/g, ''));
  const fourthPrize = 
    elements[0].childNodes[0].rawText + '-' +
    elements[1].childNodes[0].rawText + '-' +
    elements[2].childNodes[0].rawText + '-' +
    elements[3].childNodes[0].rawText;

  elements = tableRows[6].getElementsByTagName('td')[1].getElementsByTagName('span');
  lottoPairs.push(tableRows[6].getElementsByTagName('td')[3].childNodes[0].rawText.replace(/\s/g, ''));
  const fifthPrize = 
    elements[0].childNodes[0].rawText + '-' +
    elements[1].childNodes[0].rawText + '-' +
    elements[2].childNodes[0].rawText + '-' +
    elements[3].childNodes[0].rawText + '-' +
    elements[4].childNodes[0].rawText + '-' +
    elements[5].childNodes[0].rawText;

  elements = tableRows[7].getElementsByTagName('td')[1].getElementsByTagName('span');
  lottoPairs.push(tableRows[7].getElementsByTagName('td')[3].childNodes[0].rawText.replace(/\s/g, ''));
  const sixthPrize = 
    elements[0].childNodes[0].rawText + '-' +
    elements[1].childNodes[0].rawText + '-' +
    elements[2].childNodes[0].rawText;

  elements = tableRows[8].getElementsByTagName('td')[1].getElementsByTagName('span');
  lottoPairs.push(tableRows[8].getElementsByTagName('td')[3].childNodes[0].rawText.replace(/\s/g, ''));
  const seventhPrize = 
    elements[0].childNodes[0].rawText + '-' +
    elements[1].childNodes[0].rawText + '-' +
    elements[2].childNodes[0].rawText + '-' +
    elements[3].childNodes[0].rawText;
  const numbers = {
    redAward: jackpot,
    first: firstPrize,
    second: secondPrize,
    third: thirdPrize,
    fourth: fourthPrize,
    fifth: fifthPrize,
    sixth: sixthPrize,
    seventh: seventhPrize,
    pairs: lottoPairs
  }
  return numbers
}

exports.getNorthernResultsFromURL1 = async () => {
  const data = (await axios.get(`${config.RESULT_URL1}/getkqxs/mien-bac.js`)).data;
  const phrase = parse.parse(data);  
  const tbody = phrase.getElementsByTagName('tbody')[0];
  const tableRows = tbody.getElementsByTagName('tr');
  const jackpot = tableRows[1].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  const firstPrize = tableRows[2].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  const secondPrize = tableRows[3].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  const thirdPrize = tableRows[4].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  const fourthPrize = tableRows[5].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  const fifthPrize = tableRows[6].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  const sixthPrize = tableRows[7].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  const seventhPrize = tableRows[8].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  return {
    redAward: jackpot,
    first: firstPrize,
    second: secondPrize,
    third: thirdPrize,
    fourth: fourthPrize,
    fifth: fifthPrize,
    sixth: sixthPrize,
    seventh: seventhPrize,
    pairs: []
  };
}

exports.getSouthernResultFromConfirmURL = async () => {
  const data = (await axios.get(config.RESULT_URL_SOUTHERN)).data;
  const phrase = parse.parse(data);
  const tbody = phrase.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0];
  const tableRows = tbody.getElementsByTagName('tr');
  
  let eighthPrize = tableRows[0].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  let seventhPrize  = tableRows[1].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  let sixthPrize = tableRows[2].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  let fifthPrize = tableRows[3].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  let fourthPrize = tableRows[4].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  let thirdPrize = tableRows[5].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  let secondePrize = tableRows[6].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  let firstPrize = tableRows[7].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  let jackpot = tableRows[8].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');

  return {
    redAward: jackpot,
    first: firstPrize,
    second: secondePrize,
    third: thirdPrize,
    fourth: fourthPrize,
    fifth: fifthPrize,
    sixth: sixthPrize,
    seventh: seventhPrize,
    eighth: eighthPrize,
    pairs: []
  }
}

exports.getLottoNumbersFromURL1 = async (url) => {
  const data = (await axios.get(url)).data;
  const phrase = parse.parse(data);
  
  const tbody = phrase.getElementsByTagName('tbody')[0];
  const tableRows = tbody.getElementsByTagName('tr');
  const lottoPairs = [];
  let lottoPair;
  const jackpot = tableRows[1].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  const firstPrize = tableRows[2].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  const secondPrize = tableRows[3].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  const thirdPrize = tableRows[4].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  const fourthPrize = tableRows[5].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  const fifthPrize = tableRows[6].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  const sixthPrize = tableRows[7].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  const seventhPrize = tableRows[8].getElementsByTagName('td')[1].childNodes[0].rawText.replace(/\s/g, '');
  
  return {
    redAward: jackpot,
    first: firstPrize,
    second: secondPrize,
    third: thirdPrize,
    fourth: fourthPrize,
    fifth: fifthPrize,
    sixth: sixthPrize,
    seventh: seventhPrize,
    pairs: lottoPairs
  };
}



exports.getNorthernLottoNumbers = async () => {
  northernResult1 = await getNorthernResultsFromConfirmURL();
  northernResult2 = await this.getNorthernResultsFromURL1();
  if(!northernResult1) return northernResult2;
  if(!northernResult1 && !northernResult2) {
    sendEmail();
    return {};
  }
  console.log(northernResult1);
  console.log(northernResult2);
  return northernResult1;
}

exports.getSouthernHochiminhLottoNumbers = async () => {
  southernResult = await this.getSouthernResultFromConfirmURL();
  return southernResult;
}

exports.getCentralQuangNamLottoNumbers = async () => {
  // return numbers;
  const numbers = getLottoNumbersFromURL1(`${config.RESULT_URL1}/getkqxs/quang-nam.js`);
  return numbers;
}

