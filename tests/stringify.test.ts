import CSV from "$/index.ts";
import { assertEquals } from "@std/assert";

Deno.test("stringify array rows", () => {
  const data = [
    [1, "name 1"],
    [2, "name\n2"]
  ];
  const stringified = CSV.stringify(data);
  const expected = `1,name 1\n2,"name\n2"`;
  assertEquals(stringified, expected);
});

Deno.test("stringify dictionary rows", () => {
  const data = [
    { id: 1, name: "name 1" },
    { id: 2, name: "name \"2\"" }
  ];
  const stringified = CSV.stringify(data);
  const expected = `id,name\n1,name 1\n2,"name ""2"""`;
  assertEquals(stringified, expected);
});