"use client";

import {
  CurrencyModel,
  PricingTableColumn,
  ProductRow,
  TaxPricingTableColumn,
  TotalPricingTableColumn,
} from "@/types/blocks/pricingTable";
import { PricingTableRowStyles } from "@/types/document";
import _ from "lodash";
import { memo } from "react";
import { formatValue } from "react-currency-input-field";
import { calculatePricingTotals } from "../functions/calculatePricingTotals";

type CellProps = {
  rowData: ProductRow;
  tableId: string;
  columnData: TotalPricingTableColumn;
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

const TotalTableCell = ({
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
  const rule = columnData.rule;
  // const total: number = evaluateRule(rule.expression, rowData);

  const total: number = calculatePricingTotals({
    columnList: columnListData,
    rowData,
    currentColumn: columnData,
    termTax: true,
  });

  return (
    <div className="text-center">
      {formatValue({
        value: `${total ?? 0.0}`,
        groupSeparator: ",",
        decimalSeparator: ".",
        decimalScale: numberOfDecimals ?? currency?.decimal_digits ?? 2,
        prefix: currency?.symbol_native ?? "$",
      })}
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

export const TotalTableCellMemoized = memo(TotalTableCell, isCellEqual);
