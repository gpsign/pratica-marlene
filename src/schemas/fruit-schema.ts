import joi from "joi";
import { CreateFruit } from "repositories/fruits-repository";

export const fruitSchema = joi.object<CreateFruit>({
	name: joi.string().required(),
	price: joi.number().required(),
});
