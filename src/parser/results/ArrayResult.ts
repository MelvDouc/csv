import type { ArrayParserOptions, CsvArrayRow, ParseResult } from "../../types.ts";

export default class ArrayResult implements ParseResult<CsvArrayRow> {
  private readonly rows: CsvArrayRow[] = [];
  private currentRow: CsvArrayRow = [];
  private currentValue: string = "";
  private currentIndex: number = 0;

  public constructor(
    private readonly mapper: ArrayParserOptions["mapper"],
    private readonly ignoreEmptyLines: boolean
  ) { }

  private get transformedValue(): unknown {
    return this.mapper
      ? this.mapper(this.currentValue, this.currentIndex)
      : this.currentValue;
  }

  public getRows(): CsvArrayRow[] {
    return this.rows;
  }

  public setCurrentValue(value: string): void {
    this.currentValue = value;
  }

  public saveCurrentField(): void {
    this.currentRow.push(this.transformedValue);
    this.currentValue = "";
    this.currentIndex++;
  }

  public saveCurrentRow(): void {
    this.currentRow.push(this.transformedValue);
    this.rows.push(this.currentRow);

    if (this.currentRow.length === 0 && this.ignoreEmptyLines)
      return;

    this.currentValue = "";
    this.currentIndex = 0;
    this.currentRow = [];
  }
}