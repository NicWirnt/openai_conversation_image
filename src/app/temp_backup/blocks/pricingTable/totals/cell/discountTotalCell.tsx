import type {
  CurrencyModel,
  PricingTableTotals,
} from "@/types/blocks/pricingTable";
import type { PricingTableTotalRowStyles } from "@/types/document";
import { formatValue } from "react-currency-input-field";

const DiscountTotalCell = ({
  rowData,
  tableId,
  currency,
  numberOfDecimals,
}: {
  rowData: PricingTableTotals;
  tableId: string;
  currency: CurrencyModel;
  numberOfDecimals?: number;
  styles: PricingTableTotalRowStyles;
}) => {
  const total = 0; //evaluateRule(rule.expression, rowData);

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

export default DiscountTotalCell;
