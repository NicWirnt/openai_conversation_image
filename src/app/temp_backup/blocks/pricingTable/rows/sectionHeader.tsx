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
import { HeaderRow, PricingTableColumn } from "@/types/blocks/pricingTable";
import { PricingTableRowStyles } from "@/types/document";
import {
  faCaretDown,
  faCheck,
  faGripDotsVertical,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { Dispatch, SetStateAction, memo, useCallback, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { TaxTableSummaryCellMemoized } from "../summaryCells/taxSummaryCell";
import { TotalTableSummaryCellMemoized } from "../summaryCells/totalSummaryCell";

type TableRowProps = {
  rowData: HeaderRow;
  rowIndex: number;
  tableId: string;
  columnListData: PricingTableColumn[];
  styles: PricingTableRowStyles;
  hideEditor: boolean;
  hideHeader: boolean;
  focused: boolean;
  editing: boolean;
  setEditing: Dispatch<SetStateAction<string | undefined>>;
};

const TableRowOptionsDropdown = ({
  rowData,
  tableId,
}: {
  rowData: HeaderRow;
  tableId: string;
}) => {
  const editorStore = useEditor();
  const addCustomRow = editorStore(useShallow((state) => state.addCustomRow));
  const addHeaderRow = editorStore(useShallow((state) => state.addHeaderRow));
  const addFooterRow = editorStore(useShallow((state) => state.addFooterRow));
  const removeRow = editorStore(useShallow((state) => state.removeRow));
  const removeRowGroup = editorStore(
    useShallow((state) => state.removeRowGroup),
  );
  const toggleSectionOptional = editorStore(
    useShallow((state) => state.toggleSectionOptional),
  );
  const toggleSectionOptionalPositionType = editorStore(
    useShallow((state) => state.toggleSectionOptionalPositionType),
  );
  const setSectionGroupType = editorStore(
    useShallow((state) => state.setSectionGroupType),
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
              <DropdownMenuSubTrigger>
                Section Header Options
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="pricing-table-dropdown">
                  <DropdownMenuItem
                    className="group/rowOption flex cursor-pointer items-center gap-2"
                    onClick={() => {
                      setSectionGroupType({
                        blockId: tableId,
                        sectionRowId: rowData.id,
                        type: "subtotal",
                      });
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={cn(
                        "text-neutral-500",
                        rowData?.groupOption === "subtotal"
                          ? "opacity-100"
                          : "opacity-0 group-hover/rowOption:opacity-20",
                      )}
                    />
                    <span>Show Group Subtotal</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="group/rowOption flex cursor-pointer items-center gap-2"
                    onClick={() => {
                      setSectionGroupType({
                        blockId: tableId,
                        sectionRowId: rowData.id,
                        type: "summarised",
                      });
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={cn(
                        "text-neutral-500",
                        rowData?.groupOption === "summarised"
                          ? "opacity-100"
                          : "opacity-0 group-hover/rowOption:opacity-20",
                      )}
                    />
                    <span>Show Group Summarised</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <>
                    <DropdownMenuItem
                      className="group/rowOption flex cursor-pointer items-center gap-2"
                      onClick={() => {
                        toggleSectionOptional({
                          blockId: tableId,
                          enabled: !rowData?.enableSelection,
                          sectionRowId: rowData.id,
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
                      <span>Enable Group Optional Rows</span>
                    </DropdownMenuItem>
                    {rowData?.enableSelection && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup className="ml-1">
                          <DropdownMenuLabel>
                            Optional Row Options
                          </DropdownMenuLabel>

                          {rowData?.groupOption !== "summarised" && (
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="item-center flex gap-2">
                                <div className="flex-grow">
                                  Optional Position
                                </div>
                                <div className="">
                                  (
                                  {rowData?.selectionType === "multipleGroup" ||
                                  rowData?.selectionType === "singleGroup"
                                    ? "Section"
                                    : "Rows"}
                                  )
                                </div>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent className="pricing-table-dropdown">
                                  <DropdownMenuItem
                                    className="group/rowOption flex cursor-pointer items-center gap-2"
                                    onClick={() => {
                                      toggleSectionOptionalPositionType({
                                        blockId: tableId,
                                        sectionRowId: rowData.id,
                                        position: "row",
                                        type: rowData?.selectionType?.includes(
                                          "single",
                                        )
                                          ? "single"
                                          : "multiple",
                                      });
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={faCheck}
                                      className={cn(
                                        "text-neutral-500",
                                        rowData?.selectionType ===
                                          "multipleRow" ||
                                          rowData?.selectionType === "singleRow"
                                          ? "opacity-100"
                                          : "opacity-0 group-hover/rowOption:opacity-20",
                                      )}
                                    />
                                    <span>Individual Rows</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="group/rowOption flex cursor-pointer items-center gap-2"
                                    onClick={() => {
                                      toggleSectionOptionalPositionType({
                                        blockId: tableId,
                                        sectionRowId: rowData.id,
                                        position: "section",
                                        type: rowData?.selectionType?.includes(
                                          "single",
                                        )
                                          ? "single"
                                          : "multiple",
                                      });
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={faCheck}
                                      className={cn(
                                        "text-neutral-500",
                                        rowData?.selectionType ===
                                          "multipleGroup" ||
                                          rowData?.selectionType ===
                                            "singleGroup"
                                          ? "opacity-100"
                                          : "opacity-0 group-hover/rowOption:opacity-20",
                                      )}
                                    />
                                    <span>Group Section</span>
                                  </DropdownMenuItem>
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                          )}

                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="item-center flex gap-2">
                              <div className="flex-grow">Optional Type</div>
                              <div className="">
                                (
                                {rowData?.selectionType === "singleRow" ||
                                rowData?.selectionType === "singleGroup"
                                  ? "Single"
                                  : "Multiple"}
                                )
                              </div>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent className="pricing-table-dropdown">
                                <DropdownMenuItem
                                  className="group/rowOption flex cursor-pointer items-center gap-2"
                                  onClick={() => {
                                    toggleSectionOptionalPositionType({
                                      blockId: tableId,
                                      sectionRowId: rowData.id,
                                      position:
                                        rowData?.selectionType?.includes(
                                          "Group",
                                        )
                                          ? "section"
                                          : "row",
                                      type: "single",
                                    });
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faCheck}
                                    className={cn(
                                      "text-neutral-500",
                                      rowData?.selectionType === "singleRow" ||
                                        rowData?.selectionType === "singleGroup"
                                        ? "opacity-100"
                                        : "opacity-0 group-hover/rowOption:opacity-20",
                                    )}
                                  />
                                  <span>Single Choice</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="group/rowOption flex cursor-pointer items-center gap-2"
                                  onClick={() => {
                                    toggleSectionOptionalPositionType({
                                      blockId: tableId,
                                      sectionRowId: rowData.id,
                                      position:
                                        rowData?.selectionType?.includes(
                                          "Group",
                                        )
                                          ? "section"
                                          : "row",
                                      type: "multiple",
                                    });
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faCheck}
                                    className={cn(
                                      "text-neutral-500",
                                      rowData?.selectionType ===
                                        "multipleRow" ||
                                        rowData?.selectionType ===
                                          "multipleGroup"
                                        ? "opacity-100"
                                        : "opacity-0 group-hover/rowOption:opacity-20",
                                    )}
                                  />
                                  <span>Multiple Choice</span>
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuGroup>
                      </>
                    )}
                  </>
                  {/* <DropdownMenuItem
                    className="cursor-pointer flex items-center gap-2 group/rowOption"
                    onClick={() => {
                      // activeEditor.chain().focus().setLineHeight('1').run();
                      // updateEditorFocus();
                      // resetFocus();
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={cn(
                        'text-neutral-500',
                        rowData?.allowQtyEditing
                          ? 'opacity-100'
                          : 'opacity-0 group-hover/rowOption:opacity-20'
                      )}
                    />
                    <span>Enable Quality Editing</span>
                  </DropdownMenuItem> */}
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
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Insert column to the right
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="pricing-table-dropdown">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Add Custom Column</DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer">
                      <span className="">Text</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <span className="">Additional Multiplier</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <span className="">Recuring Multiplier</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <span className="">Tax</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <span className="">Discount</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <span className="">Fee</span>
                    </DropdownMenuItem>
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
              <span className="">Delete Heading</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                removeRowGroup({ rowId: rowData.id, blockId: tableId });
              }}
            >
              <span className="">Delete Group</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const TableSectionHeaderRow = ({
  tableId,
  rowData,
  columnListData,
  styles,
  hideEditor,
  hideHeader,
  focused,
  editing,
  setEditing,
}: TableRowProps) => {
  const editorStore = useEditor();
  const updateSectionHeaderLabel = editorStore(
    useShallow((state) => state.updateSectionHeaderLabel),
  );
  const [currentValue, setCurrentValue] = useState<string | undefined>(
    undefined,
  );

  const columnList = useCallback(() => {
    return {
      colspan: columnListData.filter((column) => {
        if (
          rowData?.groupOption !== "summarised" &&
          rowData?.groupOption !== "subtotal"
        ) {
          if (focused) return true;
          if (column.hidden) return false;
          return true;
        }
        if (focused) {
          if (column.type !== "tax" && column.type !== "total") return true;
          return false;
        }
        if (column.hidden) return false;
        if (column.type !== "tax" && column.type !== "total") return true;
        return false;
      }),
      totalCells: columnListData.filter((column) => {
        if (
          rowData?.groupOption !== "summarised" &&
          rowData?.groupOption !== "subtotal"
        ) {
          return false;
        }
        if (focused) {
          if (column.type === "tax" || column.type === "total") return true;
          return false;
        }
        if ((column.type !== "tax" && column.type !== "total") || column.hidden)
          return false;
        return true;
      }),
    };
  }, [columnListData, focused, editing])();

  return (
    <>
      <tr className="group/row relative" key={rowData?.id}>
        <td
          colSpan={columnList.colspan.length}
          className={cn(
            "group/cell relative",
            editing ? "!bg-blue-100 !bg-opacity-30" : "",
          )}
          style={{
            color: styles.typography.color,
            backgroundColor: styles.background,
            fontSize: `${styles.typography.fontSize}px`,
            fontWeight: styles.typography.fontWeight,
            textAlign: styles.typography.alignment,
            paddingTop: styles.padding.top,
            paddingBottom: styles.padding.bottom,
            paddingLeft: styles.padding.left,
            paddingRight: styles.padding.right,
            borderBottomWidth: styles.borders.bottom.width,
            borderBottomStyle: styles.borders.bottom.style,
            borderBottomColor: styles.borders.bottom.color,
            borderLeftWidth: styles.borders.outer.left,
            borderLeftColor: styles.borders.outer.color,
            borderLeftStyle: styles.borders.outer.style,
            ...(columnList.totalCells.length < 1 && {
              borderRightWidth: styles.borders.outer.right,
              borderRightColor: styles.borders.outer.color,
              borderRightStyle: styles.borders.outer.style,
            }),
            ...(hideHeader && {
              borderTopWidth: styles.borders.bottom.width,
              borderTopStyle: styles.borders.bottom.style,
              borderTopColor: styles.borders.bottom.color,
            }),
          }}
          onClick={() => setEditing(rowData?.id)}
        >
          {focused && (
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
              <TableRowOptionsDropdown rowData={rowData} tableId={tableId} />
            </div>
          )}
          {editing && focused ? (
            <div className="flex items-center gap-2">
              {rowData?.enableSelection &&
                rowData?.selectionType === "singleGroup" && (
                  <input
                    type="radio"
                    className="h-4 w-4 rounded-full border border-neutral-200"
                  />
                )}
              {rowData?.enableSelection &&
                rowData?.selectionType === "multipleGroup" && (
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded-sm border border-neutral-200"
                  />
                )}
              <input
                className="rounded-xs w-full border-none bg-neutral-100 px-2 py-0 focus:outline-none focus:ring-0"
                type="text"
                placeholder="Type Section Header here..."
                value={currentValue ?? rowData?.label} // Ensure value is treated as a string
                onChange={(e) => setCurrentValue(e.target.value)} // Directly pass string value
                onBlur={() => {
                  if (currentValue !== undefined) {
                    updateSectionHeaderLabel({
                      rowId: rowData.id,
                      value: currentValue,
                      blockId: tableId,
                    });
                    setCurrentValue(undefined);
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {rowData?.enableSelection &&
                rowData?.selectionType === "singleGroup" && (
                  <input
                    type="radio"
                    className="h-4 w-4 rounded-full border border-neutral-200"
                  />
                )}
              {rowData?.enableSelection &&
                rowData?.selectionType === "multipleGroup" && (
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded-sm border border-neutral-200"
                  />
                )}
              <div className="text-left">{rowData?.label ?? ""}</div>
            </div>
          )}
        </td>
        {columnList.totalCells.map((column, index) => {
          return (
            <td
              key={index}
              className={cn(
                "group/cell relative",
                column.hidden ? "hidden-cell" : "",
                editing ? "!bg-blue-100 !bg-opacity-30" : "",
              )}
              style={{
                color: styles.typography.color,
                backgroundColor: styles.background,
                fontSize: `${styles.typography.fontSize}px`,
                fontWeight: styles.typography.fontWeight,
                textAlign: styles.typography.alignment,
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
                ...(index === columnList.totalCells.length - 1 && {
                  borderRightWidth: styles.borders.outer.right,
                  borderRightColor: styles.borders.outer.color,
                  borderRightStyle: styles.borders.outer.style,
                }),
                ...(index !== 0 && {
                  borderLeftWidth: styles.borders.dividers.width,
                  borderLeftColor: styles.borders.dividers.color,
                  borderLeftStyle: styles.borders.dividers.style,
                }),
              }}
              onClick={() => setEditing(rowData?.id)}
            >
              {column.type === "tax" && (
                <TaxTableSummaryCellMemoized
                  columnData={column}
                  columnListData={[]}
                  styles={styles}
                  hideEditor={hideEditor}
                  focused={focused}
                  editing={editing}
                  tableId={tableId}
                />
              )}
              {column.type === "total" && (
                <TotalTableSummaryCellMemoized
                  columnData={column}
                  columnListData={[]}
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
    </>
  );
};

const isRowEqual = (prevProps: TableRowProps, nextProps: TableRowProps) => {
  // Check for equality on all props except 'page'
  if (!_.isEqual(prevProps.styles, nextProps.styles)) return false;
  if (prevProps.focused !== nextProps.focused) return false;
  if (prevProps.hideEditor !== nextProps.hideEditor) return false;
  if (prevProps.hideHeader !== nextProps.hideHeader) return false;
  if (prevProps.editing !== nextProps.editing) return false;
  return _.isEqual(prevProps.rowData, nextProps.rowData);
};

export const TableSectionHeaderRowMemoized = memo(
  TableSectionHeaderRow,
  isRowEqual,
);
