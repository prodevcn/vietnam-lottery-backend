const Result = require('../models/result');
const Staging = require('../models/staging');


exports.getAllLatestResults = (req, res) => {
    const northern = new Promise((resolve, reject) => {
        Result.findOne({gameType: "northern"}).sort({ endTime: -1 })
            .then(response => {
                resolve(response);
            })
            .catch(err => {
                console.error(err);
                reject(err)
            });
    });

    Promise.all([northern])
        .then(response => {
            return res.json(response);
        }) 
        .catch(err => {
            res.send("something went wrong");
        });
};
exports.getLatestResult = (req, res) => {
    const {gameType} = req.params;
    Result.findOne({gameType: gameType}).sort({endTime: -1})
        .then(result => {
            if (result) {
                return res.send(result);
            } 
            return res.json({msg: 'no result', status: false});
        })
        .catch(err => {
            console.error('[ERROR]:[GET_LATEST_RESULT]', err);
        });
};
exports.getAllResultForGameType = (req, res, next) => {
    const { gameType } = req.params;
    Result.find({gameType}).sort({endTime: -1}).limit(100)
        .then(data => {
            console.log('[SUCCESS]:[FETCHING_GAME_HISTORY]');
            return res.json(data);
        })
        .catch(err => {
            console.log('[ERROR]:[FETCHING_GAME_HISTORY]');
            res.status(400);
            next(err);
        })
};
exports.getAllHistoryForUser = (req, res, next) => {
    const { userId } = req.params;
    History.find({userId}).sort({endTime: -1})
        .then(data => {
            console.log('[SUCCESS]:[FETCHING_GAME_HISTORY]');
            return res.json(data);
        })
        .catch(err => {
            console.log('[ERROR]:[FETCHING_GAME_HISTORY]');
            res.status(400);
            next(err);
        })
};
exports.getAllOrderForUser = (req, res, next) => {
    const { userId } = req.params;
    Order.find({userId}).sort({createdAt: -1})
        .then(data => {
            console.log('[SUCCESS]:[FETCHING_GAME_HISTORY]');
            return res.json(data);
        })
        .catch(err => {
            console.log('[ERROR]:[FETCHING_GAME_HISTORY]');
            res.status(400);
            next(err);
        })
};

exports.getAllOrders = (req, res, next) => {
    const { userId, gameType } = req.body;
    Order.find({userId: userId, gameType: gameType}).sort({createdAt: -1})
        .then(data => {
            console.log('[SUCCESS]:[FETCHING_ALL_GAME_HISTORY]');
            return res.send(data);
        })
        .catch(err => {
            console.log('[ERROR]:[FETCHING_ALL_GAME_HISTORY]');
            res.status(400);
            next(err);
        })
}

exports.getNewGameInfo = (req, res) => {
    const { gameType } = req.params;
    Staging.findOne({gameType})
        .then(data => {
            console.log('[SUCCESS]:[FETCHING_NEW_GAME_INFO]');
            return res.json(data);
        })
        .catch(err => {
            console.log('[ERROR]:[FETCHING_NEW_GAME_INFO]');
            res.status(400);
            next(err);
        })
};
exports.saveGameResult = (req, res, next) => {
    const { gameType, numbers,  endTime} = req.body;
    const newResult = new Result({
        gameType, numbers, endTime
    });
    newResult.save()
        .then(() => {
            return res.send("save game result successfully");
        })
        .catch(err => {
            console.log('[ERROR]:[SAVE_GAME_RESULT]');
            res.send("save game error");
            next(err);
        });
}