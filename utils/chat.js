/* eslint-disable no-case-declarations */
/* eslint-disable no-param-reassign */
const { getServices, getStates, getLgas } = require("../services");

const one = {
	full_name: "Kindly enter your full name",
	service: "Kindly choose the service you offer",
	state: "What state do you reside ?",
	lga: "What is your LGA?",
	address: "Enter your address",
	id_card: "Attach your ID card",
	picture: "Attach your picture",
};

const two = {
	full_name: "Kindly enter your full name",
	service: "Select a service",
	address: "Enter your address",
	location: "Enter your location",
	task_description: "Describe your task(kindly make it brief)",
	artisan:
		"See attached list of verifiable artisans in your location and select one.... the artisan details goes thus",
};

const menus = {
	1: one,

	2: two,
};
const getAllQuestionsKeys = () => {
	const allKeys = [...Object.keys(menus[1]), ...Object.keys(menus[2])];
	const unique = Array.from(new Set(allKeys));
	return unique;
};

const getComparedMenu = (menu) => {
	const flip = { 1: 2, 2: 1 };
	return menus[flip[menu]];
};
const initContrastToInstance = (menu, instance) => {
	const compareMenuObj = getComparedMenu(menu);
	const keys = Object.keys(compareMenuObj);
	keys.forEach((key) => {
		if (!menus[menu][key]) {
			instance[key] = "NA";
		}
	});
};

const saveOnlyNeedValues = (menu, entity) => {
	delete entity.id;
	delete entity.createdAt;
	delete entity.updatedAt;

	const compareMenuObj = getComparedMenu(menu);
	const keys = Object.keys(compareMenuObj);
	keys.forEach((key) => {
		if (!menus[menu][key]) {
			delete entity[key];
		}
	});
};
//  const getStageNullColumns = (ent) => {
// 	const existedStageKeys = Object.keys(ent);
// 	return existedStageKeys.filter((key) => ent[key] === null);
// };

const menuOptions = [
	"Render Service (Artisan)",
	"Request Service Provider(Customer)",
];

const welcomeResponse = {
	message: `\nWelcome, how do we help you today? ${menuOptions.map(
		(op, i) => `\n${i + 1}:${op}`
	)}`,
};

// const services = ["Plumber", "Carpenter", "AC Repairs"];
const getIndexedString = (data, returnKey) => {
	if (!data) throw new Error("endpoints not found");
	return returnKey
		? `${data.map((entity, index) => `\n${index + 1}-${entity[returnKey]}`)}`
		: `${data.map((entity, index) => `\n${index + 1}-${entity}`)}`;
};

const getIndexedValue = (data, message, key) =>
	data.find((_obj, index) => index + 1 === Number(message))[key];
const getRightQuestions = async (existedUserStage, nextStepSuccessor) => {
	const nextQuestion = menus[existedUserStage.menu][nextStepSuccessor];

	let finalQuestion;
	// search and get state lists
	switch (nextStepSuccessor) {
		case "full_name":
			finalQuestion = `\nWelcome to the registration of creditclan. we would like to ask you some questions\n${nextQuestion}`;
			break;
		case "service":
			const { data: services } = await getServices();
			finalQuestion = `${nextQuestion} \n${getIndexedString(services)}`;
			break;
		case "state":
			const stateResponse = await getStates();

			const states = stateResponse.data;

			finalQuestion = getIndexedString(states, "name");
			break;

		case "lga":
			const lgaResponse = await getLgas();

			const lgas = lgaResponse.data;

			finalQuestion = getIndexedString(lgas, "lga");
			break;
		default:
			finalQuestion = nextQuestion;
			break;
	}
	return finalQuestion;
};

module.exports = {
	getAllQuestionsKeys,
	menus,
	menuOptions,
	welcomeResponse,
	getRightQuestions,
	initContrastToInstance,
	saveOnlyNeedValues,
	getIndexedValue,
};
