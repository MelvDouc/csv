import { CARRIAGE_RETURN, DOUBLE_QUOTE, LINE_FEED } from "$/lexer/constants.ts";
import type { CsvArrayRow, CsvDictionaryRow } from "$/types.ts";

export function stringify(rows: CsvArrayRow[] | CsvDictionaryRow[]): string {
  if (rows.length === 0)
    return "";

  return Array.isArray(rows[0])
    ? stringifyArrayRows(rows as CsvArrayRow[])
    : stringifyDictionaryRows(rows as CsvDictionaryRow[]);
}

function stringifyArrayRows(rows: CsvArrayRow[]): string {
  return rows
    .map((row) => row.map(formatValue).join(","))
    .join("\n");
}

function stringifyDictionaryRows(rows: CsvDictionaryRow[]): string {
  const headers = Object.keys(rows[0]);
  const values = rows
    .map((row) => headers.map((header) => formatValue(row[header])).join(","))
    .join("\n");

  return headers.join(",") + "\n" + values;
}

function formatValue(value: unknown): string {
  if (typeof value !== "string")
    return String(value);

  if (value.includes(DOUBLE_QUOTE))
    return DOUBLE_QUOTE + value.replace(/"/g, DOUBLE_QUOTE + DOUBLE_QUOTE) + DOUBLE_QUOTE;

  if (value.includes(CARRIAGE_RETURN) || value.includes(LINE_FEED))
    return DOUBLE_QUOTE + value + DOUBLE_QUOTE;

  return value;
}