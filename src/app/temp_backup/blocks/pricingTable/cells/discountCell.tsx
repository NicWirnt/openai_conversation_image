"use client";

import {
  CurrencyModel,
  FeeCell,
  PricingTableColumn,
  ProductRow,
  TaxPricingTableColumn,
  TotalPricingTableColumn,
} from "@/types/blocks/pricingTable";
import { PricingTableRowStyles } from "@/types/document";
import _ from "lodash";
import { memo, useState } from "react";
import CurrencyInput, { formatValue } from "react-currency-input-field";

type CellProps = {
  rowData: ProductRow;
  tableId: string;
  columnData: PricingTableColumn;
  columnListData:
    | PricingTableColumn[]
    | TaxPricingTableColumn[]
    | TotalPricingTableColumn[];
  currency: CurrencyModel;
  numberOfDecimals?: number;
  styles: PricingTableRowStyles;
  hideEditor: boolean;
  focused: boolean;
  editing: boolean;
};

const DiscountTableCell = ({
  rowData,
  columnData,
  columnListData,
  currency,
  numberOfDecimals,
  styles,
  hideEditor,
  focused,
  editing,
}: CellProps) => {
  const [currentValue, setCurrentValue] = useState<number | undefined>(
    undefined,
  );
  const cell = rowData.cells.find(
    (cell) => cell.columnID === columnData.id,
  ) as FeeCell;

  if (hideEditor || !focused || !editing) {
    return (
      <div className="text-center">
        {formatValue({
          value: `${cell?.value ?? 0.0}`,
          groupSeparator: ",",
          decimalScale: numberOfDecimals ?? currency?.decimal_digits ?? 2,
          prefix: currency?.symbol_native ?? "$",
        })}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <CurrencyInput
        className="rounded-xs w-full border-none bg-neutral-100 px-2 py-0 [appearance:textfield] focus:outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        placeholder="0"
        defaultValue={0}
        decimalsLimit={numberOfDecimals ?? currency?.decimal_digits ?? 2}
        prefix={currency?.symbol_native ?? "$"}
        value={currentValue ?? cell?.value} // Ensure value is treated as a string
        onValueChange={(value, name, values) => {
          console.log(value, name, values);
          setCurrentValue(values?.float ?? 0);
        }}
        onBlur={() => {
          if (currentValue === undefined) return;
          // updateFeeCell({
          //   columnId: columnData.id,
          //   rowId: rowData.id,
          //   value: currentValue,
          //   blockId: tableId,
          // });
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
  if (!_.isEqual(prevProps.currency, nextProps.currency)) return false;
  if (prevProps.numberOfDecimals !== nextProps.numberOfDecimals) return false;
  return _.isEqual(prevProps.rowData, nextProps.rowData);
};

export const DiscountTableCellMemoized = memo(DiscountTableCell, isCellEqual);
