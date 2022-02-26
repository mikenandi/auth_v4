/**
 * importing modules
 */
const express = require("express")
const session = require("express-session")
const morgan = require("morgan")
const passport = require("passport")
const db = require("./config/db")
require("dotenv").config()
const MongoStore = require("connect-mongo")
const router = require("./routes/router")

//app init
const app = express()
/**
 * middlewares
 */
app.use(morgan("combined"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: true,
		store: new MongoStore({
			mongoUrl: process.env.DB,
			collection: "sessions",
		}),
		cookie: {
			maxAge: 1000 * 60 * 60 * 24,
		},
	}),
)

//passport middleware
require("./middleware/passport")
app.use(passport.initialize())
app.use(passport.session())

/**
 * Router
 */
app.use(router)

//server init
const port = process.env.PORT || 3000
app.listen(port, () => console.log("server is running"))
