const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
exports.getFoodList = async (req, res) => {
	request("https://sks.deu.edu.tr/yemek-menusu/", (error, response, body) => {
		if (error) return res.status(500).json({ status: "Error", message: error });
		const dom = new JSDOM(body);
		let text = dom.window.document.querySelector("#tm_lunch_menu_widget-2").innerHTML;
		const img = dom.window.document.querySelector("#media_image-3").querySelector("img").src;

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
		return res.status(500).json({ status: "Error", message: "Something went wrong with deu" });
	});
};
