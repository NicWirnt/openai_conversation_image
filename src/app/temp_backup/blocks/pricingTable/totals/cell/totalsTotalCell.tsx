import type {
  CurrencyModel,
  PricingTableColumn,
  PricingTableTotals,
  ProductRow,
} from "@/types/blocks/pricingTable";
import type { PricingTableTotalRowStyles } from "@/types/document";
import { formatValue } from "react-currency-input-field";
import {
  calculateTotalForType,
  PricingTotalTypes,
} from "../../functions/calculatePricingTableTotalTable";

const TotalTotalCell = ({
  columnType,
  columns,
  rowList,
  totalsList,
  rowData,
  tableId,
  currency,
  numberOfDecimals,
}: {
  columnType: PricingTotalTypes;
  columns: PricingTableColumn[];
  rowList: ProductRow[];
  totalsList: PricingTableTotals[];
  rowData: PricingTableTotals;
  tableId: string;
  currency: CurrencyModel;
  numberOfDecimals?: number;
  styles: PricingTableTotalRowStyles;
}) => {
  const total = calculateTotalForType({
    type: columnType,
    columnList: columns,
    rowList: rowList,
    totalsList: totalsList,
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

export default TotalTotalCell;
