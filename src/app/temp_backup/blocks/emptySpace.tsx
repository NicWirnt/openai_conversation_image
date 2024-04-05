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
import { EmptySpaceBlockData } from "@/types/blocks/emptySpace";
import {
  faClone,
  faCog,
  faColumns,
  faCopy,
  faExpandWide,
  faLockOpen,
  faPlus,
  faTrash,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { shallow } from "zustand/shallow";
import { containerBlockOptions } from ".";
import FloatingToolbar from "../editorUIHelpers/floatingToolbar";
import BlockDropdown from "../editorUIHelpers/newBlock/blockDropdown";
import BlockOutlineContainer from "./helpers/blockOutlineContainer";

const ToolbarOptions = ({
  isFloating,
  blockData,
  columnID,
  containerID,
  pageID,
  setIsOpen,
}: {
  isFloating: boolean;
  blockData: EmptySpaceBlockData;
  columnID: string;
  containerID: string;
  pageID: string;
  setIsOpen: (e: boolean) => void;
}) => {
  const editorStore = useEditor();
  const addNewColumnToContainer = editorStore(
    useShallow((state) => state.addNewColumnToContainer),
  );
  const setSideBarContext = editorStore(
    useShallow((state) => state.setSideBarContext),
  );
  const deleteBlock = editorStore(useShallow((state) => state.deleteBlock));
  const cloneBlock = editorStore(useShallow((state) => state.cloneBlock));
  const copyBlock = useEditorClipboard()(
    useShallow((state) => state.copyBlock),
  );

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
          <p>Copy Text Block</p>
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
          <p>Clone Empty Space Block</p>
        </TooltipContent>
      </Tooltip>
      <Separator
        orientation="vertical"
        className="mt-[2px] h-[20px] bg-neutral-400"
      />
      {!isFloating && !blockData?.fullWidth && (
        <BlockDropdown
          triggerClassNames="flex cursor-pointer items-center hover:bg-neutral-600"
          trigger={
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex cursor-pointer items-center px-2 hover:bg-neutral-600">
                  <FontAwesomeIcon
                    icon={faPlus}
                    size="xs"
                    className={" text-white"}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Insert block below</p>
              </TooltipContent>
            </Tooltip>
          }
          setIsOpen={setIsOpen}
          pageId={pageID}
          containerId={containerID}
          columnId={columnID}
          disableItinerary={true}
          blockOptions={containerBlockOptions}
          blockId={blockData.id}
        />
      )}
      {!isFloating && !blockData?.fullWidth && (
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
                  type: "emptySpaceBlock",
                  name: "Empty Space Block",
                  icon: (
                    <FontAwesomeIcon
                      icon={faExpandWide}
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
          <p>Empty Space Block Settings</p>
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
          <p>Lock Text Block</p>
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
          <p>Delete Empty Space Block</p>
        </TooltipContent>
      </Tooltip>
    </>
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

const EmptySpace = ({
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
  const [isOpen, setIsOpen] = useState(false);

  const [blockData, setBlockData] = useState<EmptySpaceBlockData>(
    editorStore.getState().currentDocumentData.blocks[
      id
    ] as EmptySpaceBlockData,
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
      (state) => state.currentDocumentData.blocks[id] as EmptySpaceBlockData,
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

  if (!blockData) return <>dd</>;

  if (hideEditor) {
    return (
      <div
        style={{
          height: `${blockData.height}px`,
        }}
      />
    );
  }

  return (
    <FloatingToolbar
      containerName={"Empty Space"}
      id={`${blockData.id}`}
      classNames={cn(
        `q-block relative`,
        blockData?.focused !== userID && "group/block",
        lastBlock && "last-block",
      )}
      dropdownOpen={isOpen}
      toolbar={
        <ToolbarOptions
          isFloating={isFloating}
          blockData={blockData}
          columnID={columnID}
          containerID={containerID}
          pageID={pageID}
          setIsOpen={setIsOpen}
        />
      }
      blockType="emptySpaceBlock"
      containerID={containerID}
      pageID={pageID}
    >
      <div
        style={{
          height: `${blockData.height}px`,
        }}
      />
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

export default EmptySpace;
