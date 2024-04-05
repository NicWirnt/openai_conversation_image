"use client";

import { useEditor } from "@/providers/stores/editor.provider";
import {
  CurrencyModel,
  PricingTableColumn,
  ProductRow,
  TaxCell,
  TaxPricingTableColumn,
  TotalPricingTableColumn,
} from "@/types/blocks/pricingTable";
import { PricingTableRowStyles } from "@/types/document";
import _ from "lodash";
import { memo, useState } from "react";
import CurrencyInput, { formatValue } from "react-currency-input-field";

import { useShallow } from "zustand/react/shallow";
import { calculatePricingTotals } from "../functions/calculatePricingTotals";

type CellProps = {
  rowData: ProductRow;
  tableId: string;
  columnData: TaxPricingTableColumn;
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

const TaxTableCell = ({
  tableId,
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
  const editorStore = useEditor();
  const updateTaxCell = editorStore(useShallow((state) => state.updateTaxCell));

  const cell = rowData.cells.find(
    (cell) => cell.columnID === columnData.id,
  ) as TaxCell;

  const [currentValue, setCurrentValue] = useState<string | undefined>(
    undefined,
  );
  // const rule = columnData.rule;
  const total: number = calculatePricingTotals({
    columnList: columnListData,
    rowData,
    currentColumn: columnData,
    termTax: columnData.isTermBased,
  });

  //evaluateRule(rule.expression, rowData);

  if (hideEditor || !focused || !editing) {
    return (
      <div className="text-center">
        {formatValue({
          value: `${total ?? 0.0}`,
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
        decimalsLimit={2}
        suffix="%" // Add percentage symbol
        value={currentValue ?? cell?.value} // Ensure value is treated as a string
        onValueChange={(value, name, values) => {
          console.log(value, name, values);
          setCurrentValue(value);
        }}
        onBlur={() => {
          if (currentValue === undefined) return;
          updateTaxCell({
            columnId: columnData.id,
            rowId: rowData.id,
            value: parseFloat(currentValue),
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
  if (!_.isEqual(prevProps.currency, nextProps.currency)) return false;
  if (prevProps.numberOfDecimals !== nextProps.numberOfDecimals) return false;
  return _.isEqual(prevProps.rowData, nextProps.rowData);
};

export const TaxTableCellMemoized = memo(TaxTableCell, isCellEqual);
