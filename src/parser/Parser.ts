import { TokenKind } from "../lexer/constants.ts";
import Lexer from "../lexer/Lexer.ts";
import type { ParserOptions, Token } from "../types.ts";
import ArrayResult from "./results/ArrayResult.ts";
import DictionaryResult from "./results/DictionaryResult.ts";

export default class Parser {
  private static getTokens(input: string): Token[] {
    return [...new Lexer(input).lex()];
  }

  private static getResult(options: ParserOptions) {
    switch (options.type) {
      case "array":
        return new ArrayResult(options.mapper, !!options.ignoreEmptyLines);
      case "dictionary":
        return new DictionaryResult(options.mapper, !!options.ignoreEmptyLines);
    }
  }

  private readonly tokens: Token[];
  private index: number;

  public constructor(input: string) {
    this.tokens = Parser.getTokens(input);
    this.index = 0;
  }

  public parse(options: ParserOptions) {
    const result = Parser.getResult(options);
    let doubleQuoteAllowed = true;
    let token: Token;

    do {
      token = this.next();

      switch (token.kind) {
        case TokenKind.EndOfFile: {
          result.saveCurrentRow();
          break;
        }
        case TokenKind.Bad: {
          throw new Error(`Unexpected token at ${token.position}.`);
        }
        case TokenKind.FieldValue: {
          result.setCurrentValue(token.value);
          doubleQuoteAllowed = false;
          break;
        }
        case TokenKind.Comma: {
          result.saveCurrentField();
          doubleQuoteAllowed = true;
          break;
        }
        case TokenKind.DoubleQuote: {
          if (!doubleQuoteAllowed)
            throw new Error(`Unexpected double quote at ${token.position}.`);

          result.setCurrentValue(this.handleDoubleQuote());
          doubleQuoteAllowed = false;
          break;
        }
        case TokenKind.LineBreak: {
          result.saveCurrentRow();
          doubleQuoteAllowed = true;
          break;
        }
      }
    } while (token.kind !== TokenKind.EndOfFile);

    return result.getRows();
  }

  private getToken(index: number): Token {
    index = Math.min(index, this.tokens.length - 1);
    return this.tokens[index];
  }

  private next(): Token {
    return this.getToken(this.index++);
  }

  private handleDoubleQuote(): string {
    const textToken = this.next();

    if (textToken.kind !== TokenKind.FieldValue)
      throw new Error(`Unexpected token at ${textToken.position}: expected field value.`);

    const doubleQuoteToken = this.next();

    if (doubleQuoteToken.kind !== TokenKind.DoubleQuote)
      throw new Error(`Unexpected token at ${textToken.position}: expected double quote.`);

    return textToken.value;
  }
}