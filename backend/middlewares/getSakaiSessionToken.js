const { default: axios } = require("axios");
const qs = require("qs");
const getSessionToken = async (req, res, next) => {
  const data = qs.stringify({
    eid: req.body.sakaiEmail,
    pw: req.body.sakaiPassword,
    submit: "Giriş",
  });
  var config = {
    method: "post",
    url: "https://online.deu.edu.tr/relogin",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };
  axios(config)
    .then(function (response) {
      if (response.data.toString().search("hatalı") === -1 && response.data.toString().search("tam ve doğru") === -1) {
        req.session.sakai = {
          token: response.data.token,
        };
        req.session.save();
        next();
      } else {
        return res.status(401).json({
          status: "Error",
          message: "Sakai credentials are wrong",
        });
      }
    })
    .catch(function (error) {
      console.log(error.message);
      return res.status(500).json({
        status: "Error",
        message: "There is an error with server",
      });
    });
};
module.exports = getSessionToken;
