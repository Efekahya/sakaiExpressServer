const express = require("express");
const mongoose = require("mongoose");
const app = express();
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const morgan = require("morgan");
require("dotenv").config();
const cors = require("cors");
//!                                             DB CONNECTION

//!_____________________________________________________________________________________________________
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});
//!______________________________________________________________________________________________________

//?                                                 CONFIG
//?______________________________________________________________________________________________________
app.use(morgan("tiny"));

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "secret", //? uuid kullanınca çalışmıyor
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // secure: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    store: new MongoStore({
      url: process.env.MONGO_URI, //YOUR MONGODB URL
      ttl: 14 * 24 * 60 * 60,
      autoRemove: "native",
      mongooseConnection: mongoose.connection,
      collection: "session",
    }),
  })
);
//?______________________________________________________________________________________________________
app.use("/user", require("./routes/userRoute"));
app.use("/utils", require("./routes/utilsRoute"));

app.use(notFound);
app.use(errorHandler);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
app.listen(3000, () => {
  console.log("Served on port 3000");
});
