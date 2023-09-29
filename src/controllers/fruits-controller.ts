import { Request, Response } from "express";
import httpStatus from "http-status";

import { CreateFruit } from "repositories/fruits-repository";
import fruitsService from "../services/fruits-service";
import { isValid } from "../utils/id-validator";

export async function getFruits(req: Request, res: Response) {
	const fruits = await fruitsService.getFruits();
	res.send(fruits);
}

export async function getSpecificFruit(req: Request, res: Response) {
	const id = parseInt(req.params.id);
	if (!isValid(id)) return res.sendStatus(httpStatus.BAD_REQUEST);

	try {
		const fruit = await fruitsService.getSpecificFruit(id);
		res.send(fruit);
	} catch (error) {
		console.log(error);
		res.sendStatus(httpStatus.NOT_FOUND);
	}
}

export async function createFruit(req: Request, res: Response) {
	const fruit = req.body as CreateFruit;
	try {
		await fruitsService.createFruit(fruit);
		res.sendStatus(httpStatus.CREATED);
	} catch (error) {
		console.log(error);
		res.sendStatus(httpStatus.CONFLICT);
	}
}
