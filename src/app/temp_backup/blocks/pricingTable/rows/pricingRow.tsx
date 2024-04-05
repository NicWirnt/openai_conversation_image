"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useEditor } from "@/providers/stores/editor.provider";
import {
  CurrencyModel,
  DescriptionCell,
  HeaderRow,
  PricingTableColumn,
  ProductRow,
} from "@/types/blocks/pricingTable";
import { PricingTableRowStyles } from "@/types/document";
import {
  faCaretDown,
  faCheck,
  faGripDotsVertical,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import {
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useShallow } from "zustand/react/shallow";
import { AdditionalMultiplierTableCellMemoized } from "../cells/additionalMultiplierCell";
import { CostTableCellMemoized } from "../cells/costCell";
import { CustomTableCellMemoized } from "../cells/customCell";
import { DescriptionTableCellMemoized } from "../cells/descriptionCell";
import { DiscountTableCellMemoized } from "../cells/discountCell";
import { FeeTableCellMemoized } from "../cells/feeCell";
import { TaxTableCellMemoized } from "../cells/taxCell";
import { TermTotalTableCellMemoized } from "../cells/termTotalCell";
import { TimeBasedMultiplierTableCellMemoized } from "../cells/timeBasedMultiplierCell";
import { TotalTableCellMemoized } from "../cells/totalCell";
import { DescriptionRowMemoized } from "./descriptionRow";

const TableRowOptionsDropdown = ({
  rowData,
  hasDescription,
  hasRecuringMultiplier,
  hasTotals,
  hasTermTotals,
  sectionHeader,
  columnId,
  tableId,
}: {
  rowData: ProductRow;
  hasDescription: boolean;
  hasRecuringMultiplier: boolean;
  hasTotals: boolean;
  hasTermTotals: boolean;
  sectionHeader?: HeaderRow;
  columnId: string;
  tableId: string;
}) => {
  const editorStore = useEditor();
  const addCustomRow = editorStore(useShallow((state) => state.addCustomRow));
  const addHeaderRow = editorStore(useShallow((state) => state.addHeaderRow));
  const addFooterRow = editorStore(useShallow((state) => state.addFooterRow));
  const removeRow = editorStore(useShallow((state) => state.removeRow));
  const addColumn = editorStore(useShallow((state) => state.addColumn));
  const toggleRowOptional = editorStore(
    useShallow((state) => state.toggleRowOptional),
  );
  const toggleOneOffRow = editorStore(
    useShallow((state) => state.toggleOneOffRow),
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className=""
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <div className="shadow hidden h-fit w-fit rounded-sm bg-neutral-100 px-[4px] hover:block hover:bg-neutral-200 group-hover/cell:block">
            <FontAwesomeIcon
              icon={faCaretDown}
              size={"sm"}
              className={"z-10 text-zinc-700"}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="pricing-table-dropdown mr-3 w-fit"
          side="left"
        >
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Row Options</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="pricing-table-dropdown">
                  {hasRecuringMultiplier && (
                    <>
                      <DropdownMenuItem
                        className="group/rowOption flex cursor-pointer items-center gap-2"
                        onClick={() => {
                          toggleOneOffRow({
                            blockId: tableId,
                            rowId: rowData.id,
                            enabled: !rowData.oneOffRow,
                          });
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={cn(
                            "text-neutral-500",
                            rowData?.oneOffRow
                              ? "opacity-100"
                              : "opacity-0 group-hover/rowOption:opacity-20",
                          )}
                        />
                        <span>One-off Row</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  {!sectionHeader?.enableSelection && (
                    <DropdownMenuItem
                      className="group/rowOption flex cursor-pointer items-center gap-2"
                      onClick={() => {
                        toggleRowOptional({
                          blockId: tableId,
                          rowId: rowData.id,
                          enabled: !rowData.enableSelection,
                        });
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={cn(
                          "text-neutral-500",
                          rowData?.enableSelection
                            ? "opacity-100"
                            : "opacity-0 group-hover/rowOption:opacity-20",
                        )}
                      />
                      <span>Enable Optional Row</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="group/rowOption flex cursor-pointer items-center gap-2"
                    onClick={() => {
                      // activeEditor.chain().focus().setLineHeight('1').run();
                      // updateEditorFocus();
                      // resetFocus();
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={cn(
                        "text-neutral-500",
                        rowData?.allowQtyEditing
                          ? "opacity-100"
                          : "opacity-0 group-hover/rowOption:opacity-20",
                      )}
                    />
                    <span>Enable Quality Editing</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <span className="">Edit Row Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
              <span className="">Insert product from catalog</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                addCustomRow({ rowId: rowData.id, blockId: tableId });
              }}
            >
              <span className="">Insert row below</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                addHeaderRow({ rowId: rowData.id, blockId: tableId });
              }}
            >
              <span className="">Insert header above</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                addFooterRow({ rowId: rowData.id, blockId: tableId });
              }}
            >
              <span className="">Insert footer below</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Insert column to the right
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Add Custom Column</DropdownMenuLabel>
                    {!hasDescription && (
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => {
                          addColumn({
                            columnId: columnId,
                            blockId: tableId,
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
                          columnId: columnId,
                          blockId: tableId,
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
                          blockId: tableId,
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
                            columnId: columnId,
                            blockId: tableId,
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
                          columnId: columnId,
                          blockId: tableId,
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
                          columnId: columnId,
                          blockId: tableId,
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
                          columnId: columnId,
                          blockId: tableId,
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
                            columnId: columnId,
                            blockId: tableId,
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
                            columnId: columnId,
                            blockId: tableId,
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
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                removeRow({ rowId: rowData.id, blockId: tableId });
              }}
            >
              <span className="">Delete Row</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

type TableRowProps = {
  rowData: ProductRow;
  sectionHeader: HeaderRow | undefined;
  rowIndex: number;
  tableId: string;
  columnData: PricingTableColumn[];
  currency: CurrencyModel;
  numberOfDecimals?: number;
  styles: PricingTableRowStyles;
  hideEditor: boolean;
  hideHeader: boolean;
  focused: boolean;
  editing: boolean;
  setEditing: Dispatch<SetStateAction<string | undefined>>;
};

const TableProductRow = ({
  tableId,
  rowData,
  rowIndex,
  sectionHeader,
  columnData,
  currency,
  numberOfDecimals,
  styles,
  hideEditor,
  hideHeader,
  focused,
  editing,
  setEditing,
}: TableRowProps) => {
  const [forceShowDescription, setForceShowDescription] =
    useState<boolean>(false);
  const descriptionColumn = columnData?.find(
    (col) => col.type === "description",
  );
  const descriptionRow = rowData?.cells?.find(
    (row) => row.columnID === descriptionColumn?.id,
  ) as DescriptionCell;
  const descriptionString = (descriptionRow?.description ?? "")?.trim() ?? "";

  const hasDescription = useMemo(() => {
    return columnData.some((column) => column.type === "description");
  }, [columnData.length]);

  const hasRecuringMultiplier = useMemo(() => {
    return columnData.some((column) => column.type === "recuringMultiplier");
  }, [columnData.length]);

  const hasTotals = useMemo(() => {
    return columnData.some((column) => column.type === "total");
  }, [columnData.length]);

  const hasTermTotals = useMemo(() => {
    return columnData.some((column) => column.type === "termTotal");
  }, [columnData.length]);

  useEffect(() => {
    if (forceShowDescription) {
      // Focus on description input if forceShowDescription is true with a delay of 100ms
      setTimeout(() => {
        const descriptionInput = document.getElementById("description-input");
        if (descriptionInput) {
          descriptionInput.focus();
        }
      }, 100);
    }
  }, [forceShowDescription]);

  useEffect(() => {
    if (!editing) {
      setForceShowDescription(false);
    }
  }, [editing]);

  const columnList = useCallback(() => {
    return columnData.filter((column) => {
      if (focused) return true;
      if (column.hidden) return false;
      return true;
    });
  }, [columnData, focused, editing])();

  if (!focused && !editing && sectionHeader?.groupOption === "summarised") {
    return <></>;
  }

  return (
    <>
      <tr className="group/row relative" key={rowData?.id}>
        {columnList.map((column, index) => {
          const cell = rowData.cells.find(
            (cell) => cell.columnID === column.id,
          );

          return (
            <td
              key={`${column.id}_cell_${index}`}
              className={cn(
                "group/cell relative",
                sectionHeader?.groupOption === "summarised"
                  ? "hidden-cell"
                  : "",
                column.hidden ? "hidden-cell" : "",
                editing ? "!bg-blue-100 !bg-opacity-30" : "",
              )}
              style={{
                color: styles.typography.color,
                backgroundColor: styles.background,
                fontSize: `${styles.typography.fontSize}px`,
                fontWeight: styles.typography.fontWeight,
                textAlign:
                  column?.columnAlignment ?? styles.typography.alignment,
                paddingTop: styles.padding.top,
                paddingBottom: styles.padding.bottom,
                paddingLeft: styles.padding.left,
                paddingRight: styles.padding.right,
                borderBottomWidth: styles.borders.bottom.width,
                borderBottomStyle: styles.borders.bottom.style,
                borderBottomColor: styles.borders.bottom.color,

                ...(index === 0 && {
                  borderLeftWidth: styles.borders.outer.left,
                  borderLeftColor: styles.borders.outer.color,
                  borderLeftStyle: styles.borders.outer.style,
                }),

                ...(index === columnList.length - 1 && {
                  borderRightWidth: styles.borders.outer.right,
                  borderRightColor: styles.borders.outer.color,
                  borderRightStyle: styles.borders.outer.style,
                }),

                ...(index !== 0 && {
                  borderLeftWidth: styles.borders.dividers.width,
                  borderLeftColor: styles.borders.dividers.color,
                  borderLeftStyle: styles.borders.dividers.style,
                }),
                ...(hideHeader && {
                  borderTopWidth: styles.borders.bottom.width,
                  borderTopStyle: styles.borders.bottom.style,
                  borderTopColor: styles.borders.bottom.color,
                }),
              }}
              onClick={() => setEditing(rowData?.id)}
            >
              {index === 0 && focused && (
                <div className="absolute left-[-10px] top-0 hidden h-full w-[10px] items-center  group-hover/row:flex">
                  <div className="shadow h-fit w-fit cursor-ns-resize rounded-l border-y border-l bg-white px-[1px] py-[2px] hover:bg-neutral-100">
                    <FontAwesomeIcon
                      icon={faGripDotsVertical}
                      size={"sm"}
                      className={"z-10 cursor-ns-resize text-zinc-700	"}
                    />
                  </div>
                </div>
              )}
              {focused && (
                <div className="absolute right-1 top-1">
                  <TableRowOptionsDropdown
                    rowData={rowData}
                    tableId={tableId}
                    columnId={column.id}
                    hasDescription={hasDescription}
                    hasRecuringMultiplier={hasRecuringMultiplier}
                    hasTotals={hasTotals}
                    hasTermTotals={hasTermTotals}
                    sectionHeader={sectionHeader}
                  />
                </div>
              )}
              {column.type === "description" && (
                <DescriptionTableCellMemoized
                  rowData={rowData}
                  columnData={column}
                  columnListData={columnData}
                  sectionHeader={sectionHeader}
                  styles={styles}
                  hideEditor={hideEditor}
                  focused={focused}
                  editing={editing}
                  tableId={tableId}
                  forceShowDescription={
                    forceShowDescription || descriptionString?.length > 0
                  }
                  setForceShowDescription={setForceShowDescription}
                />
              )}
              {column.type === "fee" && (
                <FeeTableCellMemoized
                  rowData={rowData}
                  columnData={column}
                  columnListData={columnData}
                  numberOfDecimals={numberOfDecimals}
                  currency={currency}
                  styles={styles}
                  hideEditor={hideEditor}
                  focused={focused}
                  editing={editing}
                  tableId={tableId}
                />
              )}
              {column.type === "additionalMultiplier" && (
                <AdditionalMultiplierTableCellMemoized
                  rowData={rowData}
                  columnData={column}
                  columnListData={columnData}
                  styles={styles}
                  hideEditor={hideEditor}
                  focused={focused}
                  editing={editing}
                  tableId={tableId}
                />
              )}
              {column.type === "recuringMultiplier" && (
                <TimeBasedMultiplierTableCellMemoized
                  rowData={rowData}
                  columnData={column}
                  columnListData={columnData}
                  styles={styles}
                  hideEditor={hideEditor}
                  focused={focused}
                  editing={editing}
                  tableId={tableId}
                />
              )}
              {column.type === "tax" && (
                <TaxTableCellMemoized
                  rowData={rowData}
                  columnData={column}
                  columnListData={columnData}
                  numberOfDecimals={numberOfDecimals}
                  currency={currency}
                  styles={styles}
                  hideEditor={hideEditor}
                  focused={focused}
                  editing={editing}
                  tableId={tableId}
                />
              )}
              {column.type === "discount" && (
                <DiscountTableCellMemoized
                  rowData={rowData}
                  columnData={column}
                  columnListData={columnData}
                  numberOfDecimals={numberOfDecimals}
                  currency={currency}
                  styles={styles}
                  hideEditor={hideEditor}
                  focused={focused}
                  editing={editing}
                  tableId={tableId}
                />
              )}
              {column.type === "cost" && (
                <CostTableCellMemoized
                  rowData={rowData}
                  columnData={column}
                  columnListData={columnData}
                  numberOfDecimals={numberOfDecimals}
                  currency={currency}
                  styles={styles}
                  hideEditor={hideEditor}
                  focused={focused}
                  editing={editing}
                  tableId={tableId}
                />
              )}
              {column.type === "custom" && (
                <CustomTableCellMemoized
                  rowData={rowData}
                  columnData={column}
                  columnListData={columnData}
                  styles={styles}
                  hideEditor={hideEditor}
                  focused={focused}
                  editing={editing}
                  tableId={tableId}
                />
              )}
              {column.type === "total" && (
                <TotalTableCellMemoized
                  rowData={rowData}
                  columnData={column}
                  columnListData={columnData}
                  numberOfDecimals={numberOfDecimals}
                  currency={currency}
                  styles={styles}
                  hideEditor={hideEditor}
                  focused={focused}
                  editing={editing}
                  tableId={tableId}
                />
              )}
              {column.type === "termTotal" && (
                <TermTotalTableCellMemoized
                  rowData={rowData}
                  columnData={column}
                  columnListData={columnData}
                  numberOfDecimals={numberOfDecimals}
                  currency={currency}
                  styles={styles}
                  hideEditor={hideEditor}
                  focused={focused}
                  editing={editing}
                  tableId={tableId}
                />
              )}
            </td>
          );
        })}
      </tr>
      <DescriptionRowMemoized
        tableId={tableId}
        rowData={rowData}
        columnListData={columnData}
        styles={styles}
        hideEditor={hideEditor}
        focused={focused}
        editing={editing}
        setEditing={setEditing}
        forceShowDescription={forceShowDescription}
        setForceShowDescription={setForceShowDescription}
      />
    </>
  );
};

const isRowEqual = (prevProps: TableRowProps, nextProps: TableRowProps) => {
  // Check for equality on all props except 'page'
  if (!_.isEqual(prevProps.styles, nextProps.styles)) return false;
  if (prevProps.numberOfDecimals !== nextProps.numberOfDecimals) return false;
  if (prevProps.currency !== nextProps.currency) return false;
  if (prevProps.focused !== nextProps.focused) return false;
  if (prevProps.hideEditor !== nextProps.hideEditor) return false;
  if (prevProps.hideHeader !== nextProps.hideHeader) return false;
  if (prevProps.editing !== nextProps.editing) return false;
  if (!_.isEqual(prevProps.columnData, nextProps.columnData)) return false;
  if (!_.isEqual(prevProps.sectionHeader, nextProps.sectionHeader))
    return false;
  return _.isEqual(prevProps.rowData, nextProps.rowData);
};

export const TableProductRowRowMemoized = memo(TableProductRow, isRowEqual);
