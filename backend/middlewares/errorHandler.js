const errorHandler = (err, req, res, next) => {
	console.log(err);
	const { statusCode = 500, message = "Something went wrong." } = err;
	res.status(statusCode).json({ status: "error", message });
};

module.exports = errorHandler;
