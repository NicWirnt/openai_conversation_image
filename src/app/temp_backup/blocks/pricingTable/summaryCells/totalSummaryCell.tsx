"use client";

import {
  PricingTableColumn,
  TaxPricingTableColumn,
  TotalPricingTableColumn,
} from "@/types/blocks/pricingTable";
import { PricingTableRowStyles } from "@/types/document";
import _ from "lodash";
import { memo } from "react";
import { formatValue } from "react-currency-input-field";

type CellProps = {
  //rowData: ProductRow;
  tableId: string;
  columnData: TotalPricingTableColumn;
  columnListData:
    | PricingTableColumn[]
    | TaxPricingTableColumn[]
    | TotalPricingTableColumn[];
  styles: PricingTableRowStyles;
  hideEditor: boolean;
  focused: boolean;
  editing: boolean;
};

const TotalTableSummaryCell = ({
  //rowData,
  columnData,
  columnListData,
  styles,
  hideEditor,
  focused,
  editing,
}: CellProps) => {
  const rule = columnData.rule;
  const total = 0; //evaluateRule(rule.expression, rowData);

  return (
    <div className="text-center">
      {formatValue({
        value: `${total ?? 0.0}`,
        groupSeparator: ",",
        decimalSeparator: ".",
        prefix: "$",
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
  return _.isEqual(prevProps.editing, nextProps.editing);
};

export const TotalTableSummaryCellMemoized = memo(
  TotalTableSummaryCell,
  isCellEqual,
);
