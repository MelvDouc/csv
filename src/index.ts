import Parser from "./parser/Parser.ts";
import { stringify } from "./stringify/mod.ts";
import type {
  ArrayParserOptions,
  CsvArrayRow,
  CsvDictionaryRow,
  CsvValue,
  DictionaryParserOptions,
  ParserOptions
} from "./types.ts";

const DEFAULT_OPTIONS = {
  type: "array"
} as const;

/**
 * Parse a CSV string.
 * @param input The CSV string to parse.
 * @param options Various parameters to customize parsing.
 * @returns An array of arrays.
 */
function parse<T extends CsvArrayRow>(input: string, options?: ArrayParserOptions): T[];
/**
 * Parse a CSV string.
 * @param input The CSV string to parse.
 * @param options Various parameters to customize parsing.
 * @returns An array of dictionaries.
 */
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
  CsvValue,
  DictionaryParserOptions,
  ParserOptions
};