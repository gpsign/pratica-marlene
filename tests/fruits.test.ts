import supertest from "supertest";

import app from "../src/index";
import prisma from "../src/data/database";
import { beforeEach, describe } from "node:test";
import httpStatus from "http-status";
import { newFruit } from "./factories/fruit-factory";

const api = supertest(app);

afterEach(async () => {
	await prisma.fruit.deleteMany({});
});

describe("POST /fruits", () => {
	it("should return 422 when inserting a fruit with data missing", async () => {
		const { statusCode } = await api
			.post("/fruits")
			.send({ name: "Jabuticaba" });
		expect(statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY);
	});

	it("should return 409 when inserting a fruit that is already registered", async () => {
		const fruit = newFruit();
		await prisma.fruit.create({ data: fruit });

		const { statusCode } = await api.post("/fruits").send(fruit);
		expect(statusCode).toBe(httpStatus.CONFLICT);
	});

	it("should return 201 when inserting a fruit", async () => {
		const fruit = newFruit();
		const { body, statusCode } = await api.post("/fruits").send(fruit);

		expect(statusCode).toBe(httpStatus.CREATED);
	});
});

describe("GET /fruits", () => {
	it("shoud return 404 when trying to get a fruit by an id that doesn't exist", async () => {
		const { statusCode } = await api.get("/fruits/99999");
		expect(statusCode).toBe(httpStatus.NOT_FOUND);
	});

	it("should return 400 when id param is present but not valid", async () => {
		const { statusCode } = await api.get("/fruits/abc");
		expect(statusCode).toBe(httpStatus.BAD_REQUEST);
	});

	it("should return one fruit when given a valid and existing id", async () => {
		const fruit = await prisma.fruit.create({ data: newFruit() });
		const { body } = await api.get("/fruits/" + fruit.id);

		expect(body).toEqual({
			id: fruit.id,
			name: fruit.name,
			price: fruit.price,
		});
	});

	it("should return all fruits if no id is present", async () => {
		const fruit_one = await prisma.fruit.create({ data: newFruit() });
		const fruit_two = await prisma.fruit.create({ data: newFruit() });
		const fruit_three = await prisma.fruit.create({ data: newFruit() });

		const { body } = await api.get("/fruits");

		expect(body).toHaveLength(3);
		expect(body).toEqual([
			{
				id: fruit_one.id,
				name: fruit_one.name,
				price: fruit_one.price,
			},
			{
				id: fruit_two.id,
				name: fruit_two.name,
				price: fruit_two.price,
			},
			{
				id: fruit_three.id,
				name: fruit_three.name,
				price: fruit_three.price,
			},
		]);
	});
});
