import {
  CARRIAGE_RETURN,
  COMMA,
  DOUBLE_QUOTE,
  EOF,
  LINE_FEED,
  TokenKind
} from "$/lexer/constants.ts";
import Position from "$/lexer/Position.ts";
import type { Token } from "$/types.ts";

export default class Lexer {
  private readonly input: string;
  private index: number;
  private row: number;
  private col: number;
  private inEscapeSequence: boolean;

  public constructor(input: string) {
    this.input = input;
    this.index = 0;
    this.row = 1;
    this.col = 1;
    this.inEscapeSequence = false;
  }

  public *lex(): Generator<Token> {
    let ch: string;

    do {
      ch = this.current;
      const position = new Position(this.row, this.col);
      this.advance();

      switch (ch) {
        case COMMA:
          yield { kind: TokenKind.Comma, position };
          break;
        case DOUBLE_QUOTE:
          yield* this.handleDoubleQuote(position);
          break;
        case CARRIAGE_RETURN:
          yield this.handleCarriageReturn(position);
          break;
        case LINE_FEED:
          yield { kind: TokenKind.LineBreak, position };
          break;
        case EOF:
          yield { kind: TokenKind.EndOfFile, position };
          break;
        default:
          yield { kind: TokenKind.FieldValue, value: this.scanText(ch), position };
      }
    } while (ch !== EOF);
  }

  private get current(): string {
    return this.getCharacter(this.index);
  }

  private getCharacter(index: number): string {
    return index < this.input.length ? this.input[index] : EOF;
  }

  private advance(): void {
    if (this.current === LINE_FEED) {
      this.row++;
      this.col = 1;
    } else {
      this.col++;
    }

    this.index++;
  }

  private scanText(firstCh: string): string {
    let output = firstCh;
    let ch = this.current;

    while (ch !== EOF && this.isText(ch)) {
      output += ch;
      this.advance();
      ch = this.current;
    }

    return output;
  }

  private isText(ch: string): boolean {
    switch (ch) {
      case COMMA:
      case CARRIAGE_RETURN:
      case LINE_FEED:
        return this.inEscapeSequence;
      case DOUBLE_QUOTE:
        return this.isEscapedDoubleQuote();
      default:
        return true;
    }
  }

  private isEscapedDoubleQuote(): boolean {
    if (this.getCharacter(this.index + 1) === DOUBLE_QUOTE) {
      this.advance();
      return true;
    }

    return false;
  }

  private *handleDoubleQuote(position: Position): Generator<Token> {
    yield { kind: TokenKind.DoubleQuote, position };
    this.inEscapeSequence = !this.inEscapeSequence;

    if (this.inEscapeSequence) {
      const position = new Position(this.row, this.col);
      yield { kind: TokenKind.FieldValue, value: this.scanText(""), position };
    }
  }

  private handleCarriageReturn(position: Position): Token {
    if (this.current === LINE_FEED) {
      this.advance();
      return { kind: TokenKind.LineBreak, position };
    }

    return { kind: TokenKind.Bad, value: CARRIAGE_RETURN, position };
  }
}