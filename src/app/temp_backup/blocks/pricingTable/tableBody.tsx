"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEditor } from "@/providers/stores/editor.provider";
import type { HeaderRow, PricingTableData } from "@/types/blocks/pricingTable";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { TableProductRowRowMemoized } from "./rows/pricingRow";
import { TableSectionFooterRowMemoized } from "./rows/sectionFooter";
import { TableSectionHeaderRowMemoized } from "./rows/sectionHeader";
import { TableHeaderMemoized } from "./rows/tableHeader";

const TableColumnAddDropdown = ({
  hasDescription,
  hasRecuringMultiplier,
  hasTotals,
  hasTermTotals,
  blockId,
}: {
  hasDescription: boolean;
  hasRecuringMultiplier: boolean;
  hasTotals: boolean;
  hasTermTotals: boolean;
  blockId: string;
}) => {
  const editorStore = useEditor();
  const addColumn = editorStore(useShallow((state) => state.addColumn));

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="">
          <div className="shadow ml-0 h-fit w-fit rounded-sm border bg-white px-[0.5px] py-[2px] hover:bg-neutral-100">
            <FontAwesomeIcon
              icon={faPlus}
              size={"sm"}
              className={"z-10 text-zinc-700"}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="-mr-2 w-fit" side="left">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Add Custom Column</DropdownMenuLabel>
            {!hasDescription && (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  addColumn({
                    blockId: blockId,
                    columnType: "description",
                  });
                }}
              >
                <span className="">Description</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                addColumn({
                  blockId: blockId,
                  columnType: "custom",
                });
              }}
            >
              <span className="">Text</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                addColumn({
                  blockId: blockId,
                  columnType: "additionalMultiplier",
                });
              }}
            >
              <span className="">Additional Multiplier</span>
            </DropdownMenuItem>
            {!hasRecuringMultiplier && (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  addColumn({
                    blockId: blockId,
                    columnType: "recuringMultiplier",
                  });
                }}
              >
                <span className="">Recuring Multiplier</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                addColumn({
                  blockId: blockId,
                  columnType: "tax",
                });
              }}
            >
              <span className="">Tax</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                addColumn({
                  blockId: blockId,
                  columnType: "discount",
                });
              }}
            >
              <span className="">Discount</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                addColumn({
                  blockId: blockId,
                  columnType: "fee",
                });
              }}
            >
              <span className="">Fee</span>
            </DropdownMenuItem>
            {!hasTermTotals && (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  addColumn({
                    blockId: blockId,
                    columnType: "termTotal",
                  });
                }}
              >
                <span className="">Min Term Total</span>
              </DropdownMenuItem>
            )}
            {!hasTotals && (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  addColumn({
                    blockId: blockId,
                    columnType: "total",
                  });
                }}
              >
                <span className="">Total</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Add Product Fields</DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer">
              <span className="">Product field 1</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const TableBody = ({
  pricingData,
  editingRow,
  setEditingRow,
}: {
  pricingData: PricingTableData;
  editingRow: string | undefined;
  setEditingRow: Dispatch<SetStateAction<string | undefined>>;
}) => {
  const editorStore = useEditor();
  const addCustomRow = editorStore(useShallow((state) => state.addCustomRow));
  const hideEditor = editorStore((state) => state.hideEditor);
  const userID = editorStore(useShallow((state) => state.userID));

  const hasDescription = useMemo(() => {
    return pricingData.data.table.columns.some(
      (column) => column.type === "description",
    );
  }, [pricingData.data.table.columns]);

  const hasRecuringMultiplier = useMemo(() => {
    return pricingData.data.table.columns.some(
      (column) => column.type === "recuringMultiplier",
    );
  }, [pricingData.data.table.columns]);

  const hasTotals = useMemo(() => {
    return pricingData.data.table.columns.some(
      (column) => column.type === "total",
    );
  }, [pricingData.data.table.columns]);

  const hasTermTotals = useMemo(() => {
    return pricingData.data.table.columns.some(
      (column) => column.type === "termTotal",
    );
  }, [pricingData.data.table.columns]);

  return (
    <table className="group/table relative w-full">
      <thead>
        <TableHeaderMemoized
          columns={pricingData.data.table.columns}
          styles={pricingData.style.tableHeader}
          tableId={pricingData.id}
          hideEditor={hideEditor}
          showHeaders={pricingData?.settings?.showTableHeader ?? true}
          focused={pricingData.focused === userID}
        />
      </thead>
      <tbody>
        {pricingData.data.table.rows.map((row, rowIndex) => {
          const hiddenHeaderShowTopBorder =
            rowIndex === 0
              ? pricingData?.settings?.showTableHeader === false
              : false;

          switch (row.type) {
            case "row":
              // filter rows in reverse order from the current rowIndex and stop at the first header or footer. if it is a footer return undefined

              const sectionHeader = pricingData.data.table.rows
                .slice(0, rowIndex)
                .reverse()
                .find(
                  (row, index) =>
                    index < rowIndex &&
                    (row.type === "header" || row.type === "footer"),
                ) as HeaderRow;
              return (
                <TableProductRowRowMemoized
                  key={rowIndex}
                  rowData={row}
                  sectionHeader={
                    sectionHeader?.type === "header" ? sectionHeader : undefined
                  }
                  rowIndex={rowIndex}
                  tableId={pricingData.id}
                  columnData={pricingData.data.table.columns}
                  numberOfDecimals={pricingData?.settings?.numberOfDecimals}
                  currency={pricingData?.settings?.currency}
                  styles={row?.styles ?? pricingData.style.tableRow}
                  hideEditor={hideEditor}
                  hideHeader={hiddenHeaderShowTopBorder}
                  focused={pricingData.focused === userID}
                  editing={editingRow === row.id}
                  setEditing={setEditingRow}
                />
              );
            case "header":
              return (
                <TableSectionHeaderRowMemoized
                  key={rowIndex}
                  rowData={row}
                  rowIndex={rowIndex}
                  tableId={pricingData.id}
                  columnListData={pricingData.data.table.columns}
                  styles={row?.styles ?? pricingData.style.tableRow}
                  hideEditor={hideEditor}
                  hideHeader={hiddenHeaderShowTopBorder}
                  focused={pricingData.focused === userID}
                  editing={editingRow === row.id}
                  setEditing={setEditingRow}
                />
              );
            case "footer":
              return (
                <TableSectionFooterRowMemoized
                  key={rowIndex}
                  rowData={row}
                  rowIndex={rowIndex}
                  tableId={pricingData.id}
                  columnListData={pricingData.data.table.columns}
                  styles={row?.styles ?? pricingData.style.tableRow}
                  hideEditor={hideEditor}
                  focused={pricingData.focused === userID}
                  editing={editingRow === row.id}
                  setEditing={setEditingRow}
                />
              );
            default:
              return <></>;
          }
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
      {pricingData.focused === userID && (
        <div className="absolute bottom-[2px] right-[-3px] top-[-1px] z-10 flex  w-[4px] items-center bg-green-600 bg-opacity-0 has-[:hover]:bg-opacity-50">
          <TableColumnAddDropdown
            blockId={pricingData?.id}
            hasDescription={hasDescription}
            hasRecuringMultiplier={hasRecuringMultiplier}
            hasTermTotals={hasTermTotals}
            hasTotals={hasTotals}
          />
        </div>
      )}
    </table>
  );
};

export default TableBody;
