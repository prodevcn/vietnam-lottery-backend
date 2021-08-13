const express = require('express');
const passport = require('passport');

/** import controllers */

const AuthController = require('../controllers/auth');
const GameController = require('../controllers/game');
const BetController = require('../controllers/bet');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', { session: false });

module.exports = app => {

    /* define routes */
    const apiRoutes = express.Router();
    const authRoutes = express.Router();
    const gameRoutes = express.Router();
    const betRoutes = express.Router();

    /* sort routes according url */
    apiRoutes.use('/auth', authRoutes);
    apiRoutes.use('/game', gameRoutes);
  
    /** auth routing */  
    authRoutes.post('/register', AuthController.register);
    authRoutes.post('/login', requireLogin, AuthController.login);
    authRoutes.get('/get-user-info/:userId', requireAuth, AuthController.getUserInfo);
    /** game routing */
    gameRoutes.get('/get-new-game-info/:gameType', requireAuth, GameController.getNewGameInfo);
    gameRoutes.get('/get-latest-result/:gameType', requireAuth, GameController.getLatestResult);
    gameRoutes.get('/get-all-latest-results', GameController.getAllLatestResults);
    gameRoutes.get('/get-all-results/:gameType', requireAuth, GameController.getAllResultForGameType);
    gameRoutes.get('/get-all-history/:userId', requireAuth, GameController.getAllHistoryForUser);
    gameRoutes.get('/get-all-order/:userId', requireAuth, GameController.getAllOrderForUser);
    gameRoutes.use('/bet', betRoutes);

    gameRoutes.post('/save-result', requireAuth, GameController.saveGameResult); // for postman test
    
    /** bet routing */
    betRoutes.post('/save', requireAuth, BetController.saveBet);
    betRoutes.get('/get-bet-history/:userId', requireAuth, BetController.fetchBets);
    
    /** api route */
    apiRoutes.get('/test', (req, res) => {
        return res.send({status: true, msg: "Server is running"});
    });
    
    app.use('/', apiRoutes);
}