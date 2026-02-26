import CSV from "$/index.ts";
import { equal as assertEquals } from "node:assert";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

describe("The parser should recognize", async () => {
  const testInput1 = await readFile("data/test1.csv", "utf-8");
  const data = CSV.parse<Test1Row>(testInput1, {
    type: "dictionary",
    ignoreEmptyLines: true
  });

  it("empty double quotes", () => {
    const row = data[1];
    assertEquals(row.name, "");
  });

  it("escaped double quotes", () => {
    const row = data[2];
    assertEquals(row.name, ' in "quotes" ');
  });

  it("escaped line breaks", () => {
    const row = data[3];
    assertEquals(row.name, "two\r\nlines");
  });

  it("empty fields", () => {
    const row = data[4];
    assertEquals(row.id, "");
  });
});

describe("The parser should handle", async () => {
  const testInput2 = await readFile("data/CaliforniaHousing.csv", "utf-8");
  const data = CSV.parse(testInput2, {
    type: "array",
    mapper: (value) => isNaN(+value) ? value : +value
  });

  it("transformations", () => {
    assertEquals(typeof data[0][0], "string");
    assertEquals(data[data.length - 1][0], -121.24);
  });
});

type Test1Row = {
  id: string;
  name: string;
};