import { faker } from "@faker-js/faker";
import { CreateFruit } from "repositories/fruits-repository";

export function newFruit(): CreateFruit {
	return {
		name: faker.word.adjective(),
		price: faker.number.int({ min: 1, max: 999 }),
	};
}
