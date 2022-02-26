const express = require("express")
const passport = require("passport")
const {
	signup,
	updatepassword,
	deleteAccount,
	forgotpassord,
	resetPassword,
} = require("../controllers/usersController")
const router = express.Router()

router.post("/signup", signup)
router.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/login-failure",
	}),
)
router.get("login-failure", (req, res) => {
	res.json({msg: "you did not log in to your account"})
})
router.get("/", (req, res) => {
	res.send("<h1>Home page</h1>")
})
router.post("/updatePassword/:id", updatepassword)
router.delete("/deleteUser/:id", deleteAccount)
router.post("/forgotpassword", forgotpassord)
router.post("/reset-password/:id/:token", resetPassword)

module.exports = router
