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
}

export default function DataTable(
    { columns, data, topN = 10, sortable = true, defaultSortCol, defaultSortDir }: DataTableProps,
) {
    const initialSortCol = defaultSortCol || (columns.length > 0 ? columns[0].key : "");
    const initialSortDir = defaultSortDir || "asc";
    const [sortCol, setSortCol] = useState<string>(initialSortCol);
    const [sortDir, setSortDir] = useState<"asc" | "desc">(initialSortDir);

    if (!data || !columns) return null;
    const rowsToShow = data.slice(0, topN);
    if (!rowsToShow.length) {
        return <div style={{ padding: "1rem", textAlign: "center", color: "#888" }}>No data available</div>;
    }
    const sorted = sortable
        ? [...rowsToShow].sort((a, b) => {
            let aVal = a[sortCol];
            let bVal = b[sortCol];
            if (typeof aVal === "string" && typeof bVal === "string") {
                return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortDir === "asc" ? aVal - bVal : bVal - aVal;
            }
            // fallback
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
        <table>
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th
                            key={col.key}
                            onClick={() => handleSort(col.key)}
                            style={{ cursor: sortable ? "pointer" : "default" }}
                        >
                            {col.label}
                            {sortable && sortCol === col.key ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
                        </th>
                    ))}
                </tr>
            </thead>
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
        </table>
    );
}
