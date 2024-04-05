import { cn } from "@/lib/utils";
import { useEditor } from "@/providers/stores/editor.provider";
import type { PricingTableData, ProductRow } from "@/types/blocks/pricingTable";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import AutosizeInput from "react-input-autosize";
import { useShallow } from "zustand/react/shallow";
import DiscountTotalCell from "../cell/discountTotalCell";
import PriceTotalCell from "../cell/priceTotalCell";
import TaxTotalCell from "../cell/taxTotalCell";
import TotalTotalCell from "../cell/totalsTotalCell";

const SimplifiedTotalsTable = ({
  pricingData,
  focused,
}: {
  pricingData: PricingTableData;
  focused: boolean;
}) => {
  const editorStore = useEditor();
  const addCustomRow = editorStore(useShallow((state) => state.addCustomRow));
  const userID = editorStore(useShallow((state) => state.userID));

  const [editingLabel, setEditingLabel] = useState<string | undefined>(
    undefined,
  );
  const [inputValue, setInputValue] = useState<string>("");
  return (
    <table
      className={cn(
        "group/table relative mt-6 w-fit",
        pricingData?.style?.totalAlignment === "center" && "mx-auto",
        pricingData?.style?.totalAlignment === "right" && "ml-auto",
        pricingData?.style?.totalAlignment === "left" && "mr-auto",
      )}
    >
      <tbody>
        {pricingData?.data?.totals?.map((total, index) => {
          return (
            <tr key={index}>
              <td className="text-right">
                {editingLabel === total.id ? (
                  <AutosizeInput
                    name="pricing-table-title-input"
                    className="title-input ml-auto border-none bg-transparent p-0 focus:border-transparent focus:outline-none focus:ring-0"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.currentTarget.value)}
                    inputStyle={{
                      paddingLeft: "4px",
                      paddingRight: "4px",
                    }}
                    autoFocus
                    onBlur={(e) => {
                      if (
                        e.target.value !== total.label &&
                        e.target.value.trim() !== ""
                      ) {
                        // renameColumn({
                        //   blockId: tableId,
                        //   columnId: total.id,
                        //   value: e.target.value.trim(),
                        // });
                      }
                      setInputValue("");
                      setEditingLabel(undefined);
                    }}
                  />
                ) : (
                  <div
                    className={`cursor-text`}
                    onDoubleClick={() => {
                      setInputValue(total.label);
                      setEditingLabel(total.id);
                    }}
                  >
                    {total.label}
                  </div>
                )}
              </td>
              {/* {total.type === "fee" && (
                <td className="text-center">
                  {PriceTotalCell({

                    isEditable: true,
                    rowData: total,
                    tableId: pricingData.id,
                    currency: pricingData.settings.currency,
                    numberOfDecimals: pricingData.settings.numberOfDecimals,
                    styles: pricingData.style?.totalRow,
                  })}
                </td>
              )} */}
              {total.type === "price" && (
                <td className="text-center">
                  {PriceTotalCell({
                    columnType: "fullTermCost",
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
                </td>
              )}
              {total.type === "discount" && (
                <td className="text-center">
                  {DiscountTotalCell({
                    rowData: total,
                    tableId: pricingData.id,
                    currency: pricingData.settings.currency,
                    numberOfDecimals: pricingData.settings.numberOfDecimals,
                    styles: pricingData.style?.totalRow,
                  })}
                </td>
              )}
              {total.type === "tax" && (
                <td className="text-center">
                  {TaxTotalCell({
                    columnType: "fullTermTax",
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
                </td>
              )}
              {total.type === "total" && (
                <td className="text-center">
                  {TotalTotalCell({
                    columnType: "fullTermTotal",
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
              )}
            </tr>
          );
        })}
        <tr>
          <td colSpan={pricingData.data.table.columns.length}>
            {pricingData.focused === userID && (
              <div className="absolute bottom-0 left-0 right-0 z-10 flex h-[4px] w-full flex-col items-center bg-green-600 bg-opacity-0 has-[:hover]:bg-opacity-50">
                <div
                  className="item-center shadow mt-0 flex h-4 w-10 justify-center rounded-sm border bg-white hover:bg-neutral-100"
                  onClick={() => {
                    addCustomRow({
                      blockId: pricingData.id,
                    });
                  }}
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    size={"sm"}
                    className={"z-50 text-zinc-700"}
                  />
                </div>
              </div>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default SimplifiedTotalsTable;
