const { default: axios } = require("axios");

const getSessionToken = async (req, res) => {
  if (!req.session.user) {
    return;
  }
  const user = await User.findById(req.session.user._id);
  axios
    .post(
      "https://online.deu.edu.tr/relogin",
      {
        eid: user.sakaiEmail,
        pw: user.sakaiPassword,
        submit: "Giriş",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then(function (response) {
      console.log(response.data);
      req.session.sakai = {
        token: response.data.token,
      };
      req.session.save();
      next();
    })
    .catch(function (error) {
      console.log(error);
      res.status(401).json({
        message: "Sakai credentials are wrong",
      });
    });
};
