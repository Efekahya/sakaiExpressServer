const express = require("express");
const mongoose = require("mongoose");
const app = express();
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
require("dotenv").config();

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

app.use(express.urlencoded({ extended: true }));
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

app.use(notFound);
app.use(errorHandler);

app.listen(3000, () => {
	console.log("Served on port 3000");
});
