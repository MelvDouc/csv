# CSV

A straightforward CSV parser.

## Parse

index.ts:

```ts
import { parse } from "jsr:@melvdouc/csv";

const input = `id,name\n1,John Doe`;
const data = parse<Data>(input, {
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
import { stringify } from "jsr:@melvdouc/csv";

const data = [
  { id: 1, name: "John Doe" }
];

const output = stringify(data); // id,name\n1,John Doe
```
