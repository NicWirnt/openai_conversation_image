"use client";

import { useEditor } from "@/providers/stores/editor.provider";
import type {
  DescriptionCell,
  HeaderRow,
  PricingTableColumn,
  ProductRow,
  TaxPricingTableColumn,
  TotalPricingTableColumn,
} from "@/types/blocks/pricingTable";
import type { PricingTableRowStyles } from "@/types/document";
import _ from "lodash";
import type { Dispatch, SetStateAction } from "react";
import { memo, useState } from "react";

import { useShallow } from "zustand/react/shallow";

type CellProps = {
  rowData: ProductRow;
  tableId: string;
  sectionHeader?: HeaderRow;
  columnData: PricingTableColumn;
  columnListData:
    | PricingTableColumn[]
    | TaxPricingTableColumn[]
    | TotalPricingTableColumn[];
  styles: PricingTableRowStyles;
  hideEditor: boolean;
  focused: boolean;
  editing: boolean;
  forceShowDescription: boolean;
  setForceShowDescription: Dispatch<SetStateAction<boolean>>;
};

const DescriptionTableCell = ({
  rowData,
  tableId,
  sectionHeader,
  columnData,
  columnListData,
  styles,
  hideEditor,
  focused,
  editing,
  forceShowDescription,
  setForceShowDescription,
}: CellProps) => {
  const editorStore = useEditor();
  const updateProductLabelCell = editorStore(
    useShallow((state) => state.updateProductLabelCell),
  );
  const toggleRowOptionalSelected = editorStore(
    useShallow((state) => state.toggleRowOptionalSelected),
  );

  const [currentValue, setCurrentValue] = useState<string | undefined>(
    undefined,
  );
  const cell = rowData.cells.find(
    (cell) => cell.columnID === columnData.id,
  ) as DescriptionCell;

  if (hideEditor || !focused || !editing) {
    return (
      <div className="flex items-center gap-2">
        {sectionHeader?.enableSelection &&
          sectionHeader?.selectionType === "singleRow" && (
            <input
              type="radio"
              className="h-4 w-4 rounded-full border border-neutral-200"
            />
          )}
        {((sectionHeader?.enableSelection &&
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          sectionHeader?.selectionType === "multipleRow") ||
          rowData?.enableSelection) && (
          <input
            type="checkbox"
            className="h-4 w-4 rounded-sm border border-neutral-200"
            checked={rowData?.selected}
          />
        )}
        <div className="text-left">{cell?.label ?? ""}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {sectionHeader?.enableSelection &&
          sectionHeader?.selectionType === "singleRow" && (
            <input
              type="radio"
              className="h-4 w-4 rounded-full border border-neutral-200"
              checked={rowData?.selected}
            />
          )}
        {((sectionHeader?.enableSelection &&
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          sectionHeader?.selectionType === "multipleRow") ||
          rowData?.enableSelection) && (
          <input
            type="checkbox"
            className="h-4 w-4 rounded-sm border border-neutral-200"
            checked={rowData?.selected}
            onChange={() => {
              toggleRowOptionalSelected({
                rowId: rowData.id,
                blockId: tableId,
                enabled: !rowData.selected,
              });
            }}
          />
        )}
        <input
          className="rounded-xs w-full border-none bg-neutral-100 px-2 py-0 focus:outline-none focus:ring-0"
          type="text"
          placeholder="Type Product Label here..."
          value={currentValue ?? cell?.label} // Ensure value is treated as a string
          onChange={(e) => setCurrentValue(e.target.value)} // Directly pass string value
          onBlur={() => {
            if (currentValue === undefined) return;
            updateProductLabelCell({
              columnId: columnData.id,
              rowId: rowData.id,
              value: currentValue,
              blockId: tableId,
            });
            setCurrentValue(undefined);
          }}
          autoFocus
        />
      </div>
      {!forceShowDescription && (
        <div
          className="rounded-xs w-full border-none bg-neutral-100 px-2 py-1 text-neutral-400"
          onClick={() => setForceShowDescription(true)}
        >
          Type description here...
        </div>
      )}

      {/* <input
        className="w-full py-0 bg-neutral-100 border-neutral-200 border rounded-md p-2"
        type="text"
        placeholder="Type description here..."
        // value={currentValue ?? cell?.label} // Ensure value is treated as a string
        // onChange={(e) => setCurrentValue(e.target.value)} // Directly pass string value
        onBlur={() => {}}
      /> */}
      <span className="italics text-xs text-neutral-300 hover:text-blue-200">
        Click to add product image
      </span>
    </div>
  );
};

const isCellEqual = (prevProps: CellProps, nextProps: CellProps) => {
  // Check for equality on all props except 'page'
  if (!_.isEqual(prevProps.styles, nextProps.styles)) return false;
  if (prevProps.focused !== nextProps.focused) return false;
  if (prevProps.hideEditor !== nextProps.hideEditor) return false;
  if (prevProps.editing !== nextProps.editing) return false;
  if (prevProps.forceShowDescription !== nextProps.forceShowDescription)
    return false;
  if (!_.isEqual(prevProps.sectionHeader, nextProps.sectionHeader))
    return false;
  return _.isEqual(prevProps.rowData, nextProps.rowData);
};

export const DescriptionTableCellMemoized = memo(
  DescriptionTableCell,
  isCellEqual,
);
