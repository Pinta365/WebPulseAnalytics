// deno-lint-ignore-file no-explicit-any
import { useState } from "preact/hooks";
import { JSX } from "preact";

export interface DataTableColumn {
    key: string;
    label: string;
    render?: (value: any, row: any) => JSX.Element;
}

interface DataTableProps {
    columns: DataTableColumn[];
    data: any[];
    topN?: number;
    sortable?: boolean;
    defaultSortCol?: string;
    defaultSortDir?: "asc" | "desc";
    scrollRows?: number;
}

export default function DataTable(
    { columns, data, topN = 10, sortable = true, defaultSortCol, defaultSortDir, scrollRows = 20 }: DataTableProps,
) {
    const initialSortCol = defaultSortCol || (columns.length > 0 ? columns[0].key : "");
    const initialSortDir = defaultSortDir || "asc";
    const [sortCol, setSortCol] = useState<string>(initialSortCol);
    const [sortDir, setSortDir] = useState<"asc" | "desc">(initialSortDir);

    if (!data || !columns) return null;
    const rowsToShow = data.slice(0, topN);
    const shouldScroll = rowsToShow.length > scrollRows;
    if (!rowsToShow.length) {
        return <div class="p-4 text-center text-muted">No data available</div>;
    }
    const sorted = sortable
        ? [...rowsToShow].sort((a, b) => {
            const aVal = a[sortCol];
            const bVal = b[sortCol];
            if (typeof aVal === "string" && typeof bVal === "string") {
                return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortDir === "asc" ? aVal - bVal : bVal - aVal;
            }
            return 0;
        })
        : rowsToShow;

    function handleSort(colKey: string) {
        if (!sortable) return;
        if (sortCol === colKey) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortCol(colKey);
            setSortDir("asc");
        }
    }

    return (
        <div class="overflow-x-auto">
            <table class="compact-table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                onClick={() => handleSort(col.key)}
                            >
                                {col.label}
                                {sortable && sortCol === col.key ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
                            </th>
                        ))}
                    </tr>
                </thead>
                {shouldScroll
                    ? (
                        <tbody>
                            <tr>
                                <td colSpan={columns.length} style={{ padding: 0 }}>
                                    <div style={{ maxHeight: "480px", overflowY: "auto" }}>
                                        <table class="compact-table">
                                            <tbody>
                                                {sorted.map((row, rowIdx) => (
                                                    <tr key={rowIdx}>
                                                        {columns.map((col) => (
                                                            <td key={col.key}>
                                                                {col.render
                                                                    ? col.render(row[col.key], row)
                                                                    : (row[col.key] !== undefined &&
                                                                            row[col.key] !== null &&
                                                                            String(row[col.key]).trim() !== ""
                                                                        ? row[col.key]
                                                                        : "Unknown")}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    )
                    : (
                        <tbody>
                            {sorted.map((row, rowIdx) => (
                                <tr key={rowIdx}>
                                    {columns.map((col) => (
                                        <td key={col.key}>
                                            {col.render
                                                ? col.render(row[col.key], row)
                                                : (row[col.key] !== undefined && row[col.key] !== null &&
                                                        String(row[col.key]).trim() !== ""
                                                    ? row[col.key]
                                                    : "Unknown")}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    )}
            </table>
        </div>
    );
}
