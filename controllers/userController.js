const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const request = require("request");
const axios = require("axios");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  userPassword = bcrypt.hashSync(req.body.password, 10);
  let user = new User({
    name: req.body.name.toLowerCase(),
    email: req.body.email,
    password: userPassword,
    lastName: req.body.lastName,
  });
  user.save((err, user) => {
    if (err) return res.status(500).json({ status: "Error", message: err });
    res.status(200).json({ status: "Success", message: user });
  });
};

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (!user) {
    return res.status(404).json({ status: "Error", message: "User not found" });
  }
  let hasSakai = false;
  if (user.sakaiEmail) {
    hasSakai = true;
  }
  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if (err) {
      return res.status(500).json({ status: "Error", message: err });
    }
    if (!result) {
      return res.status(404).json({ status: "Error", message: "Password is incorrect" });
    }
    jwt.sign(
      { _id: user._id, name: user.name, email: user.email, hasSakai: hasSakai },
      process.env.JWT_TOKEN,
      { expiresIn: "10h" },
      (err, token) => {
        if (err) {
          return res.status(500).json({ status: "Error", message: err });
        }
        req.session.user = {
          _id: user._id,
          name: user.name,
          email: user.email,
        };
        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ status: "Error", message: err });
          }
        });
        return res.status(200).json({
          status: "Success",
          hasSakai: hasSakai,
          token: token,
        });
      }
    );
  });
};

exports.logout = (req, res) => {
  axios
    .get("https://online.deu.edu.tr/portal/logout", {
      headers: {
        Cookie: `SAKAI2SESSIONID=${req.session.sakai.token}`,
      },
    })
    .then((response) => {
      req.session.destroy((err) => {
        if (err) return res.status(500).json({ status: "Error session", message: err });
      });
      return res.status(200).json({ status: "Success", message: "Logged out" });
    })
    .catch((err) => {
      return res.status(500).json({ status: "Error", message: err });
    });
};

exports.addSakai = async (req, res) => {
  const user = await User.findById(req.session.user._id);
  if (!user) return res.status(404).json({ status: "Error", message: "User not found" });
  user.sakaiEmail = req.body.sakaiEmail;
  user.sakaiPassword = req.body.sakaiPassword;
  user.save().then(async (user) => {
    return res.status(200).json({ status: "Success", message: user.sakaiEmail });
  });
};

exports.updateSakai = async (req, res) => {
  const user = await User.findById(req.session.user._id);
  if (!user) return res.status(404).json({ status: "Error", message: "User not found" });
  user.sakaiEmail = req.body.sakaiEmail;
  user.sakaiPassword = req.body.sakaiPassword;
  user.save().then((user) => {
    return res.status(200).json({ status: "Success", message: user.sakaiEmail });
  });
};

exports.deleteSakai = async (req, res) => {
  const user = await User.findById(req.session.user._id);
  if (!user) return res.status(404).json({ status: "Error", message: "User not found" });
  user.sakaiEmail = undefined;
  user.sakaiPassword = undefined;
  user.save().then((user) => {
    return res.status(200).json({ status: "Success", message: user.sakaiEmail });
  });
};

exports.getSessionToken = async (req, res) => {
  const url = "https://online.deu.edu.tr/relogin";
  if (!req.session.user) {
    return res.status(404).json({ status: "Error", message: "User not found" });
  }
  const user = await User.findById(req.session.user._id);
  const options = {
    method: "POST",
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      eid: user.sakaiEmail,
      pw: user.sakaiPassword,
      submit: "Giriş",
    },
  };
  request(options, (error, response, body) => {
    if (error) return res.status(500).json({ status: "Error", message: error });

    const token = response.headers["set-cookie"][0].split("=")[1].split(";")[0];
    req.session.sakai = {
      token: token,
    };
    req.session.save((err) => {
      if (err) return res.status(500).json({ status: "Error", message: err });
      return res.status(200).json({ status: "Success", message: token });
    });
  });
};

exports.getAnnouncements = async (req, res) => {
  const user = await User.findById(req.session.user._id);
  if (!user) return res.status(404).json({ status: "Error", message: "User not found" });
  const url = "https://online.deu.edu.tr/direct/announcement/user.json";
  const options = {
    method: "GET",
    url: url,
    headers: {
      "Content-Type": "application/json",
      Cookie: `SAKAI2SESSIONID=${req.session.sakai.token}`,
    },
  };
  request(options, (error, response, body) => {
    if (error) return res.status(500).json({ status: "Error", message: error });
    json = JSON.parse(body);
    json = json.announcement_collection;
    let announcement = [];
    for (let i = 0; i < json.length; i++) {
      const element = json[i];
      announcement.push({
        title: element.title,
        id: element.id,
        createdOn: element.createdOn,
        body: element.body,
      });
    }
    res.status(200).json({ status: "Success", message: announcement });
  });
};

