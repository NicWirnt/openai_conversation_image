import type { PricingTableData } from "@/types/blocks/pricingTable";
import { useMemo, useState } from "react";
import AutosizeInput from "react-input-autosize";

const DetailedTotalsHeaderRow = ({
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
      // style={{
      //   color: pricingData?.style?.totalHeader?.typography?.color,
      //   backgroundColor: pricingData?.style?.totalHeader?.background,
      //   fontSize: `${pricingData?.style?.totalHeader?.typography.fontSize}px`,
      //   paddingTop: pricingData?.style?.totalHeader?.padding.top,
      //   paddingBottom: pricingData?.style?.totalHeader?.padding.bottom,
      //   paddingLeft: pricingData?.style?.totalHeader?.padding.left,
      //   paddingRight: pricingData?.style?.totalHeader?.padding.right,
      //   borderTopWidth: pricingData?.style?.totalHeader?.borders.outer.top,
      //   borderBottomWidth:
      //     pricingData?.style?.totalHeader?.borders.bottom.width,
      //   borderTopStyle: pricingData?.style?.totalHeader?.borders.outer.style,
      //   borderBottomStyle:
      //     pricingData?.style?.totalHeader?.borders.bottom.style,
      //   borderTopColor: pricingData?.style?.totalHeader?.borders.outer.color,
      //   borderBottomColor:
      //     pricingData?.style?.totalHeader?.borders.bottom.color,
      //   borderLeftWidth: pricingData?.style?.totalHeader?.borders.outer.left,
      //   borderLeftColor: pricingData?.style?.totalHeader?.borders.outer.color,
      //   borderLeftStyle: pricingData?.style?.totalHeader?.borders.outer.style,
      // }}
      ></td>
      {columnList?.map((total, index) => {
        return (
          <td
            key={index}
            className="text-center"
            style={{
              color: pricingData?.style?.totalHeader?.typography.color,
              backgroundColor: pricingData?.style?.totalHeader?.background,
              fontSize: `${pricingData?.style?.totalHeader?.typography.fontSize}px`,
              fontWeight:
                pricingData?.style?.totalHeader?.typography.fontWeight,
              paddingTop: pricingData?.style?.totalHeader?.padding.top,
              paddingBottom: pricingData?.style?.totalHeader?.padding.bottom,
              paddingLeft: pricingData?.style?.totalHeader?.padding.left,
              paddingRight: pricingData?.style?.totalHeader?.padding.right,
              borderTopWidth:
                pricingData?.style?.totalHeader?.borders.outer.top,
              borderBottomWidth:
                pricingData?.style?.totalHeader?.borders.bottom.width,
              borderTopStyle:
                pricingData?.style?.totalHeader?.borders.outer.style,
              borderBottomStyle:
                pricingData?.style?.totalHeader?.borders.bottom.style,
              borderTopColor:
                pricingData?.style?.totalHeader?.borders.outer.color,
              borderBottomColor:
                pricingData?.style?.totalHeader?.borders.bottom.color,
              borderLeftWidth:
                pricingData?.style?.totalHeader?.borders.dividers.width,
              borderLeftColor:
                pricingData?.style?.totalHeader?.borders.dividers.color,
              borderLeftStyle:
                pricingData?.style?.totalHeader?.borders.dividers.style,
              ...(index === pricingData?.data?.totals.length - 1 && {
                borderRightWidth:
                  pricingData?.style?.totalHeader?.borders.outer.right,
                borderRightColor:
                  pricingData?.style?.totalHeader?.borders.outer.color,
                borderRightStyle:
                  pricingData?.style?.totalHeader?.borders.outer.style,
              }),
            }}
          >
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
        );
      })}
    </tr>
  );
};

export default DetailedTotalsHeaderRow;
