"use client";

import type {
  CustomCell,
  PricingTableColumn,
  ProductRow,
  TaxPricingTableColumn,
  TotalPricingTableColumn,
} from "@/types/blocks/pricingTable";
import type { PricingTableRowStyles } from "@/types/document";
import _ from "lodash";
import { memo, useState } from "react";

type CellProps = {
  rowData: ProductRow;
  tableId: string;
  columnData: PricingTableColumn;
  columnListData:
    | PricingTableColumn[]
    | TaxPricingTableColumn[]
    | TotalPricingTableColumn[];
  styles: PricingTableRowStyles;
  hideEditor: boolean;
  focused: boolean;
  editing: boolean;
};

const CustomTableCell = ({
  rowData,
  columnData,
  columnListData,
  styles,
  hideEditor,
  focused,
  editing,
}: CellProps) => {
  const [currentValue, setCurrentValue] = useState<string | undefined>("");
  if (hideEditor || !focused || !editing) {
    return <></>;
  }
  const cell = rowData.cells.find(
    (cell) => cell.columnID === columnData.id,
  ) as CustomCell;
  return (
    <input
      className="rounded-md border-none bg-neutral-200 p-2"
      type="text"
      value={currentValue ?? cell?.value} // Ensure value is treated as a string
      onChange={(e) => setCurrentValue(e.target.value)} // Directly pass string value
    />
  );
};

const isCellEqual = (prevProps: CellProps, nextProps: CellProps) => {
  // Check for equality on all props except 'page'
  if (!_.isEqual(prevProps.styles, nextProps.styles)) return false;
  if (prevProps.focused !== nextProps.focused) return false;
  if (prevProps.hideEditor !== nextProps.hideEditor) return false;
  if (prevProps.editing !== nextProps.editing) return false;
  return _.isEqual(prevProps.rowData, nextProps.rowData);
};

export const CustomTableCellMemoized = memo(CustomTableCell, isCellEqual);
