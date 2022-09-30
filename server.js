// DEPENDENCIES
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ENV VARS
const PORT = process.env.PORT || 3001;
const DB_STRING = process.env.DB_STRING;
const CLIENT_URL = process.env.CLIENT_URL;

// MIDDLEWARE
app.use(cors({
  origin: CLIENT_URL,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, some SmartTVs) won't work with 204
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
}));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  req.requestIP =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
  next();
});

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// DB CONNECT
mongoose.connect(
  DB_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  function (err) {
    if (!err) {
      console.log("DB connected");
    } else {
      console.log(err);
    }
  }
);

// LISTEN
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
