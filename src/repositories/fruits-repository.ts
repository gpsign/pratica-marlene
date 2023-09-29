import prisma from "../data/database";
import { Fruit } from "@prisma/client";

async function getFruits() {
	return prisma.fruit.findMany();
}

async function getSpecificFruit(id: number) {
	return prisma.fruit.findUnique({ where: { id } });
}

async function getSpecificFruitByName(name: string) {
	return prisma.fruit.findFirst({ where: { name } });
}

export type CreateFruit = Omit<Fruit, "id">;

async function insertFruit(fruit: CreateFruit) {
	return prisma.fruit.create({ data: fruit });
}

const fruitsRepository = {
	getFruits,
	getSpecificFruit,
	getSpecificFruitByName,
	insertFruit,
};

export default fruitsRepository;
