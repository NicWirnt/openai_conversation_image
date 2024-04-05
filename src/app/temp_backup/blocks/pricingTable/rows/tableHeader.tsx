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
import type { PricingTableColumn } from "@/types/blocks/pricingTable";
import type { TableHeaderStyles } from "@/types/document";
import { faCaretDown, faGripDots } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { memo, useMemo, useState } from "react";
import AutosizeInput from "react-input-autosize";
import { useShallow } from "zustand/react/shallow";

const TableHeaderOptionsDropdown = ({
  columnData,
  tableId,
}: {
  columnData: PricingTableColumn;
  tableId: string;
}) => {
  const editorStore = useEditor();
  const addCustomRow = editorStore(useShallow((state) => state.addCustomRow));
  const toggleColumnHidden = editorStore(
    useShallow((state) => state.toggleColumnHidden),
  );
  const removeColumn = editorStore(useShallow((state) => state.removeColumn));

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="">
          <div className=" shadow hidden h-fit w-fit rounded-sm bg-neutral-100 px-[4px] hover:bg-neutral-200 group-hover/cell:block">
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
            <DropdownMenuItem className="cursor-pointer">
              <span className="">Insert product from catalog</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                addCustomRow({ isColumn: true, blockId: tableId });
              }}
            >
              <span className="">Insert row below</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Insert column to the right
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
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
                toggleColumnHidden({
                  blockId: tableId,
                  columnId: columnData.id,
                  hidden: !columnData.hidden,
                });
              }}
            >
              <span className="">
                {columnData.hidden ? "Show" : "Hide"} Column
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                removeColumn({ blockId: tableId, columnId: columnData.id });
              }}
            >
              <span className="">Remove Column</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

type TableColumnProps = {
  columns: PricingTableColumn[];
  styles: TableHeaderStyles;
  tableId: string;
  focused: boolean;
  hideEditor: boolean;
  showHeaders: boolean;
};

const TableHeader = ({
  columns,
  styles,
  tableId,
  focused,
  hideEditor,
  showHeaders,
}: TableColumnProps) => {
  const editorStore = useEditor();
  const renameColumn = editorStore(useShallow((state) => state.renameColumn));
  const [editingLabel, setEditingLabel] = useState<string | undefined>(
    undefined,
  );
  const [inputValue, setInputValue] = useState<string>("");
  const columnList = useMemo(() => {
    return columns.filter((column) => {
      if (focused) return true;
      if (column.hidden) return false;
      return true;
    });
  }, [columns, focused]);

  return (
    <tr className="sticky top-[10px] z-10">
      {columnList.map((column, index) => {
        if ((!focused || hideEditor) && !showHeaders) {
          return (
            <th
              key={index}
              className="hidden-cell"
              style={{
                width: column.width,
                opacity: 0,
              }}
            />
          );
        }
        return (
          <th
            key={index}
            className={cn(
              "group/cell relative",
              column.hidden ? "hidden-cell" : "",
            )}
            style={{
              color: styles.typography.color,
              backgroundColor: styles.background,
              fontSize: `${styles.typography.fontSize}px`,
              fontWeight: styles.typography.fontWeight,
              textAlign: column?.columnAlignment ?? styles.typography.alignment,
              width: column.width,
              paddingTop: styles.padding.top,
              paddingBottom: styles.padding.bottom,
              paddingLeft: styles.padding.left,
              paddingRight: styles.padding.right,
              borderTopWidth: styles.borders.outer.top,
              borderBottomWidth: styles.borders.bottom.width,
              borderTopStyle: styles.borders.outer.style,
              borderBottomStyle: styles.borders.bottom.style,
              borderTopColor: styles.borders.outer.color,
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
            }}
          >
            {focused && (
              <>
                <div className="absolute left-0 right-0 top-[-13px] hidden h-[10px] flex-col items-center group-hover/cell:flex">
                  <div className="shadow flex h-3 w-5 cursor-ew-resize items-center justify-center rounded-t	  border-y border-t bg-white px-[2px] hover:bg-neutral-100">
                    <FontAwesomeIcon
                      icon={faGripDots}
                      size={"sm"}
                      className={"z-10 cursor-ew-resize text-zinc-700	"}
                    />
                  </div>
                </div>
                <div className="absolute right-1 top-1">
                  <TableHeaderOptionsDropdown
                    columnData={column}
                    tableId={tableId}
                  />
                </div>
              </>
            )}
            {editingLabel === column.id ? (
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
                    e.target.value !== column.label &&
                    e.target.value.trim() !== ""
                  ) {
                    renameColumn({
                      blockId: tableId,
                      columnId: column.id,
                      value: e.target.value.trim(),
                    });
                  }
                  setInputValue("");
                  setEditingLabel(undefined);
                }}
              />
            ) : (
              <div
                className={`cursor-text`}
                onDoubleClick={() => {
                  setInputValue(column.label);
                  setEditingLabel(column.id);
                }}
              >
                {column.label}
              </div>
            )}
          </th>
        );
      })}
    </tr>
  );
};

const isHeaderEqual = (
  prevProps: TableColumnProps,
  nextProps: TableColumnProps,
) => {
  // Check for equality on all props except 'page'
  if (!_.isEqual(prevProps.styles, nextProps.styles)) return false;
  if (prevProps.focused !== nextProps.focused) return false;
  if (prevProps.hideEditor !== nextProps.hideEditor) return false;
  if (prevProps.showHeaders !== nextProps.showHeaders) return false;
  return _.isEqual(prevProps.columns, nextProps.columns);
};

export const TableHeaderMemoized = memo(TableHeader, isHeaderEqual);
