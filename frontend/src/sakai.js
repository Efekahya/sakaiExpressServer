import axios from "axios";

const registerToSystem = async () => {
	await axios
		.post(
			"http://localhost:3000/user/register",
			{
				email: "email",
				password: "password",
				name: "username",
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		)
		.then((response) => {
			console.log(response.data);
		});
};

export default registerToSystem;
