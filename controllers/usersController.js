const {genPassword, validPassword} = require("../lib/passwordUtils")
const User = require("../models/users")
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")

require("dotenv").config()

exports.signup = async (req, res) => {
	var genHash = genPassword(req.body.password)
	try {
		const newUser = new User({
			username: req.body.username,
			hash: genHash.hash,
			salt: genHash.salt,
		})
		await newUser.save().then(() => res.redirect("/"))
	} catch (err) {
		res.json(err.message)
	}
}

exports.updatepassword = async (req, res) => {
	try {
		const user = await User.findById(req.params.id)
		if (user == null) {
			return res.json({msg: "user not found"})
		}

		const isValid = validPassword(req.body.oldPassword, user.hash, user.salt)

		if (isValid) {
			var genHash = genPassword(req.body.password)
			var updates = {
				hash: genHash.hash,
				salt: genHash.salt,
			}
			await User.updateOne(updates)
			return res.json({msg: "password updated"})
		} else {
			return res.status(400).json({msg: "you entered wrong password"})
		}
	} catch (err) {
		res.status(500).json({msg: err.message})
	}
}

exports.deleteAccount = async (req, res) => {
	try {
		await User.findById(req.params.id)
			.then((user) => {
				if (user == null) {
					return res.status(400).json({msg: "no user found"})
				}
				user.deleteOne()
			})
			.then(() => res.json({msg: "user was deleted succesfully"}))
	} catch (err) {
		console.log(err.message)
	}
}

exports.forgotpassord = async (req, res) => {
	try {
		await User.findOne({username: req.body.username}).then((user) => {
			if (user == null) {
				return res.json({msg: "user does not exist"})
			}
			const secret = process.env.JWT_SECRET + user.hash
			const payload = {
				username: user.username,
				id: user.id,
			}
			const token = jwt.sign(payload, secret, {expiresIn: "15m"})
			const link = `http://localhost:3000/reset-password/${user.id}/${token}`

			let transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					user: "gudsurvey@gmail.com",
					pass: "love&*tech0145",
				},
			})
			const mailOption = {
				from: "gudsurvey@gmail.com",
				to: "mike12og@gmail.com",
				subject: "password reset link",
				text: `this is your password reset link ${link} it will last for 15m only `,
			}
			transporter.sendMail(mailOption, (err, data) => {
				if (err) {
					res.status(500).json({msg: "email was not sent please try again"})
				} else {
					res.json({msg: "email was sent"})
				}
			})
		})
	} catch (err) {
		res.json(err.message)
	}
}

exports.resetPassword = async (req, res) => {
	try {
		await User.findById(req.params.id)

		var genHash = genPassword(req.body.password)

		var updates = {
			hash: genHash.hash,
			salt: genHash.salt,
		}
		await User.updateOne(updates)
		res.json({msg: "your password is updated now!"})
	} catch (err) {
		res.json(err.msg)
	}
}
