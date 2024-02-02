import * as lib from "../index";

describe("Main library", () => {
	test("Scan function", async () => {
		await lib.Scan(process.env.PWD || __dirname);
	});

	test("Scan function", async () => {
		await lib.Scan(__dirname);
	});

	test("Compare function", async () => {
		await lib.Compare(100);
	});

	test("readSystemPartition function", async () => {
		await lib.readSystemPartition();
	});
});
