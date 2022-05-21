const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
exports.getFoodList = async (req, res) => {
  request("https://sks.deu.edu.tr/yemek-menusu/", (error, response, body) => {
    if (error) return res.status(500).json({ status: "Error", message: error });
    const dom = new JSDOM(body);
    let text = dom.window.document.querySelector(
      "#tm_lunch_menu_widget-2"
    ).innerHTML;
    const img = dom.window.document
      .querySelector("#media_image-3")
      .querySelector("img").src;

    if (text && img) {
      text = text.split("<br>");
      let foodList = [];
      foodList.push({
        date: text[0].split("<strong>")[1].split("</strong>")[0],
        food: text[1],
        img: img,
      });
      foodList.push({
        date: text[2].split("<strong>")[1].split("</strong>")[0],
        food: text[3],
      });
      return res.status(200).json({ status: "Success", message: foodList });
    }
    return res
      .status(500)
      .json({ status: "Error", message: "Something went wrong with deu" });
  });
};

exports.getLibrary = async (req, res) => {
  request(
    "https://akillikart.deu.edu.tr/kutuphane",
    (error, response, body) => {
      if (error)
        return res.status(500).json({ status: "Error", message: error });
      const dom = new JSDOM(body);
      let responseBody = dom.window.document.querySelector(".container");
      let rows = responseBody.querySelectorAll(".row");
      let text = rows[1].querySelectorAll(".col-md-4")[1].innerHTML;
      let bar = rows[2].querySelectorAll(".col-md-4")[1].innerHTML;
      text = text
        .replace("\t\t\t\t", "")
        .replace("\t\t\t\t", "")
        .replace("\n", "")
        .replace("Doluluk", "<br>Doluluk");
      bar = bar
        .replace("\t\t\t\t\t", "")
        .replace("\t\t\t\t", "")
        .replace("\n", "")
        .replace("\n", "")
        .replace("<div", "<div class='progress-bar'")
        .replace("--value", "width")
        .replace('">', '%">');
      let tempnumber = bar.split(":")[1].split("%")[0];
      bar = bar.replace("><", ">" + tempnumber + "%" + "<");
      return res.status(200).json({
        status: "Success",
        message: {
          text: text,
          bar: bar,
        },
      });
    }
  );
};
