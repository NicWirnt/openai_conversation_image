"use client";

import { useEditor } from "@/providers/stores/editor.provider";
import {
  PricingTableColumn,
  ProductRow,
  RecuringMultiplierCell,
  TaxPricingTableColumn,
  TotalPricingTableColumn,
} from "@/types/blocks/pricingTable";
import { PricingTableRowStyles } from "@/types/document";
import _ from "lodash";
import { memo, useState } from "react";
import CurrencyInput, { formatValue } from "react-currency-input-field";

import { useShallow } from "zustand/react/shallow";

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

const TimeBasedMultiplierTableCell = ({
  tableId,
  rowData,
  columnData,
  columnListData,
  styles,
  hideEditor,
  focused,
  editing,
}: CellProps) => {
  const editorStore = useEditor();
  const updateTimeMultiplierCell = editorStore(
    useShallow((state) => state.updateTimeMultiplierCell),
  );

  const [currentValue, setCurrentValue] = useState<number | undefined>(
    undefined,
  );

  const cell = rowData.cells.find(
    (cell) => cell.columnID === columnData.id,
  ) as RecuringMultiplierCell;

  if (hideEditor || !focused || !editing) {
    return (
      <div className="text-center">
        {formatValue({
          value: `${cell?.value ?? 0.0}`,
          groupSeparator: ",",
          decimalSeparator: ".",
          suffix: " Month",
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <CurrencyInput
        className="rounded-xs w-full border-none bg-neutral-100 px-2 py-0 [appearance:textfield] focus:outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        placeholder="1"
        defaultValue={1}
        decimalsLimit={2}
        suffix=" Month"
        value={currentValue ?? cell?.value} // Ensure value is treated as a string
        onValueChange={(value, name, values) => {
          setCurrentValue(values?.float ?? 0);
        }}
        onBlur={() => {
          if (currentValue === undefined) return;
          updateTimeMultiplierCell({
            columnId: columnData.id,
            rowId: rowData.id,
            value: currentValue,
            blockId: tableId,
          });
          setCurrentValue(undefined);
        }}
      />
    </div>
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

export const TimeBasedMultiplierTableCellMemoized = memo(
  TimeBasedMultiplierTableCell,
  isCellEqual,
);
