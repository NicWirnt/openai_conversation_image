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
import { ItineraryBlockData } from "@/types/blocks/itineary";
import {
  faClone,
  faCog,
  faCopy,
  faLockOpen,
  faPlaneDeparture,
  faTrash,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { shallow } from "zustand/shallow";
import FloatingToolbar from "../editorUIHelpers/floatingToolbar";
import BlockOutlineContainer from "./helpers/blockOutlineContainer";
import ItinerarySegment from "./itinerary/index";

const ToolbarOptions = ({
  isFloating,
  blockData,
  columnID,
  containerID,
  pageID,
}: {
  isFloating: boolean;
  blockData: ItineraryBlockData;
  columnID: string;
  containerID: string;
  pageID: string;
}) => {
  const setSideBarContext = useEditor()((state) => state.setSideBarContext);
  const deleteBlock = useEditor()((state) => state.deleteBlock);
  const hideBlock = useEditor()((state) => state.hideBlock);
  // const copyBlock = useEditorClipboard()((state) => state.copyBlock);
  const cloneBlock = useEditor()((state) => state.cloneBlock);
  const currentDocument = useEditor()(
    (state) => state.documentList[state.currentVersion]!,
  );
  return (
    <>
      {currentDocument.status !== "template" && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex cursor-pointer items-center px-2 hover:bg-neutral-600"
                onClick={() => {
                  // copyBlock({
                  //   blockData: blockData,
                  // });
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
              <p>Copy Itinerary Block</p>
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
              <p>Clone Itinerary Block</p>
            </TooltipContent>
          </Tooltip>
          <Separator
            orientation="vertical"
            className="mt-[2px] h-[20px] bg-neutral-400"
          />
        </>
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
                  type: "itineraryBlock",
                  name: "Itinerary Block",
                  icon: (
                    <FontAwesomeIcon
                      icon={faPlaneDeparture}
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
          <p>Itinerary Block Settings</p>
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
          <p>Lock Itinerary Block</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="group/deleteButton cursor-pointer rounded px-2 hover:bg-red-200"
            onClick={() => {
              if (blockData.data.type === "bookingDetails") {
                const remove =
                  Object.keys(currentDocument.blocks).filter((blockid) => {
                    return (
                      currentDocument.blocks[blockid].data?.parent ===
                      blockData.id
                    );
                  }).length === 0;
                remove
                  ? deleteBlock({
                      blockID: blockData.id,
                      containerID: containerID,
                      pageID: pageID,
                    })
                  : hideBlock({
                      blockID: blockData.id,
                      hidden: true,
                    });
              } else {
                const blockParent = blockData.data.parent;
                const deleteParent =
                  currentDocument.blocks[blockParent].hidden &&
                  Object.keys(currentDocument.blocks).filter((blockid) => {
                    return (
                      currentDocument.blocks[blockid].data?.parent ===
                        blockParent && blockid != blockData.id
                    );
                  }).length === 0;
                if (deleteParent) {
                  deleteBlock({
                    blockID: blockParent,
                    containerID: containerID,
                    pageID: pageID,
                  });
                }
                deleteBlock({
                  blockID: blockData.id,
                  containerID: containerID,
                  pageID: pageID,
                });
              }
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
          <p>Delete Itinerary Block</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
};
type Props = {
  classNames?: string;
  pageId: string;
  containerId: string;
  blockId: string;
  currentColIndex: number;
  edit: boolean;
  columnId: string;
  lastBlock: boolean;
  isFloating: boolean;
};

const widgetProperties = {
  width: "100%",
  type: "fixed",
};

const Itinerary = ({
  classNames,
  pageId,
  blockId,
  containerId,
  currentColIndex,
  edit,
  columnId,
  lastBlock,
  isFloating = false,
}: Props) => {
  const editorStore = useEditor();
  const userID = useEditor()(useShallow((state) => state.userID));
  const componentRef = useRef<HTMLDivElement>(null);

  const [blockData, setBlockData] = useState<ItineraryBlockData>(
    editorStore.getState().currentDocumentData.blocks[
      blockId
    ] as ItineraryBlockData,
  );
  const [hidden, setHidden] = useState<boolean>(
    editorStore.getState().currentDocumentData.blocks[blockId]?.hidden ?? false,
  );

  useEffect(() => {
    const unsub = editorStore.subscribe(
      (state) =>
        state.currentDocumentData.blocks[blockId] as ItineraryBlockData,
      (block, prevBlock) => {
        if (block?.updateDate !== prevBlock?.updateDate) {
          setBlockData(block);
        } else if (block?.focused !== prevBlock?.focused) {
          setBlockData(block);
        } else if (block?.hovered !== prevBlock?.hovered) {
          setBlockData(block);
        } else if (block?.hidden !== prevBlock?.hidden) {
          setHidden(block?.hidden ?? false);
        }
      },
      {
        equalityFn: shallow,
        fireImmediately: true,
      },
    );
    return unsub;
  }, []);

  if (!blockData || hidden) return <></>;

  return (
    <FloatingToolbar
      containerName={"Itinerary Block"}
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
          columnID={columnId}
          containerID={containerId}
          pageID={pageId}
        />
      }
      blockType="itineraryBlock"
      containerID={containerId}
      pageID={pageId}
    >
      <ItinerarySegment
        type={blockData.data.type}
        itineraryStyle={blockData.itiStyle}
        blockId={blockId}
        pageId={pageId}
        columnId={columnId}
        containerId={containerId}
        currentColIndex={currentColIndex}
        parent={blockData.data.parent}
        data={blockData.data.segmentData}
        edit={edit}
      ></ItinerarySegment>
      <BlockOutlineContainer
        blockRef={componentRef}
        pageID={pageId}
        containerID={containerId}
        columnID={columnId}
        blockID={blockData.id}
        focused={blockData?.focused === userID}
        isFloating={isFloating}
      />
    </FloatingToolbar>
  );
};

export default Itinerary;
