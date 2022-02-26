const mongoose = require("mongoose")
require("dotenv").config()

exports.db = mongoose.connect(
	process.env.DB,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: true,
	},
	() => console.log("mongoDB connected"),
)
