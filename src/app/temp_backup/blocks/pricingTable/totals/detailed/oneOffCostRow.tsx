import type { PricingTableData, ProductRow } from "@/types/blocks/pricingTable";
import { useMemo, useState } from "react";
import DiscountTotalCell from "../cell/discountTotalCell";
import PriceTotalCell from "../cell/priceTotalCell";
import TaxTotalCell from "../cell/taxTotalCell";
import TotalTotalCell from "../cell/totalsTotalCell";

const OneOffCostRow = ({
  pricingData,
  focused,
}: {
  pricingData: PricingTableData;
  focused: boolean;
}) => {
  const [editingLabel, setEditingLabel] = useState<string | undefined>(
    undefined,
  );
  const [inputValue, setInputValue] = useState<string>("");

  const columnList = useMemo(() => {
    return pricingData?.data?.totals.filter((totals) => {
      if (focused) return true;
      if (totals.hidden) return false;
      return true;
    });
  }, [pricingData?.data?.totals, focused]);

  return (
    <tr>
      <td
        className="text-right"
        style={{
          color: pricingData?.style?.totalHeader?.typography?.color,
          backgroundColor: pricingData?.style?.totalHeader?.background,
          fontSize: `${pricingData?.style?.totalHeader?.typography.fontSize}px`,
          fontWeight: pricingData?.style?.totalHeader?.typography.fontWeight,
          paddingTop: pricingData?.style?.totalHeader?.padding.top,
          paddingBottom: pricingData?.style?.totalHeader?.padding.bottom,
          paddingLeft: pricingData?.style?.totalHeader?.padding.left,
          paddingRight: pricingData?.style?.totalHeader?.padding.right,
          borderTopWidth: pricingData?.style?.totalHeader?.borders.outer.top,
          borderBottomWidth:
            pricingData?.style?.totalHeader?.borders.bottom.width,
          borderTopStyle: pricingData?.style?.totalHeader?.borders.outer.style,
          borderBottomStyle:
            pricingData?.style?.totalHeader?.borders.bottom.style,
          borderTopColor: pricingData?.style?.totalHeader?.borders.outer.color,
          borderBottomColor:
            pricingData?.style?.totalHeader?.borders.bottom.color,
          borderLeftWidth: pricingData?.style?.totalHeader?.borders.outer.left,
          borderLeftColor: pricingData?.style?.totalHeader?.borders.outer.color,
          borderLeftStyle: pricingData?.style?.totalHeader?.borders.outer.style,
        }}
      >
        One-off Costs
      </td>
      {pricingData?.data?.totals?.map((total, index) => {
        return (
          <td
            key={index}
            className="text-center"
            style={{
              color: pricingData?.style?.totalRow?.typography.color,
              backgroundColor: pricingData?.style?.totalRow?.background,
              fontSize: `${pricingData?.style?.totalRow?.typography.fontSize}px`,
              fontWeight: pricingData?.style?.totalRow?.typography.fontWeight,
              paddingTop: pricingData?.style?.totalRow?.padding.top,
              paddingBottom: pricingData?.style?.totalRow?.padding.bottom,
              paddingLeft: pricingData?.style?.totalRow?.padding.left,
              paddingRight: pricingData?.style?.totalRow?.padding.right,
              borderTopWidth: pricingData?.style?.totalRow?.borders.outer.top,
              borderBottomWidth:
                pricingData?.style?.totalRow?.borders.bottom.width,
              borderTopStyle: pricingData?.style?.totalRow?.borders.outer.style,
              borderBottomStyle:
                pricingData?.style?.totalRow?.borders.bottom.style,
              borderTopColor: pricingData?.style?.totalRow?.borders.outer.color,
              borderBottomColor:
                pricingData?.style?.totalRow?.borders.bottom.color,
              borderLeftWidth:
                pricingData?.style?.totalRow?.borders.dividers.width,
              borderLeftColor:
                pricingData?.style?.totalRow?.borders.dividers.color,
              borderLeftStyle:
                pricingData?.style?.totalRow?.borders.dividers.style,
              ...(index === pricingData?.data?.totals.length - 1 && {
                borderRightWidth:
                  pricingData?.style?.totalRow?.borders.outer.right,
                borderRightColor:
                  pricingData?.style?.totalRow?.borders.outer.color,
                borderRightStyle:
                  pricingData?.style?.totalRow?.borders.outer.style,
              }),
            }}
          >
            {/* {total.type === "fee" &&
              PriceTotalCell({
                columnType: "custom",
                columns: pricingData.data.table.columns,
                rowList: pricingData.data.table.rows,
                isEditable: true,
                rowData: total,
                tableId: pricingData.id,
                currency: pricingData.settings.currency,
                numberOfDecimals: pricingData.settings.numberOfDecimals,
                styles: pricingData.style?.totalRow,
                totalType: "oneOff",
              })} */}
            {total.type === "price" &&
              PriceTotalCell({
                columnType: "oneOffCost",
                columns: pricingData.data.table.columns,
                rowList: pricingData.data.table.rows.filter(
                  (row) => row.type === "row",
                ) as ProductRow[],
                totalsList: pricingData?.data?.totals,
                isEditable: false,
                rowData: total,
                tableId: pricingData.id,
                currency: pricingData.settings.currency,
                numberOfDecimals: pricingData.settings.numberOfDecimals,
                styles: pricingData.style?.totalRow,
              })}
            {total.type === "discount" &&
              DiscountTotalCell({
                rowData: total,
                tableId: pricingData.id,
                currency: pricingData.settings.currency,
                numberOfDecimals: pricingData.settings.numberOfDecimals,
                styles: pricingData.style?.totalRow,
              })}
            {total.type === "tax" &&
              TaxTotalCell({
                columnType: "oneOffTax",
                columns: pricingData.data.table.columns,
                rowList: pricingData.data.table.rows.filter(
                  (row) => row.type === "row",
                ) as ProductRow[],
                totalsList: pricingData?.data?.totals,
                isEditable: true,
                rowData: total,
                tableId: pricingData.id,
                currency: pricingData.settings.currency,
                numberOfDecimals: pricingData.settings.numberOfDecimals,
                styles: pricingData.style?.totalRow,
              })}
            {total.type === "total" &&
              TotalTotalCell({
                columnType: "oneOffTotal",
                columns: pricingData.data.table.columns,
                rowList: pricingData.data.table.rows.filter(
                  (row) => row.type === "row",
                ) as ProductRow[],
                totalsList: pricingData?.data?.totals,
                rowData: total,
                tableId: pricingData.id,
                currency: pricingData.settings.currency,
                numberOfDecimals: pricingData.settings.numberOfDecimals,
                styles: pricingData.style?.totalRow,
              })}
          </td>
        );
      })}
    </tr>
  );
};

export default OneOffCostRow;
