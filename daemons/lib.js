const _ = require("lodash");
/** create random lotto number */
exports.createLottoNumbers = () => {
    const redAward = (""+Math.random()).substring(2,7);
    const first = (""+Math.random()).substring(2,7);
    const second = (""+Math.random()).substring(2,7) + "-" + (""+Math.random()).substring(2,7);
    const third = (""+Math.random()).substring(2,7) + "-" + (""+Math.random()).substring(2,7) + "-" + (""+Math.random()).substring(2,7) + "-"+ (""+Math.random()).substring(2,7) + "-" + (""+Math.random()).substring(2,7) + "-" + (""+Math.random()).substring(2,7);
    const fourth = (""+Math.random()).substring(2,6) + "-" + (""+Math.random()).substring(2,6) + "-" + (""+Math.random()).substring(2,6) + "-" +  (""+Math.random()).substring(2,6);
    const fifth = (""+Math.random()).substring(2,6) + "-" + (""+Math.random()).substring(2,6) + "-" + (""+Math.random()).substring(2,6) + "-"+ (""+Math.random()).substring(2,6) + "-" + (""+Math.random()).substring(2,6) + "-" + (""+Math.random()).substring(2,6);
    const sixth = (""+Math.random()).substring(2,5) + "-" + (""+Math.random()).substring(2,5) + "-" + (""+Math.random()).substring(2,5);
    const seventh = (""+Math.random()).substring(2,4) + "-" + (""+Math.random()).substring(2,4) + "-" + (""+Math.random()).substring(2,4) + "-"+ (""+Math.random()).substring(2,4);
    return {redAward: redAward, first: first, second: second, third: third, fourth: fourth, fifth: fifth, sixth: sixth, seventh: seventh};
};

exports.getLast2digits = value => {
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

exports.getFirst2digits = value => {
    let arr = [];
    const red = value.redAward.substr(0, 2);
    arr.push(red);
    const first = value.first.substr(0, 2);
    arr.push(first);
    const second = value.second.split('-').map((item) => {return item.substr(0, 2)});
    arr = arr.concat(second);
    const third = value.third.split('-').map((item) => {return item.substr(0, 2)});
    arr=arr.concat(third);
    const fourth = value.fourth.split('-').map((item) => {return item.substr(0, 2)});
    arr=arr.concat(fourth);
    const fifth = value.fifth.split('-').map((item) => {return item.substr(0, 2)});
    arr=arr.concat(fifth);
    const sixth = value.sixth.split('-').map((item) => {return item.substr(0, 2)});
    arr=arr.concat(sixth);
    return arr;
};

exports.getLast3digits = value => {
    let arr = [];
    const red = value.redAward.substr(2, 5);
    arr.push(red);
    const first = value.first.substr(2, 5);
    arr.push(first);
    const second = value.second.split('-').map((item) => {return item.substr(2, 5)});
    arr = arr.concat(second);
    const third = value.third.split('-').map((item) => {return item.substr(2, 5)});
    arr=arr.concat(third);
    const fourth = value.fourth.split('-').map((item) => {return item.substr(1, 4)});
    arr=arr.concat(fourth);
    const fifth = value.fifth.split('-').map((item) => {return item.substr(1, 4)});
    arr=arr.concat(fifth);
    const sixth = value.sixth.split('-');
    arr=arr.concat(sixth);
    return arr;
};

exports.getLast4digits = value => {
    let arr = [];
    const red = value.redAward.substr(1, 5);
    arr.push(red);
    const first = value.first.substr(1, 5);
    arr.push(first);
    const second = value.second.split('-').map((item) => {return item.substr(1, 5)});
    arr = arr.concat(second);
    const third = value.third.split('-').map((item) => {return item.substr(1, 5)});
    arr=arr.concat(third);
    const fourth = value.fourth.split('-');
    arr=arr.concat(fourth);
    const fifth = value.fifth.split('-');
    arr=arr.concat(fifth);
    return arr;
};

/** process for score */

exports.getFirstPrizeLast2digits = value => {
    return value.first.substr(0, 2);
};

exports.getFirstPrizeFirst2digits = value => {
    return value.first.substr(3, 5);
};

exports.getRedAwardFirst2digits = value => {
    return value.redAward.substr(0, 2);
};

exports.getRedAwardLast2digits = value => {
    return value.redAward.substr(3, 5);
};

exports.get7thNumbers = value => {
    return value.seventh.split('-');
}

exports.get3PinNumbers = value => {
    return value.sixth.split('-');
};

exports.get3PinHeadAndTail = value => {
    let arr = [];
    const sixth = value.sixth.split('-');
    arr.concat(sixth);
    const redAward = value.redAward.substr(2, 5);
    arr.push(redAward);
    return arr;
};

exports.get3PinRedAward = value => {
    return value.redAward.substr(2, 5);
};

exports.get4PinRedAward = value => {
    return value.redAward.substr(1, 5);
};


/** create random numbers for mega lottery */
exports.createMegaLottoNumbers = () => {
    const labels = ["first", "second", "third", "fourth", "fifth", "sixth"];
    const _target = {};
    for (let label of labels) {
        let num = _.random(0, 45);
        if (num < 10) num = '0' + num;
        else num = num.toString();
        _target[label] = num;
    }
    return _target;
};
