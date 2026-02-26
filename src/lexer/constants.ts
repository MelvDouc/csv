export const EOF = "\0";
export const COMMA = ",";
export const DOUBLE_QUOTE = "\"";
export const CARRIAGE_RETURN = "\r";
export const LINE_FEED = "\n";

export const enum TokenKind {
  EndOfFile,
  Bad,
  FieldValue,
  Comma,
  DoubleQuote,
  LineBreak
}