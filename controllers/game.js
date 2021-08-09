const Result = require('../models/result');
const Staging = require('../models/staging');



exports.getLatestResults = (req, res, next) => {
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
exports.getAllResultForGameType = (req, res, next) => {
    const { gameType } = req.params;
    Result.find({gameType}).sort({endTime: -1})
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