const express = require("express");
const next = require("next");
const session = require("express-session");
const mongoose = require("mongoose");
const logger = require("morgan");
const mongoSessionStore = require("connect-mongo");
const expressValidator = require("express-validator");
const passport = require("passport");
const helmet = require("helmet");
const compression = require("compression");

/* Loads all variables from .env file to "process.env" */
require("dotenv").config();
/* Require our models here so we can use the mongoose.model() singleton to reference our models across our app */
require("./models/Post");
require("./models/User");
const routes = require("./routes");
const google = require("./controllers/googleController");
require("./passport");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const ROOT_URL = dev ? `http://localhost:${port}` : process.env.PRODUCTION_URL;
const app = next({ dev });
const handle = app.getRequestHandler();

function redirectTrailingSlash(req, res, next) {
  let paths = req.url.split("?"); // get url and query from request
  let path = paths[0],
    query = null; // split request and query
  if (paths.length > 1) query = paths.slice(1, paths.length).join("?"); // Rebuild query

  if (path.substr(-1) === "/" && path.length > 1)
    res.redirect(301, path.slice(0, -1) + (query ? "?" + query : ""));
  // Redirect User with 301 and without the slash
  else next();
}

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

mongoose
  .connect(process.env.MONGO_URI, mongooseOptions)
  .then(() => console.log("DB connected"));

mongoose.connection.on("error", (err) => {
  console.log(`DB connection error: ${err.message}`);
});

app.prepare().then(() => {
  const server = express();

  {
    /* Helmet helps secure our app by setting various HTTP headers */
    server.use(helmet());
    /* Compression gives us gzip compression */
    server.use(compression());
  }
  server.use(redirectTrailingSlash);

  /* Body Parser built-in to Express as of version 4.16 */
  server.use(express.json());
  /* Express Validator will validate form data sent to the backend */
  server.use(expressValidator());

  /* give all Next.js's requests to Next.js server */
  server.get("/_next/*", (req, res) => {
    handle(req, res);
  });

  server.get("/public/*", (req, res) => {
    handle(req, res);
  });

  const MongoStore = mongoSessionStore(session);
  const sessionConfig = {
    name: "socialConnect",
    // secret used for using signed cookies w/ the session
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 1000 * 60 * 60 * 24 * 30, // save session for 30 days
    }),
    // forces the session to be saved back to the store
    resave: false,
    // don't save unmodified sessions
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // expires in 30 days
    },
  };

  // sessionConfig.cookie.secure = true; // serve secure cookies in production environment
  // server.set("trust proxy", 1); // trust first proxy

  /* Apply our session configuration to express-session */
  server.use(session(sessionConfig));

  /* Add passport middleware to set passport up */
  server.use(passport.initialize());
  server.use(passport.session());

  server.use((req, res, next) => {
    /* custom middleware to put our user data (from passport) on the req.user so we can access it as such anywhere in our app */
    res.locals.user = req.user || null;
    next();
  });

  /* apply routes from the "routes" folder */
  server.use("/", routes);
  server.use("/", google);

  /* Error handling from async / await functions */
  server.use((err, req, res, next) => {
    const { status = 500, message } = err;
    res.status(status).json(message);
  });

  server.get("*", (req, res) => {
    handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(ROOT_URL);
  });
});
