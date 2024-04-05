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
import { setActiveEditor } from "@/providers/stores/editor/toolbar.stores";
import { useEditorClipboard } from "@/providers/stores/editorClipboard.provider";
import type { SpreadsheetBlockData } from "@/types/blocks/spreadsheet";
import {
  faAlignJustify,
  faClone,
  faCog,
  faColumns,
  faCopy,
  faLockOpen,
  faTrash,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { SpreadsheetComponent } from "@syncfusion/ej2-react-spreadsheet";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { shallow } from "zustand/shallow";
import FloatingToolbar from "../editorUIHelpers/floatingToolbar";
import BlockOutlineContainer from "./helpers/blockOutlineContainer";

import { Spreadsheet as KendoSpreadsheet } from "@progress/kendo-react-spreadsheet";
import "@progress/kendo-theme-default/dist/all.css";

const ToolbarOptions = ({
  isFloating,
  blockData,
  columnID,
  containerID,
  pageID,
}: {
  isFloating: boolean;
  blockData: SpreadsheetBlockData;
  columnID: string;
  containerID: string;
  pageID: string;
}) => {
  const addNewColumnToContainer = useEditor()(
    (state) => state.addNewColumnToContainer,
  );
  const setSideBarContext = useEditor()((state) => state.setSideBarContext);
  const deleteBlock = useEditor()((state) => state.deleteBlock);
  const copyBlock = useEditorClipboard()((state) => state.copyBlock);
  const cloneBlock = useEditor()((state) => state.cloneBlock);
  return (
    <>
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
          <p>Copy Spreadsheet</p>
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
          <p>Clone Spreadsheet</p>
        </TooltipContent>
      </Tooltip>
      <Separator
        orientation="vertical"
        className="mt-[2px] h-[20px] bg-neutral-400"
      />
      {!isFloating && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="flex cursor-pointer items-center px-2 hover:bg-neutral-600"
              onClick={() => {
                addNewColumnToContainer({
                  columnID: columnID,
                  containerID: containerID,
                  pageID: pageID,
                });
              }}
            >
              <FontAwesomeIcon
                icon={faColumns}
                size="xs"
                className={" text-white"}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add Column</p>
          </TooltipContent>
        </Tooltip>
      )}

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
                  type: "textBlock",
                  name: "Text Block",
                  icon: (
                    <FontAwesomeIcon
                      icon={faAlignJustify}
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
          <p>Spreadsheet Settings</p>
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
          <p>Lock Spreadsheet</p>
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
          <p>Delete Spreadsheet</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
};

interface BlockProps {
  id: string;
  isFloating: boolean;
  columnID: string;
  containerID: string;
  pageID: string;
  lastBlock: boolean;
  classNames?: string;
  styles?: any;
}

const SpreadsheetBlock = ({
  id,
  isFloating = false,
  columnID,
  containerID,
  pageID,
  lastBlock,
  classNames,
  styles,
}: BlockProps) => {
  // let spreadsheet!: SpreadsheetComponent;
  const editorStore = useEditor();
  const [blockData, setBlockData] = useState<SpreadsheetBlockData>(
    editorStore.getState().currentDocumentData.blocks[
      id
    ] as SpreadsheetBlockData,
  );
  const [hideEditor, setHideEditor] = useState<boolean>(false);
  const saveBlock = editorStore(useShallow((state) => state.saveBlock));
  const userID = editorStore(useShallow((state) => state.userID));
  const setBlockFocus = editorStore(useShallow((state) => state.setBlockFocus));

  // const hideEditor = useEditor()((state) => state.hideEditor);

  const activeListener = useRef<boolean>(false);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("rerendering spreadsheet block", id);
  });

  useEffect(() => {
    const unsub = editorStore.subscribe(
      (state) => state.currentDocumentData.blocks[id] as SpreadsheetBlockData,
      (block, prevBlock) => {
        if (block.updateDate !== prevBlock.updateDate) {
          setBlockData(block);
        }
      },
      {
        equalityFn: shallow,
        fireImmediately: true,
      },
    );
    return unsub;
  }, []);

  if (!blockData) return <></>;

  const handleClickOutside = (event: any) => {
    event.stopPropagation();
    const toolbar = event.target.closest("#toolbar-container");
    const toolbarDrop = event.target.closest(".text-container-drop");
    const htmlTargeted = event.target === document.documentElement;
    if (!componentRef.current) return;
    const mainBlock = componentRef.current.closest(".q-block");
    if (toolbar || toolbarDrop || htmlTargeted) {
      return;
    }
    if (mainBlock) {
      const widgetOutlineContainer = mainBlock.querySelector(
        ".widget-outline-container",
      );
      if (
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        widgetOutlineContainer?.contains(event.target) ||
        mainBlock.contains(event.target)
      )
        return;
    }
    console.log("blur");
    activeListener.current = false;
    document.removeEventListener("mousedown", handleClickOutside);
    setActiveEditor({
      editorID: undefined,
      editor: undefined,
    });
    setBlockFocus({
      blockID: blockData.id,
      focus: false,
    });

    saveBlock({
      blockID: blockData.id,
      data: { data: "" },
    });
  };

  if (hideEditor) {
    return (
      <div
        id={`${blockData.id}`}
        className={cn(`q-block p-3`, lastBlock && "last-block")}
        dangerouslySetInnerHTML={{ __html: blockData?.data ?? "" }}
      />
    );
  }

  return (
    <FloatingToolbar
      containerName={"Text Block"}
      id={`${blockData.id}`}
      classNames={cn(
        `q-block relative`,
        blockData?.focused !== userID && "group",
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
      blockType="spreadsheetBlock"
      containerID={containerID}
      pageID={pageID}
    >
      {/* <SpreadsheetComponent
        openUrl="https://services.syncfusion.com/react/production/api/spreadsheet/open"
        saveUrl="https://services.syncfusion.com/react/production/api/spreadsheet/save"
        ref={(Obj) => {
          spreadsheet = Obj as any;
        }}
      ></SpreadsheetComponent> */}
      <KendoSpreadsheet
        style={{
          width: "100%",
          height: 700,
        }}
        defaultProps={{
          sheets: [],
        }}
      />
      <BlockOutlineContainer
        blockRef={componentRef}
        pageID={pageID}
        containerID={containerID}
        columnID={columnID}
        blockID={blockData.id}
        focused={blockData?.focused === userID}
        isFloating={isFloating}
      />
    </FloatingToolbar>
  );
};
export default SpreadsheetBlock;
