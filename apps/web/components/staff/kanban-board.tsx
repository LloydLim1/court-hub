"use client";

import { Reorder } from "framer-motion";
import { useState } from "react";

import { kanbanColumns } from "../../lib/mock-data";

type ColumnKey = keyof typeof kanbanColumns;

export function KanbanBoard() {
  const [columns, setColumns] = useState(kanbanColumns);

  const updateColumn = (column: ColumnKey, items: string[]) => {
    setColumns((current) => ({ ...current, [column]: items }));
  };

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {(Object.keys(columns) as ColumnKey[]).map((columnKey) => (
        <div className="glass-card rounded-[28px] p-5" key={columnKey}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold capitalize text-white">{columnKey}</h3>
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300">
              {columns[columnKey].length}
            </span>
          </div>
          <Reorder.Group
            axis="y"
            className="mt-5 space-y-3"
            onReorder={(items) => updateColumn(columnKey, items)}
            values={columns[columnKey]}
          >
            {columns[columnKey].map((item) => (
              <Reorder.Item
                className="rounded-[22px] border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200"
                drag
                key={item}
                value={item}
                whileDrag={{ scale: 1.05, rotate: 2, zIndex: 2 }}
              >
                {item}
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      ))}
    </div>
  );
}
