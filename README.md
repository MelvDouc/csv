# CSV

A straightforward CSV parser.

## Parse

index.ts:

```ts
import CSV from "jsr:@melvdouc/csv";

const input = `id,name\n1,John Doe`;
const data = CSV.parse<Data>(input, {
  type: "dictionary",
  mapper: (value, field) => {
    return field === "id" ? +value : value;
  },
  ignoreEmptyLines: true
});

type Data = {
  id: number;
  name: string;
};
```

## Stringify

index.ts:

```ts
import CSV from "jsr:@melvdouc/csv";

const data = [
  { id: 1, name: "John Doe" }
];

const output = CSV.stringify(data); // id,name\n1,John Doe
```
