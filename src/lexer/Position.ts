export default class Position {
  public constructor(
    public readonly row: number,
    public readonly col: number
  ) { }

  public toString(): string {
    return `row ${this.row}, col ${this.col}`;
  }
}