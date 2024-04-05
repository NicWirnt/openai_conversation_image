"use client";

import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useEditor } from "@/providers/stores/editor.provider";
import {
  MainSideBarType,
  SideBarType,
} from "@/providers/stores/editor/properties";
import { useEditorClipboard } from "@/providers/stores/editorClipboard.provider";
import type { PricingTableData } from "@/types/blocks/pricingTable";
import {
  faClone,
  faCog,
  faCopy,
  faFont,
  faHeading,
  faLockOpen,
  faPlus,
  faTags,
  faTrash,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { shallow } from "zustand/shallow";
import FloatingToolbar from "../../editorUIHelpers/floatingToolbar";
import BlockOutlineContainer from "../helpers/blockOutlineContainer";
import TableBody from "./tableBody";
import TotalsTable from "./totalsTable";

const ToolbarOptions = ({
  isFloating,
  blockData,
  columnID,
  containerID,
  pageID,
}: {
  isFloating: boolean;
  blockData: PricingTableData;
  columnID: string;
  containerID: string;
  pageID: string;
}) => {
  const editorStore = useEditor();
  const setSideBarContext = editorStore(
    useShallow((state) => state.setSideBarContext),
  );
  const deleteBlock = editorStore(useShallow((state) => state.deleteBlock));
  const cloneBlock = editorStore(useShallow((state) => state.cloneBlock));
  const copyBlock = useEditorClipboard()(
    useShallow((state) => state.copyBlock),
  );

  const addCustomRow = editorStore(useShallow((state) => state.addCustomRow));

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="flex cursor-pointer items-center px-2 hover:bg-neutral-600"
            onClick={() => {
              addCustomRow({
                blockId: blockData.id,
              });
            }}
          >
            <FontAwesomeIcon
              icon={faPlus}
              size="xs"
              className={" text-white"}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add Custom Row</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex cursor-pointer items-center px-2 hover:bg-neutral-600">
            <FontAwesomeIcon
              icon={faHeading}
              size="xs"
              className={" text-white"}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add Group Header</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex cursor-pointer items-center px-2 hover:bg-neutral-600">
            <FontAwesomeIcon
              icon={faFont}
              size="xs"
              className={" text-white"}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add Footer</p>
        </TooltipContent>
      </Tooltip>
      <Separator
        orientation="vertical"
        className="mt-[2px] h-[20px] bg-neutral-400"
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="flex cursor-pointer items-center px-2 hover:bg-neutral-600"
            onClick={() => {
              copyBlock({
                blockData: blockData,
              });
            }}
          >
            <FontAwesomeIcon
              icon={faCopy}
              size="xs"
              className={" text-white"}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy Pricing Table</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="flex cursor-pointer items-center px-2 hover:bg-neutral-600"
            onClick={() => {
              cloneBlock({
                blockID: blockData.id,
                containerID: containerID,
                pageID: pageID,
              });
            }}
          >
            <FontAwesomeIcon
              icon={faClone}
              size="xs"
              className={" text-white"}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Clone Pricing Table</p>
        </TooltipContent>
      </Tooltip>
      <Separator
        orientation="vertical"
        className="mt-[2px] h-[20px] bg-neutral-400"
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="flex cursor-pointer items-center px-2 hover:bg-neutral-600"
            onClick={() => {
              setSideBarContext({
                mainType: MainSideBarType.widget,
                id: blockData.id,
                type: SideBarType.contentBlock,
                open: true,
                block: {
                  id: blockData.id,
                  pageID: pageID,
                  containerID: containerID,
                  columnID: columnID,
                  type: "pricingTable",
                  name: "Pricing Table",
                  icon: (
                    <FontAwesomeIcon
                      icon={faTags}
                      className={" text-neutral-500"}
                    />
                  ),
                },
              });
            }}
          >
            <FontAwesomeIcon icon={faCog} size="xs" className={" text-white"} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Pricing Table Settings</p>
        </TooltipContent>
      </Tooltip>
      <Separator
        orientation="vertical"
        className="mt-[2px] h-[20px] bg-neutral-400"
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="flex cursor-pointer items-center px-2 hover:bg-neutral-600"
            //   onClick={() => setPreview(!preview)}
          >
            <FontAwesomeIcon
              icon={faLockOpen}
              size="xs"
              className={" text-white"}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Lock Pricing Table</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="group/deleteButton cursor-pointer rounded px-2 hover:bg-red-200"
            onClick={() => {
              deleteBlock({
                blockID: blockData.id,
                containerID: containerID,
                pageID: pageID,
              });
            }}
          >
            <FontAwesomeIcon
              icon={faTrash}
              size="xs"
              className={" text-white group-hover/deleteButton:text-red-600"}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete Pricing Table</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
};

const PricingTableBody = ({
  pricingData,
}: {
  pricingData: PricingTableData;
}) => {
  const editorStore = useEditor();
  const setBlockFocus = editorStore(useShallow((state) => state.setBlockFocus));
  const userID = editorStore(useShallow((state) => state.userID));
  const [editingRow, setEditingRow] = useState<string | undefined>(undefined);
  const PricingTable = useRef<HTMLDivElement>(null);

  useEffect(() => {
    //Put a click listener here to trigger when clicking outside this block
    const handleClick = (e: MouseEvent) => {
      if (PricingTable?.current?.contains(e.target as Node)) {
        return;
      }
      //if clicking on the <html> element return
      if (e.target === document.documentElement) {
        return;
      }
      // If clicking within a dropdown return
      const pricingTableDropdowns = document.querySelectorAll(
        ".pricing-table-dropdown",
      );
      if (pricingTableDropdowns?.length > 0) {
        for (const dropdown of pricingTableDropdowns) {
          if (dropdown.contains(e.target as Node)) {
            return;
          }
        }
      }

      setTimeout(() => {
        setEditingRow(undefined);
        setBlockFocus({
          blockID: pricingData.id,
          focus: false,
        });
      }, 100);
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [PricingTable?.current]);

  return (
    <div
      ref={PricingTable}
      className="h-full w-full"
      id={`pricing_table_block_${pricingData.id}`}
      onClick={() => {
        if (pricingData.focused !== userID) {
          setBlockFocus({
            blockID: pricingData.id,
            focus: true,
          });
        }
      }}
    >
      <TableBody
        pricingData={pricingData}
        editingRow={editingRow}
        setEditingRow={setEditingRow}
      />
      {(pricingData.settings?.showTableTotals ?? true) && (
        <TotalsTable
          pricingData={pricingData}
          editingRow={editingRow}
          setEditingRow={setEditingRow}
        />
      )}
    </div>
  );
};

type Props = {
  id: string;
  columnID: string;
  containerID: string;
  isFloating?: boolean;
  pageID: string;
  lastBlock: boolean;
  classNames?: string;
  styles?: any;
};

const PricingTable = ({
  id,
  columnID,
  containerID,
  isFloating = false,
  pageID,
  lastBlock,
  classNames,
  styles,
}: Props) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [hideEditor, setHideEditor] = useState(false);
  const editorStore = useEditor();
  const userID = editorStore(useShallow((state) => state.userID));
  const [hovering, setHovering] = useState(false);

  const [blockData, setBlockData] = useState<PricingTableData>(
    editorStore.getState().currentDocumentData.blocks[id] as PricingTableData,
  );

  useEffect(() => {
    const unsub = editorStore.subscribe(
      (state) => state.hideEditor,
      (value, prevValue) => {
        if (value !== prevValue) {
          setHideEditor(value);
        }
      },
      {
        equalityFn: shallow,
        fireImmediately: true,
      },
    );
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = editorStore.subscribe(
      (state) => state.currentDocumentData.blocks[id] as PricingTableData,
      (block, prevBlock) => {
        if (block?.updateDate !== prevBlock?.updateDate) {
          console.log("Pricing Table Data Updating");
          setBlockData(block);
        } else if (block?.focused !== prevBlock?.focused) {
          console.log("Pricing Table focus Updating");
          setBlockData(block);
        }
        //  else if (block?.hovered !== prevBlock?.hovered) {
        //   console.log('Pricing Table hover Updating');
        //   setHovering(block?.hovered === userID);
        // }
      },
      {
        equalityFn: shallow,
        fireImmediately: true,
      },
    );
    return unsub;
  }, []);

  if (!blockData) return <></>;

  if (hideEditor) {
    return <PricingTableBody pricingData={blockData} />;
  }

  return (
    <FloatingToolbar
      containerName={"Pricing Table"}
      id={`${blockData.id}`}
      classNames={cn(
        `q-block relative`,
        hovering && "group",
        lastBlock && "last-block",
      )}
      toolbar={
        <ToolbarOptions
          isFloating={isFloating}
          blockData={blockData}
          columnID={columnID}
          containerID={containerID}
          pageID={pageID}
        />
      }
      blockType="pricingTable"
      containerID={containerID}
      pageID={pageID}
    >
      <PricingTableBody pricingData={blockData} />
      <BlockOutlineContainer
        blockRef={componentRef}
        pageID={pageID}
        containerID={containerID}
        columnID={columnID}
        blockID={blockData.id}
        focused={hovering}
        hovered={hovering}
        isFloating={isFloating}
      />
    </FloatingToolbar>
  );
};

export default PricingTable;
