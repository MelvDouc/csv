import CSV from "$/index.ts";
import { equal as assertEquals } from "node:assert";
import { test } from "node:test";

test("stringify array rows", () => {
  const data = [
    [1, "name 1"],
    [2, "name\n2"]
  ];
  const stringified = CSV.stringify(data);
  const expected = `1,name 1\n2,"name\n2"`;
  assertEquals(stringified, expected);
});

test("stringify dictionary rows", () => {
  const data = [
    { id: 1, name: "name 1" },
    { id: 2, name: "name \"2\"" }
  ];
  const stringified = CSV.stringify(data);
  const expected = `id,name\n1,name 1\n2,"name ""2"""`;
  assertEquals(stringified, expected);
});