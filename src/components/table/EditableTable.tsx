/**
 * Editable Table Component
 *
 * Excel-like table with editable cells, formulas, and styling
 */

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  type Row,
} from '@tanstack/react-table';
import { useState, useMemo, useCallback } from 'react';
import { Plus, Trash2, Type, Palette } from 'lucide-react';
import { Button } from '../ui';
import type { TableCell, TableColumn, TableData } from '@/types/document';

export interface EditableTableProps {
  data: TableData;
  onChange: (data: TableData) => void;
}

export default function EditableTable({ data, onChange }: EditableTableProps) {
  const [selectedCell, setSelectedCell] = useState<{ rowIndex: number; columnId: string } | null>(null);
  const [showCellStyles, setShowCellStyles] = useState(false);

  // Update cell value
  const updateCellValue = useCallback(
    (rowIndex: number, columnId: string, value: string | number | boolean | null) => {
      const newRows = [...data.rows];
      newRows[rowIndex] = {
        ...newRows[rowIndex],
        cells: {
          ...newRows[rowIndex].cells,
          [columnId]: {
            ...newRows[rowIndex].cells[columnId],
            value,
          },
        },
      };
      onChange({ ...data, rows: newRows });
    },
    [data, onChange]
  );

  // Add new column
  const addColumn = useCallback(() => {
    const columnNumber = data.columns.length + 1;
    const newColumn: TableColumn = {
      id: `col-${Date.now()}`,
      name: `Column ${columnNumber}`,
      type: 'text',
      width: 150,
    };

    const newRows = data.rows.map((row) => ({
      ...row,
      cells: {
        ...row.cells,
        [newColumn.id]: { value: '' },
      },
    }));

    onChange({
      ...data,
      columns: [...data.columns, newColumn],
      rows: newRows,
    });
  }, [data, onChange]);

  // Delete column
  const deleteColumn = useCallback(
    (columnId: string) => {
      const newColumns = data.columns.filter((col) => col.id !== columnId);
      const newRows = data.rows.map((row) => {
        const { [columnId]: removed, ...remainingCells } = row.cells;
        return { ...row, cells: remainingCells };
      });

      onChange({
        ...data,
        columns: newColumns,
        rows: newRows,
      });
    },
    [data, onChange]
  );

  // Add new row
  const addRow = useCallback(() => {
    const newRow = {
      id: `row-${Date.now()}`,
      cells: data.columns.reduce(
        (acc, col) => ({
          ...acc,
          [col.id]: { value: '' },
        }),
        {} as Record<string, TableCell>
      ),
      level: 0 as const,
    };

    onChange({
      ...data,
      rows: [...data.rows, newRow],
    });
  }, [data, onChange]);

  // Delete row
  const deleteRow = useCallback(
    (rowIndex: number) => {
      const newRows = data.rows.filter((_, index) => index !== rowIndex);
      onChange({ ...data, rows: newRows });
    },
    [data, onChange]
  );

  // Update cell styles
  const updateCellStyles = useCallback(
    (rowIndex: number, columnId: string, styles: TableCell['styles']) => {
      const newRows = [...data.rows];
      newRows[rowIndex] = {
        ...newRows[rowIndex],
        cells: {
          ...newRows[rowIndex].cells,
          [columnId]: {
            ...newRows[rowIndex].cells[columnId],
            styles: {
              ...newRows[rowIndex].cells[columnId].styles,
              ...styles,
            },
          },
        },
      };
      onChange({ ...data, rows: newRows });
    },
    [data, onChange]
  );

  // Calculate formula
  const calculateFormula = useCallback(
    (formula: string, rowIndex: number, columnId: string): string | number => {
      const match = formula.match(/^=(SUM|AVERAGE|COUNT)\(([\w-]+)\)$/i);
      if (!match) return formula;

      const [, func, targetCol] = match;
      const values = data.rows
        .map((row) => {
          const cell = row.cells[targetCol];
          return typeof cell?.value === 'number' ? cell.value : 0;
        })
        .filter((v) => typeof v === 'number');

      switch (func.toUpperCase()) {
        case 'SUM':
          return values.reduce((sum, val) => sum + val, 0);
        case 'AVERAGE':
          return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
        case 'COUNT':
          return values.length;
        default:
          return formula;
      }
    },
    [data.rows]
  );

  // Create columns for TanStack Table
  const columns: ColumnDef<(typeof data.rows)[0]>[] = useMemo(
    () =>
      data.columns.map((col) => ({
        id: col.id,
        accessorKey: col.id,
        header: () => (
          <div className="flex items-center justify-between gap-2 group">
            <input
              type="text"
              value={col.name}
              onChange={(e) => {
                const newColumns = data.columns.map((c) =>
                  c.id === col.id ? { ...c, name: e.target.value } : c
                );
                onChange({ ...data, columns: newColumns });
              }}
              className="flex-1 px-2 py-1 text-sm font-semibold bg-transparent border-none focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary-500 rounded"
            />
            <button
              onClick={() => deleteColumn(col.id)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-opacity"
              title="Delete column"
            >
              <Trash2 className="w-3 h-3 text-red-600" />
            </button>
          </div>
        ),
        cell: ({ row }) => {
          const cell = row.original.cells[col.id];
          const isSelected =
            selectedCell?.rowIndex === row.index && selectedCell?.columnId === col.id;

          let displayValue = cell?.value ?? '';
          if (cell?.formula) {
            displayValue = calculateFormula(cell.formula, row.index, col.id);
          }

          return (
            <div className="relative group">
              <input
                type={col.type === 'number' ? 'number' : 'text'}
                value={String(displayValue)}
                onChange={(e) => {
                  const value =
                    col.type === 'number' && e.target.value
                      ? parseFloat(e.target.value)
                      : e.target.value;
                  updateCellValue(row.index, col.id, value);
                }}
                onFocus={() => setSelectedCell({ rowIndex: row.index, columnId: col.id })}
                onBlur={() => setSelectedCell(null)}
                className="w-full px-2 py-1.5 text-sm bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary-500"
                style={{
                  fontWeight: cell?.styles?.fontWeight,
                  color: cell?.styles?.color,
                  backgroundColor: cell?.styles?.backgroundColor,
                  textAlign: cell?.styles?.textAlign,
                }}
              />
              {isSelected && (
                <button
                  onClick={() => setShowCellStyles(!showCellStyles)}
                  className="absolute right-1 top-1 p-1 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50"
                  title="Cell styles"
                >
                  <Palette className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        },
        size: col.width || 150,
      })),
    [data, selectedCell, calculateFormula, deleteColumn, onChange, updateCellValue, showCellStyles]
  );

  const table = useReactTable({
    data: data.rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-2">
      {/* Table Toolbar */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <Button size="sm" onClick={addColumn} title="Add Column">
          <Plus className="w-4 h-4 mr-1" />
          Column
        </Button>
        <Button size="sm" onClick={addRow} title="Add Row">
          <Plus className="w-4 h-4 mr-1" />
          Row
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-auto border border-gray-300 rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-50">
                <th className="w-12 px-2 py-2 border-b border-r border-gray-300 text-xs text-gray-500">
                  #
                </th>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-2 py-2 border-b border-r border-gray-300 text-left"
                    style={{ width: header.getSize() }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
                <th className="w-12 px-2 py-2 border-b border-gray-300"></th>
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, rowIndex) => (
              <tr key={row.id} className="hover:bg-gray-50 group">
                <td className="px-2 py-1 border-b border-r border-gray-300 text-center text-xs text-gray-500 bg-gray-50">
                  {rowIndex + 1}
                </td>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border-b border-r border-gray-300 p-0">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td className="px-2 py-1 border-b border-gray-300 text-center">
                  <button
                    onClick={() => deleteRow(rowIndex)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-opacity"
                    title="Delete row"
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Stats */}
      <div className="text-xs text-gray-600">
        {data.columns.length} columns × {data.rows.length} rows
      </div>
    </div>
  );
}
