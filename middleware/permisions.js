exports.isAuth = (req, res) => {
	if ((req, isAuthenticated())) {
		next()
	} else {
		return res.status(404).json({msg: "please login or  signup"})
	}
}
exports.isAdmin = (req, res) => {
	if (req.isAuthenticated() && req.admin) {
		next()
	} else {
		return res.status(404).json({msg: "you are not admin of this site"})
	}
}
