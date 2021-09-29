const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const http = require("http");
const https = require("https");
const fs = require("fs");
const axios = require('axios');
const { Server } = require("socket.io");

const router = require("./router");
const { startNorthernDaemon } = require("./daemons/northern/northern");
const { startMegaDaemon } = require("./daemons/mega/mega");
const { startHanoiDaemon } = require("./daemons/vip/hanoi");
const { startHochiminhDaemon } = require("./daemons/vip/hochiminh");
const { startSaigonDaemon } = require("./daemons/vip/saigon");
const { startSuperspeedDaemon } = require("./daemons/superspeed/superspeed");
const socketEvents = require("./helpers/socketEvents");
const conf = require("./config/main");

const options = {
  key: fs.readFileSync('/var/www/lotopoka/lotopoka.com.key'),
  cert: fs.readFileSync('/var/www/lotopoka/lotopoka.com.crt'),
  ca: fs.readFileSync('/var/www/lotopoka/lotopoka.com.chained.crt')
}

mongoose
  .connect(process.env.DB_URL || conf.db_url, {
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

app.use(express.static("public"));
app.set("view engine", "ejs");

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

//const server = http.createServer(app);
const server = https.createServer(options, app);
const io = new Server(server, { cors: corsOptions });
socketEvents(io);

server.listen(conf.port, '0.0.0.0', function() {
  console.log(`[SUCCESS]:[START]:[SERVER]:[AT]:[${conf.port}]]`);
})

startNorthernDaemon(io);
startMegaDaemon(io);
startHanoiDaemon(io);
startHochiminhDaemon(io);
startSaigonDaemon(io);
startSuperspeedDaemon(io);

axios.get(
  'https://sonicxgame.com/api/v1/sonicx/lotopoka/get-balance', 
  {
    headers: {
      'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ2MjRfMTYxOTk5MTMyNjA4NiIsInVzZXJOYW1lIjoiQmh0Y2FzaW5vIGxvdWlzLm5ndXllbiIsImlhdCI6MTYzMjQyNjI0MSwiZXhwIjoxNjMzMDMxMDQxfQ.7RYiwuCkqsMVucPBR4sbYOYdmcZ4qBm9h-5MxwiHCEY',
      'Content-Type': 'application/json'
    }
  }
)
.then(response => {
  console.log(response.data);
})
.catch(err => {
  console.error(err);
});

module.exports = server;