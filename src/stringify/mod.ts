import { CARRIAGE_RETURN, DOUBLE_QUOTE, LINE_FEED } from "$/lexer/constants.ts";
import type { CsvValue } from "$/types.ts";

/**
 * Convert an array to a CSV string.
 * @param rows An array of arrays or dictionaries.
 * @returns a CSV string.
 */
export function stringify(rows: CsvValue[][] | Record<string, CsvValue>[]): string {
  if (rows.length === 0)
    return "";

  return Array.isArray(rows[0])
    ? stringifyArrayRows(rows as CsvValue[][])
    : stringifyDictionaryRows(rows as Record<string, CsvValue>[]);
}

function stringifyArrayRows(rows: CsvValue[][]): string {
  return rows
    .map((row) => row.map(formatValue).join(","))
    .join("\n");
}

function stringifyDictionaryRows(rows: Record<string, CsvValue>[]): string {
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