exports.announcementDetails = async (req, res) => {
  const user = await User.findById(req.session.user._id);
  if (!user) return res.status(404).json({ status: "Error", message: "User not found" });
  const url = "https://online.deu.edu.tr/direct/announcement/user.json";
  const options = {
    method: "GET",
    url: url,
    headers: {
      "Content-Type": "application/json",
      Cookie: `SAKAI2SESSIONID=${req.session.sakai.token}`,
    },
  };
  request(options, (error, response, body) => {
    if (error) return res.status(500).json({ status: "Error", message: error });
    json = JSON.parse(body);
    json = json.announcement_collection;
    let announcement = [];
    for (let i = 0; i < json.length; i++) {
      const element = json[i];
      if (element.id.split(":")[0] == req.params.id) {
        announcement.push({
          title: element.title,
          id: element.id,
          createdOn: element.createdOn,
          body: element.body,
        });
      }
    }
    res.status(200).json({ status: "Success", message: announcement });
  });
};

exports.getAssignments = async (req, res) => {
  const user = await User.findById(req.session.user._id);
  if (!user) return res.status(404).json({ status: "Error", message: "User not found" });
  const url = "https://online.deu.edu.tr/direct/assignment/my.json";
  const options = {
    method: "GET",
    url: url,
    headers: {
      "Content-Type": "application/json",
      Cookie: `SAKAI2SESSIONID=${req.session.sakai.token}`,
    },
  };
  request(options, (error, response, body) => {
    if (error) return res.status(500).json({ status: "Error", message: error });
    json = JSON.parse(body);
    json = json.assignment_collection;
    let assignment = [];
    for (let i = 0; i < json.length; i++) {
      const element = json[i];
      assignment.push({
        title: element.title,
        id: element.id,
        dueDate: element.dueTime.epochSecond,
        instructions: element.instructions,
      });
    }

    assignment.sort((a, b) => {
      return b.dueDate - a.dueDate;
    });
    res.status(200).json({ status: "Success", message: assignment });
  });
};

exports.assignmentDetails = async (req, res) => {
  const user = await User.findById(req.session.user._id);
  if (!user) return res.status(404).json({ status: "Error", message: "User not found" });
  const url = "https://online.deu.edu.tr/direct/assignment/my.json";
  const options = {
    method: "GET",
    url: url,
    headers: {
      "Content-Type": "application/json",
      Cookie: `SAKAI2SESSIONID=${req.session.sakai.token}`,
    },
  };
  request(options, (error, response, body) => {
    if (error) return res.status(500).json({ status: "Error", message: error });
    json = JSON.parse(body);
    json = json.assignment_collection;
    let assignment = [];
    for (let i = 0; i < json.length; i++) {
      const element = json[i];
      if (element.id == req.params.id) {
        assignment.push({
          title: element.title,
          id: element.id,
          dueDate: element.dueTime.epochSecond,
          instructions: element.instructions,
        });
      }
    }
    res.status(200).json({ status: "Success", message: assignment });
  });
};

