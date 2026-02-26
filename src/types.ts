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

export type CsvArrayRow = unknown[];
export type CsvDictionaryRow = Record<string, unknown>;

export interface CsvRowMap {
  array: CsvArrayRow;
  dictionary: CsvDictionaryRow;
}

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

export type ParserOptions = ArrayParserOptions | DictionaryParserOptions;

export interface ParseResult<R> {
  getRows(): R[];
  setCurrentValue(value: string): void;
  saveCurrentField(): void;
  saveCurrentRow(): void;
}