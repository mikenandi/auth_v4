const crypto = require("crypto")

exports.genPassword = (password) => {
	var salt = crypto.randomBytes(32).toString("hex")

	var genHash = crypto
		.pbkdf2Sync(password, salt, 10000, 64, "sha512")
		.toString("hex")

	return {
		salt: salt,
		hash: genHash,
	}
}

exports.validPassword = (password, hash, salt) => {
	var verifyHash = crypto
		.pbkdf2Sync(password, salt, 10000, 64, "sha512")
		.toString("hex")
	return hash === verifyHash
}
