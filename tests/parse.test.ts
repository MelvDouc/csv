import CSV from "$/index.ts";
import { assertEquals } from "@std/assert";

Deno.test("parser #1", () => {
  const testInput = Deno.readTextFileSync("data/test1.csv");
  const data = CSV.parse<{ id: string; name: string; }>(testInput, {
    type: "dictionary",
    ignoreEmptyLines: true
  });

  assertEquals(data[1].name, "");
  assertEquals(data[2].name, ' in "quotes" ');
  assertEquals(data[3].name, "two\r\nlines");
  assertEquals(data[4].id, "");
});

Deno.test("parser #2", () => {
  const testInput = Deno.readTextFileSync("data/CaliforniaHousing.csv");
  const data = CSV.parse(testInput, {
    type: "array",
    mapper: (value) => isNaN(+value) ? value : +value
  });

  assertEquals(typeof data[0][0], "string");
  assertEquals(data[data.length - 1][0], -121.24);
});