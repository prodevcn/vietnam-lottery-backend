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
    
    /** game routing */
    gameRoutes.get('/get-history/:gameType', requireAuth, GameController.getResultHistory);
    gameRoutes.get('/get-new-game/:gameType', requireAuth, GameController.getNewGame);
    gameRoutes.post('/save-result', requireAuth, GameController.saveGameResult);
    gameRoutes.get('/get-results', GameController.getResults);
    gameRoutes.use('/bet', betRoutes);
    
    /** bet routing */
    betRoutes.post('/save', requireAuth, BetController.saveBet);
    betRoutes.post('/remove', requireAuth, BetController.removeBet);
    betRoutes.get('/fetch/:userId', requireAuth, BetController.fetchBets);
    
    /** api route */
    
    apiRoutes.get('/test', (req, res) => {
        return res.send("Server is running");
    });
    
    app.use('/', apiRoutes);
}