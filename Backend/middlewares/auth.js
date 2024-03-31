const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
	try {
		console.log(req.headers.authorization);
		const token = req.headers.authorization.split(' ')[1]
		const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
		const userId = decodedToken.userId
		console.log('request body content : ', req.body, typeof req.body)
		console.log('user contained in token : ', userId, typeof userId)
		console.log('user in request body : ', req.body.userId, typeof req.body.userId)
		console.log('req.auth : ', req.auth)
		req.auth = { userId }
		if (req.body.userId && req.body.userId !== userId) {
			console.log('user unauthorized')
			throw 'Invalid user ID'
		} else {
			console.log('user authorized')
			next()
		}
	} catch {
		res.status(401).json({
			error: new Error('You are not authenticated')
		})
	}
}
