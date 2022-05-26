const { default: axios } = require("axios");
const User = require("../models/user");
const checkSakai = (err, req, res, next) => {
  axios
    .get("https://online.deu.edu.tr/direct/session.json", {
      headers: {
        "Content-Type": "application/json",
        Cookie: `SAKAI2SESSIONID=${req.session.sakai.token}`,
      },
    })
    .then(function (response) {
      console.log(response.data);
      const user = User.findById(req.session.user._id);
      user.sakaiEmail = req.body.sakaiEmail;
      user.sakaiPassword = req.body.sakaiPassword;
      next();
    })
    .catch(function (error) {
      console.log(error);
      res.status(401).json({
        message: "Sakai credentials are wrong",
      });
    });
};

module.exports = checkSakai;
