import type { CsvDictionaryRow, DictionaryParserOptions, ParseResult } from "../../types.ts";

export default class DictionaryResult implements ParseResult<CsvDictionaryRow> {
  private readonly rows: CsvDictionaryRow[] = [];
  private readonly headers: string[] = [];
  private currentRow: CsvDictionaryRow = {};
  private currentValue: string = "";
  private currentIndex: number = 0;
  private headersParsed = false;

  public constructor(
    private readonly mapper: DictionaryParserOptions["mapper"],
    private readonly ignoreEmptyLines: boolean
  ) { }

  private get currentHeader(): string {
    return this.headers[this.currentIndex];
  }

  private get transformedValue(): unknown {
    return this.mapper
      ? this.mapper(this.currentValue, this.currentHeader)
      : this.currentValue;
  }

  public getRows(): CsvDictionaryRow[] {
    return this.rows;
  }

  public setCurrentValue(value: string): void {
    this.currentValue = value;
  }

  public saveCurrentField(): void {
    if (!this.headersParsed) {
      this.headers.push(this.currentValue);
      this.currentValue = "";
      return;
    }

    this.currentRow[this.currentHeader] = this.transformedValue;
    this.currentValue = "";
    this.currentIndex++;
  }

  public saveCurrentRow(): void {
    if (!this.headersParsed) {
      this.headers.push(this.currentValue);
      this.currentValue = "";
      this.headersParsed = true;
      return;
    }

    if (this.currentIndex === 0 && this.ignoreEmptyLines)
      return;

    this.currentRow[this.currentHeader] = this.transformedValue;
    this.rows.push(this.currentRow);
    this.currentValue = "";
    this.currentIndex = 0;
    this.currentRow = {};
  }
}