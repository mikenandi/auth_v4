const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			unique: true,
			required: true,
		},
		hash: String,
		salt: String,
		admin: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{timestamps: true},
)

module.exports = mongoose.model("User", userSchema)
