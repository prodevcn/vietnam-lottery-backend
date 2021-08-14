const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const { Server } = require('socket.io');

const router = require('./router');
const { startNorthernDaemon } = require('./daemons/northern');
const { startMegaDaemon } = require('./daemons/mega');
const socketEvents = require('./helpers/socketEvents');
const conf = require('./config/main');

mongoose.connect(process.env.DB_URL || conf.db_url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true
}).then(() => {
    console.log('[DATABASE_CONNECT]:[SUCCESS]');
}).catch(err => {
    console.log('[DATABASE_CONNECT]:[FAILURE]:[NOT_READY]:');
    console.error(err);
});

const app = express();

const corsOptions = {
    allRoutes: true,
    origin: '*',
    methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
    headers: 'Origin, X-Requested-With, Content-Type, Accept, Engaged-Auth-Token',
    credentials: true
};

const server = app.listen(conf.port, '0.0.0.0', () => {
    console.log(`[SERVER]:[SUCCESS]:[${conf.port}]`);
});

const io = new Server(server, { cors: corsOptions });
socketEvents(io);

app.use(express.static('public'));
app.set('view engine', 'ejs');

/* Setting up basic middleware for all Express requests */
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(logger('dev'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

router(app);

startNorthernDaemon(io);
startMegaDaemon(io);

module.exports = server;