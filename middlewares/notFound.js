const notFound = (req, res) => {
	res.status(404).json({ message: `${req.path} not found` });
};

module.exports = notFound;
