"use client";

import { cn } from "@/lib/utils";
import { useEditor } from "@/providers/stores/editor.provider";
import { FooterRow, PricingTableColumn } from "@/types/blocks/pricingTable";
import { PricingTableRowStyles } from "@/types/document";
import _ from "lodash";
import { Dispatch, SetStateAction, memo, useCallback, useState } from "react";
import { useShallow } from "zustand/react/shallow";

type TableRowProps = {
  rowData: FooterRow;
  rowIndex: number;
  tableId: string;
  columnListData: PricingTableColumn[];
  styles: PricingTableRowStyles;
  hideEditor: boolean;
  focused: boolean;
  editing: boolean;
  setEditing: Dispatch<SetStateAction<string | undefined>>;
};

const TableSectionFooterRow = ({
  tableId,
  rowData,
  columnListData,
  styles,
  hideEditor,
  focused,
  editing,
  setEditing,
}: TableRowProps) => {
  const editorStore = useEditor();
  const updateSectionFooterLabel = editorStore(
    useShallow((state) => state.updateSectionFooterLabel),
  );
  const [currentValue, setCurrentValue] = useState<string | undefined>(
    undefined,
  );

  const columnList = useCallback(() => {
    return columnListData.filter((column) => {
      if (focused) return true;
      if (column.hidden) return false;
      return true;
    });
  }, [columnListData, focused, editing]);

  return (
    <>
      <tr className="relative" key={rowData?.id}>
        <td
          colSpan={columnList().length}
          className={cn(
            "group/cell relative",
            editing ? "!bg-blue-100 !bg-opacity-30" : "",
          )}
          style={{
            color: styles.typography.color,
            backgroundColor: styles.background,
            fontSize: `${styles.typography.fontSize}px`,
            fontWeight: styles.typography.fontWeight,
            textAlign: styles.typography.alignment,
            paddingTop: styles.padding.top,
            paddingBottom: styles.padding.bottom,
            paddingLeft: styles.padding.left,
            paddingRight: styles.padding.right,
            borderBottomWidth: styles.borders.bottom.width,
            borderBottomStyle: styles.borders.bottom.style,
            borderBottomColor: styles.borders.bottom.color,
          }}
          onClick={() => setEditing(rowData?.id)}
        >
          {editing && focused ? (
            <input
              className="rounded-xs w-full border-none bg-neutral-100 px-2 py-0 focus:outline-none focus:ring-0"
              type="text"
              placeholder="Type Section footer here..."
              value={currentValue ?? rowData?.label} // Ensure value is treated as a string
              onChange={(e) => setCurrentValue(e.target.value)} // Directly pass string value
              onBlur={() => {
                if (currentValue !== undefined) {
                  updateSectionFooterLabel({
                    rowId: rowData.id,
                    value: currentValue,
                    blockId: tableId,
                  });
                  setCurrentValue(undefined);
                }
              }}
            />
          ) : (
            <div className="">{rowData?.label ?? ""}</div>
          )}
        </td>
      </tr>
    </>
  );
};

const isRowEqual = (prevProps: TableRowProps, nextProps: TableRowProps) => {
  // Check for equality on all props except 'page'
  if (!_.isEqual(prevProps.styles, nextProps.styles)) return false;
  if (prevProps.focused !== nextProps.focused) return false;
  if (prevProps.hideEditor !== nextProps.hideEditor) return false;
  if (prevProps.editing !== nextProps.editing) return false;
  return _.isEqual(prevProps.rowData, nextProps.rowData);
};

export const TableSectionFooterRowMemoized = memo(
  TableSectionFooterRow,
  isRowEqual,
);
