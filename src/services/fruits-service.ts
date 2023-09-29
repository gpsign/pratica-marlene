import { conflictError } from "../errors/conflict-error";
import { notFoundError } from "../errors/notfound-error";
import fruitsRepository, {
	CreateFruit,
} from "../repositories/fruits-repository";

async function getFruits() {
	const result = await fruitsRepository.getFruits();
	return result;
}

async function getSpecificFruit(id: number) {
	const fruit = await fruitsRepository.getSpecificFruit(id);
	if (fruit === null) {
		throw notFoundError();
	}

	return fruit;
}

async function createFruit(fruit: CreateFruit) {
	const fruitAlreadyRegistered = await fruitsRepository.getSpecificFruitByName(
		fruit.name
	);
	if (fruitAlreadyRegistered != null) {
		throw conflictError();
	}

	await fruitsRepository.insertFruit(fruit);
}

const fruitsService = {
	getFruits,
	getSpecificFruit,
	createFruit,
};

export default fruitsService;
