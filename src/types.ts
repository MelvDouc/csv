import type { TokenKind } from "$/lexer/constants.ts";
import type Position from "$/lexer/Position.ts";

// ===== ===== ===== ===== =====
// Tokens
// ===== ===== ===== ===== =====

type EndOfFileToken = {
  kind: TokenKind.EndOfFile;
  position: Position;
};

type BadToken = {
  kind: TokenKind.Bad;
  value: string;
  position: Position;
};

type FieldToken = {
  kind: TokenKind.FieldValue;
  value: string;
  position: Position;
};

type CommaToken = {
  kind: TokenKind.Comma;
  position: Position;
};

type DoubleQuoteToken = {
  kind: TokenKind.DoubleQuote;
  position: Position;
};

type LineBreakToken = {
  kind: TokenKind.LineBreak;
  position: Position;
};

export type Token =
  | EndOfFileToken
  | BadToken
  | FieldToken
  | CommaToken
  | DoubleQuoteToken
  | LineBreakToken;

// ===== ===== ===== ===== =====
// CSV records
// ===== ===== ===== ===== =====

/**
 * Any JavaScript value to that can be stringified into a CSV field value.
 */
export type CsvValue = string | number | bigint | boolean | null | undefined;

/**
 * A line of field values in a CSV document without a header row.
 */
export type CsvArrayRow = unknown[];

/**
 * A line of field values in a CSV document with a header row.
 */
export type CsvDictionaryRow = Record<string, unknown>;

/**
 * Options to use when a CSV document doesn't have a header row.
 */
export type ArrayParserOptions = {
  /**
   * Treat the first row as a regular row.
   * The return value will be a two-dimensional array of field values.
   */
  type: "array";
  /**
   * Replace each field value with the return value of this function.
   */
  mapper?: ((value: string, index: number) => unknown);
  /**
   * @default false
   */
  ignoreEmptyLines?: boolean;
};

/**
 * Options to use when a CSV document has a header row.
 */
export type DictionaryParserOptions = {
  /**
   * Treat the first row as a header row.
   * The returned array will consist of dictionary-like objects whose keys correspond to the header row.
   */
  type: "dictionary";
  /**
   * Replace each field value with the return value of this function.
   */
  mapper?: ((value: string, header: string) => unknown);
  /**
   * @default false
   */
  ignoreEmptyLines?: boolean;
};

/**
 * Options to define:
 * - whether the first row should be treated as a header row,
 * - how to transform each field value,
 * - whether to ignore empty lines.
 */
export type ParserOptions = ArrayParserOptions | DictionaryParserOptions;

export interface ParseResult<R> {
  getRows(): R[];
  setCurrentValue(value: string): void;
  saveCurrentField(): void;
  saveCurrentRow(): void;
}