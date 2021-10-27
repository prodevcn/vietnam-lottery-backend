require('dotenv').config()
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const http = require("http");
const https = require("https");
const fs = require("fs");
const { Server } = require("socket.io");

const router = require("./router");
const { startNorthernDaemon } = require("./daemons/northern/northern");
const { startMegaDaemon } = require("./daemons/mega/mega");
const { startHanoiDaemon } = require("./daemons/vip/hanoi");
const { startHochiminhDaemon } = require("./daemons/vip/hochiminh");
const { startSaigonDaemon } = require("./daemons/vip/saigon");
const { startSuperspeedDaemon } = require("./daemons/superspeed/superspeed");
const { startSouthernHochiminhDaemon } = require('./daemons/southern/hochiminh');
const { startCentralQuanNamDaemon } = require('./daemons/central/quangnam');

const socketEvents = require("./helpers/socketEvents");
const config = require("./config");

const options = {
  key: fs.readFileSync('/var/www/lotopoka/lotopoka.com.key'),
  cert: fs.readFileSync('/var/www/lotopoka/lotopoka.com.crt'),
  ca: fs.readFileSync('/var/www/lotopoka/lotopoka.com.chained.crt')
}

mongoose
  .connect(process.env.DB_URL || config.DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => {
    console.log("[DATABASE_CONNECT]:[SUCCESS]");
  })
  .catch((err) => {
    console.log("[DATABASE_CONNECT]:[FAILURE]:[NOT_READY]:");
    console.error(err);
  });

const app = express();

const corsOptions = {
  allRoutes: true,
  origin: "*",
  methods: "GET, POST, PUT, DELETE, OPTIONS, HEAD",
  headers: "Origin, X-Requested-With, Content-Type, Accept, Engaged-Auth-Token",
  credentials: true,
};

/* Setting up basic middleware for all Express requests */
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(logger("dev"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

router(app);

// const server = http.createServer(app);
const server = https.createServer(options, app);
const io = new Server(server, { cors: corsOptions });
socketEvents(io);

server.listen(config.PORT, '0.0.0.0', function() {
  console.log(`[SUCCESS]:[START]:[SERVER]:[AT]:[${config.PORT}]]`);
})

startNorthernDaemon(io);
startMegaDaemon(io);
startSuperspeedDaemon(io);
startHanoiDaemon(io);
startHochiminhDaemon(io);
startSaigonDaemon(io);
startSouthernHochiminhDaemon(io);
startCentralQuanNamDaemon(io);

module.exports = server;