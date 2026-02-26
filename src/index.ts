import Parser from "$/parser/Parser.ts";
import { stringify } from "$/stringify/mod.ts";
import type {
  ArrayParserOptions,
  CsvArrayRow,
  CsvDictionaryRow,
  DictionaryParserOptions,
  ParserOptions
} from "$/types.ts";

const DEFAULT_OPTIONS = {
  type: "array"
} as const;

function parse<T extends CsvArrayRow>(input: string, options?: ArrayParserOptions): T[];
function parse<T extends CsvDictionaryRow>(input: string, options: DictionaryParserOptions): T[];

function parse(input: string, options: ParserOptions = DEFAULT_OPTIONS) {
  return new Parser(input).parse(options);
}

const CSV = {
  parse,
  stringify
} as const;

export default CSV;

export type {
  ArrayParserOptions,
  CsvArrayRow,
  CsvDictionaryRow,
  DictionaryParserOptions,
  ParserOptions
};