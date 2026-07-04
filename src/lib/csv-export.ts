/**
 * CSV export utility — converts array of objects to CSV and triggers download.
 *
 * Usage:
 *   exportToCsv("businesses.csv", businesses, {
 *     columns: [
 *       { key: "name", label: "Business Name" },
 *       { key: "city", label: "City" },
 *     ]
 *   });
 */

export interface CsvColumn<T> {
  key: keyof T | string;
  label: string;
  /** Optional formatter — receives the row, returns a string */
  format?: (row: T) => string | number;
}

/**
 * Convert an array of objects to a CSV string.
 * Handles commas, quotes, and newlines in values by wrapping in double quotes.
 */
export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const escapeValue = (val: unknown): string => {
    if (val === null || val === undefined) return "";
    const str = String(val);
    // Escape double quotes by doubling them, wrap in quotes if contains comma/quote/newline
    const escaped = str.replace(/"/g, '""');
    if (/[",\n\r]/.test(str)) {
      return `"${escaped}"`;
    }
    return escaped;
  };

  const header = columns.map((c) => escapeValue(c.label)).join(",");
  const body = rows
    .map((row) =>
      columns
        .map((col) => {
          const val = col.format ? col.format(row) : (row as Record<string, unknown>)[col.key as string];
          return escapeValue(val);
        })
        .join(","),
    )
    .join("\n");

  return `${header}\n${body}`;
}

/**
 * Trigger a CSV file download in the browser.
 */
export function exportToCsv<T>(filename: string, rows: T[], columns: CsvColumn<T>[]): void {
  const csv = toCsv(rows, columns);
  // Add BOM for Excel UTF-8 compatibility
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Clean up the URL object after a brief delay
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