exports.getMeetings = async (req, res) => {
  const user = await User.findById(req.session.user._id);
  if (!user) return res.status(404).json({ status: "Error", message: "User not found" });
  const url = "https://online.deu.edu.tr/portal/favorites/list";
  await axios
    .get(url, {
      headers: {
        Cookie: `SAKAI2SESSIONID=${req.session.sakai.token}`,
      },
    })
    .then(async (response) => {
      json = response.data.favoriteSiteIds;
      let meeting = [];
      for (let i = 0; i < json.length; i++) {
        const element = json[i];
        meeting.push(element);
      }
      let meetingList = [];
      for (let i = 0; i < meeting.length; i++) {
        const element = meeting[i];
        const url = "https://online.deu.edu.tr/direct/bbb-tool.json?siteId=" + element;
        await axios
          .get(url, {
            headers: {
              Cookie: `SAKAI2SESSIONID=${req.session.sakai.token}`,
            },
          })
          .then((response) => {
            json = response.data["bbb-tool_collection"];
            for (let i = 0; i < json.length; i++) {
              const element = json[i];
              meetingList.push({
                name: element.name,
                ownerDisplayName: element.ownerDisplayName,
                id: element.id,
                startTime: element.endDate,
                joinUrl: element.entityURL + "/joinMeeting",
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }

      meetingList.sort((a, b) => {
        return b.startTime - a.startTime;
      });
      res.status(200).json({ status: "Success", message: meetingList });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getUserData = async (req, res) => {
  const user = await User.findById(req.session.user._id);
  if (!user) return res.status(404).json({ status: "Error", message: "User not found" });
  if (user.sakaiEmail == "") {
    return res.status(404).json({ status: "Error", message: "User doesn't have sakai info" });
  }
  let profilePictureUrl = "";
  let image = "";
  let userID = "";
  let bullhornAlertCount
  await axios
    .get("https://online.deu.edu.tr/direct/profile-image/details.json", {
      headers: {
        "Content-Type": "application/json",
        Cookie: `SAKAI2SESSIONID=${req.session.sakai.token}`,
      },
    })
    .then((response) => {
      profilePictureUrl = response.data.url;
      userID = profilePictureUrl.split("/")[5];
    })
    .catch((error) => {
      console.log(error.message);
    });
  await axios
    .get(profilePictureUrl, {
      responseType: "arraybuffer",
      headers: {
        Cookie: `SAKAI2SESSIONID=${req.session.sakai.token}`,
      },
    })
    .then((response) => {
      const buffer = Buffer.from(response.data, "binary");
      const base64 = buffer.toString("base64");
      image = "data:image/png;base64," + base64;
    })
    .catch((error) => {
      console.log(error.message);
    });
  await axios
    .get(`https://online.deu.edu.tr/direct/profile/${userID}/unreadMessagesCount.json`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: `SAKAI2SESSIONID=${req.session.sakai.token}`,
      },
    })
    .then((response) => {

      userId = response.data
    });
  await axios
    .get(`https://online.deu.edu.tr/direct/portal/bullhornAlertCount.json`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: `SAKAI2SESSIONID=${req.session.sakai.token}`,
      },
    })
    .then((response) => {

      bullhornAlertCount = response.data
    });

  let userr = {
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    sakaiEmail: user.sakaiEmail,
    sakaiPassword: "",
    profilePicture: image,
    unreadMessagesCount:userId,
    bullhornAlertCount: bullhornAlertCount
  };
  return res.status(200).json({ status: "Success", message: userr });
};

exports.updateUser = async (req, res) => {
  const user = await User.findById(req.session.user._id);
  if (!user) return res.status(404).json({ status: "Error", message: "User not found" });
  const { name, lastName, email, sakaiEmail, sakaiPassword } = req.body;
  user.name = name;
  user.lastName = lastName;
  user.email = email;
  user.sakaiEmail = sakaiEmail;
  user.sakaiPassword = sakaiPassword;
  user.save().then(() => {
    return res.status(200).json({ status: "Success", message: "Succesfully updated the user" });
  });
};

exports.getNotifications = async (req,res) => {

  const user = await User.findById(req.session.user._id);
  if (!user) return res.status(404).json({ status: "Error", message: "User not found" });
  if (user.sakaiEmail == "") {
    return res.status(404).json({ status: "Error", message: "User doesn't have sakai info" });
  }
  await axios
  .get("https://online.deu.edu.tr/direct/portal/bullhornAlerts.json", {
    headers: {
      "Content-Type": "application/json",
      Cookie: `SAKAI2SESSIONID=${req.session.sakai.token}`,
    },
  })
  .then((response) => {
    json = response.data
    json = json.alerts

    let assignmentArr = []
    let announcementArr = []
    for (let i = 0; i < json.length; i++) {
      const element = json[i];
      if (element.event.split(".")[0] === "annc"){

        announcementArr.push({
          tutorName: element.fromDisplayName,
          siteTitle: element.siteTitle,
          title : element.title,
          url: element.url,
          event : element.event.split(".")[0]
        })
      }
      if (element.event.split(".")[0] === "asn"){

        assignmentArr.push({
          tutorName: element.fromDisplayName,
          siteTitle: element.siteTitle,
          title : element.title,
          url: element.url,
          event : element.event.split(".")[0]
        })
      }

    }
    res.status(200).json({status:"Success", message:{assignments:assignmentArr,announcements:announcementArr}})
  })
  .catch((error) => {
    console.log(error.message);
  });

}