"use client";

import ImageBlock from "@/app/[lang]/(editorLayout)/editor/[key]/_components/blocks/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useEditor } from "@/providers/stores/editor.provider";
import { Container, ContainerColumn, DocumentPage } from "@/types/document";
import { faPlus, faTrash } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MutableRefObject, memo, useEffect, useRef, useState } from "react";
import { shallow } from "zustand/shallow";
import { containerBlockOptions } from ".";
import ContainerColumnResizer from "../editorUIHelpers/containerColumnResizer";
import FloatingToolbar from "../editorUIHelpers/floatingToolbar";
import BlockDropdown from "../editorUIHelpers/newBlock/blockDropdown";
import NewBlockColumnMarker from "../editorUIHelpers/newBlock/newBlockColumnMarker";
import ESign from "./eSign";
import EmptySpace from "./emptySpace";
import GalleryBlock from "./gallery";
import BlockOutlineContainer from "./helpers/blockOutlineContainer";
import Itinerary from "./itinerary";
import PricingTable from "./pricingTable";
import SpreadsheetBlock from "./spreadsheet";
import TextBlock from "./text";
import Weather from "./weather";

type Props = {
  classNames?: string;
  styles?: any;
  containerData: Container;
  page: DocumentPage;
};

const EmptyColumnContainerInner = ({
  column,
  containerID,
  index,
  page,
}: {
  column: ContainerColumn;
  containerID: string;
  index: number;
  page: DocumentPage;
}) => {
  const removeEmptyColumn = useEditor()((state) => state.removeEmptyColumn);
  const emptyContainerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FloatingToolbar
      key={index}
      containerName={"Empty Column"}
      allowMove={false}
      dropdownOpen={isOpen}
      toolbar={
        <>
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
            pageId={page.id}
            containerId={containerID}
            columnId={column.id}
            disableItinerary={true}
            blockOptions={containerBlockOptions}
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="group/deleteButton cursor-pointer rounded px-2 hover:bg-red-200"
                onClick={() => {
                  removeEmptyColumn({
                    columnID: column.id,
                    containerID: containerID,
                    pageID: page.id,
                  });
                }}
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  size="xs"
                  className={
                    " text-white group-hover/deleteButton:text-red-600"
                  }
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Empty Column</p>
            </TooltipContent>
          </Tooltip>
        </>
      }
      blockType="itineraryBlock"
      containerID={containerID}
      pageID={page.id}
    >
      <div
        className={`group/emptyContainer group relative w-full`}
        style={{
          minHeight: "30px",
        }}
      >
        <NewBlockColumnMarker
          pageID={page.id}
          containerID={containerID}
          columnID={column.id}
          classNames="group-hover/emptyContainer:flex hidden"
          mainClassNames="my-2 "
        />
        <BlockOutlineContainer
          blockRef={emptyContainerRef}
          pageID={page.id}
          containerID={containerID}
          columnID={column.id}
          focused={false}
          isFloating={false}
        />
      </div>
    </FloatingToolbar>
  );
};

const EmptyColumnContainer = ({
  column,
  columnRef,
  showResizer = false,
  spacing,
  containerID,
  index,
  page,
}: {
  column: ContainerColumn;
  columnRef: MutableRefObject<any>;
  showResizer?: boolean;
  spacing: number;
  containerID: string;
  index: number;
  page: DocumentPage;
}) => {
  return (
    <div
      className={cn(
        "q-container-c relative",
        column.blocks.length < 1 && "empty-column",
      )}
      ref={columnRef}
      style={{
        width: column?.style?.width ?? "100%",
      }}
    >
      {spacing > 0 ? (
        <div
          style={{ paddingLeft: `${spacing}px`, paddingRight: `${spacing}px` }}
        >
          <EmptyColumnContainerInner
            column={column}
            containerID={containerID}
            index={index}
            page={page}
          />
        </div>
      ) : (
        <EmptyColumnContainerInner
          column={column}
          containerID={containerID}
          index={index}
          page={page}
        />
      )}
      {showResizer && (
        <ContainerColumnResizer
          key={index}
          columnReference={columnRef}
          index={index}
          columnID={column.id}
          pageID={page.id}
          containerID={containerID}
        />
      )}
    </div>
  );
};

const ColumnSpacingController = ({
  spacing,
  firstColumn,
  lastColumn,
  lastBlockInColumn,
  children,
}: {
  spacing: number;
  firstColumn?: boolean;
  lastColumn?: boolean;
  lastBlockInColumn?: boolean;
  children: React.ReactNode;
}) => {
  if (spacing > 0) {
    return (
      <div
        className={cn("q-block-container", !lastBlockInColumn && "mb-6")}
        style={{
          paddingLeft: `${firstColumn ? 0 : spacing}px`,
          paddingRight: `${lastColumn ? 0 : spacing}px`,
        }}
      >
        {children}
      </div>
    );
  }
  return <>{children}</>;
};

const SetupContainerColumn = ({
  index,
  spacing,
  firstColumn,
  lastColumn,
  column,
  containerData,
  page,
}: {
  index: number;
  spacing: number;
  firstColumn?: boolean;
  lastColumn?: boolean;
  column: ContainerColumn;
  containerData: Container;
  page: DocumentPage;
}) => {
  const documentData = useEditor().getState()?.currentDocumentData;
  return (
    <>
      {column?.blocks?.map((blockID, bi) => {
        const blockType = blockID.split("_")[0];
        console.log(blockType)
        const lastBlockInColumn = column?.blocks?.length - 1 === bi;
        if (blockType === "pricingTable") {
          return (
            <ColumnSpacingController
              spacing={spacing}
              firstColumn={firstColumn}
              lastColumn={lastColumn}
              key={`block_container_${blockID}`}
              lastBlockInColumn={lastBlockInColumn}
            >
              <PricingTable
                key={`block_${blockID}`}
                id={blockID}
                pageID={page.id}
                containerID={containerData.id}
                isFloating={page?.type === "fixed"}
                columnID={column.id}
                lastBlock={lastBlockInColumn}
                styles={{
                  ...(page?.type === "fixed" && {
                    width: `${containerData?.position?.width ?? 500}px`,
                    height: `${containerData?.position?.height ?? 100}px`,
                  }),
                }}
              />
            </ColumnSpacingController>
          );
        }

        if (blockType === "textBlock") {
          return (
            <ColumnSpacingController
              spacing={spacing}
              firstColumn={firstColumn}
              lastColumn={lastColumn}
              key={`block_container_${blockID}`}
              lastBlockInColumn={lastBlockInColumn}
            >
              <TextBlock
                key={`block_${blockID}`}
                id={blockID}
                isFloating={page?.type === "fixed"}
                columnID={column.id}
                containerID={containerData.id}
                pageID={page.id}
                lastBlock={lastBlockInColumn}
                styles={{
                  ...(page?.type === "fixed" && {
                    width: `${containerData?.position?.width ?? 500}px`,
                    height: `${containerData?.position?.height ?? 100}px`,
                  }),
                }}
              />
            </ColumnSpacingController>
          );
        }
        if (blockType === "spreadsheetBlock") {
          return (
            <ColumnSpacingController
              spacing={spacing}
              firstColumn={firstColumn}
              lastColumn={lastColumn}
              key={`block_container_${blockID}`}
              lastBlockInColumn={lastBlockInColumn}
            >
              <SpreadsheetBlock
                key={`block_${blockID}`}
                id={blockID}
                isFloating={page?.type === "fixed"}
                columnID={column.id}
                containerID={containerData.id}
                pageID={page.id}
                lastBlock={lastBlockInColumn}
                styles={{
                  ...(page?.type === "fixed" && {
                    width: `${containerData?.position?.width ?? 500}px`,
                    height: `${containerData?.position?.height ?? 100}px`,
                  }),
                }}
              />
            </ColumnSpacingController>
          );
        }
        if (blockType === "emptySpaceBlock") {
          return (
            <ColumnSpacingController
              spacing={spacing}
              firstColumn={firstColumn}
              lastColumn={lastColumn}
              key={`block_container_${blockID}`}
              lastBlockInColumn={lastBlockInColumn}
            >
              <EmptySpace
                key={`block_${blockID}`}
                id={blockID}
                pageID={page.id}
                containerID={containerData.id}
                isFloating={page?.type === "fixed"}
                columnID={column.id}
                lastBlock={lastBlockInColumn}
                styles={{
                  ...(page?.type === "fixed" && {
                    width: `${containerData?.position?.width ?? 500}px`,
                    height: `${containerData?.position?.height ?? 100}px`,
                  }),
                }}
              />
            </ColumnSpacingController>
          );
        }
        if (blockType === "imageBlock") {
          return (
            <ColumnSpacingController
              spacing={spacing}
              firstColumn={firstColumn}
              lastColumn={lastColumn}
              key={`block_container_${blockID}`}
              lastBlockInColumn={lastBlockInColumn}
            >
              <ImageBlock
                key={bi}
                id={blockID}
                columnID={column.id}
                containerID={containerData.id}
                pageID={page.id}
                lastBlock={lastBlockInColumn}
                isFloating={page?.type === "fixed"}
                // styles={{
                //   ...(page?.type === "fixed" && {
                //     width: `${containerData?.position?.width ?? 500}px`,
                //     height: `${containerData?.position?.height ?? 100}px`,
                //   }),
                // }}
              />
            </ColumnSpacingController>
          );
        }
        if (blockType === "galleryBlock") {
          return (
            <ColumnSpacingController
              spacing={spacing}
              firstColumn={firstColumn}
              lastColumn={lastColumn}
              key={`block_container_${blockID}`}
              lastBlockInColumn={lastBlockInColumn}
            >
              <GalleryBlock
                key={bi}
                id={blockID}
                columnID={column.id}
                containerID={containerData.id}
                pageID={page.id}
                lastBlock={lastBlockInColumn}
                isFloating={page?.type === "fixed"}
              />
            </ColumnSpacingController>
          );
        }
        if (blockType === "itineraryBlock") {
          return (
            <ColumnSpacingController
              spacing={spacing}
              firstColumn={firstColumn}
              lastColumn={lastColumn}
              key={`block_container_${blockID}`}
              lastBlockInColumn={lastBlockInColumn}
            >
              <Itinerary
                key={`block_${blockID}`}
                blockId={blockID}
                isFloating={page?.type === "fixed"}
                edit={true}
                pageId={page.id}
                containerId={containerData.id}
                currentColIndex={index}
                columnId={column.id}
                lastBlock={lastBlockInColumn}
              />
            </ColumnSpacingController>
          );
        }
        if (blockType === "eSignBlock") {
          return (
            <ColumnSpacingController
              spacing={spacing}
              firstColumn={firstColumn}
              lastColumn={lastColumn}
              key={`block_container_${blockID}`}
              lastBlockInColumn={lastBlockInColumn}
            >
              <ESign
                key={`block_${blockID}`}
                id={blockID}
                pageID={page.id}
                containerID={containerData.id}
                isFloating={page?.type === "fixed"}
                columnID={column.id}
                lastBlock={lastBlockInColumn}
                styles={{
                  ...(page?.type === "fixed" && {
                    width: `${containerData?.position?.width ?? 500}px`,
                    height: `${containerData?.position?.height ?? 100}px`,
                  }),
                }}
              />
            </ColumnSpacingController>
          );
        }
        if (blockType === "weatherBlock") {
          return (
            <ColumnSpacingController
              spacing={spacing}
              firstColumn={firstColumn}
              lastColumn={lastColumn}
              key={`block_container_${blockID}`}
              lastBlockInColumn={lastBlockInColumn}
            >
              <Weather
                key={`block_${blockID}`}
                id={blockID}
                pageID={page.id}
                containerID={containerData.id}
                isFloating={page?.type === "fixed"}
                columnID={column.id}
                lastBlock={lastBlockInColumn}
                styles={{
                  ...(page?.type === "fixed" && {
                    width: `${containerData?.position?.width ?? 500}px`,
                    height: `${containerData?.position?.height ?? 100}px`,
                  }),
                }}
              />
            </ColumnSpacingController>
          );
        }
        return <></>;
      })}
    </>
    // </ColumnSpacingController>
  );
};

interface ColumnProps {
  index: number;
  columnlength: number;
  contentAlignment: "top" | "center" | "bottom";
  spacing: number;
  columnId: string;
  containerData: Container;
  page: DocumentPage;
}

const ContainerColumnBlock = ({
  index,
  contentAlignment,
  spacing,
  columnId,
  containerData,
  page,
}: ColumnProps) => {
  const columnRef = useRef<any>();
  const editorStore = useEditor();
  const [column, setColumn] = useState<ContainerColumn | undefined>(
    editorStore
      .getState()
      ?.currentDocumentData?.pages?.find((p) => p.id === page.id)
      ?.containers?.find((c) => c.id === containerData.id)
      ?.columns?.find((c) => c.id === columnId),
  );
  const [hideEditor, setHideEditor] = useState<boolean>(false);

  useEffect(() => {
    const unsub = editorStore.subscribe(
      (state) => state?.hideEditor,
      (state, prevState) => {
        if (state !== prevState) {
          setHideEditor(state);
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
      (state) =>
        state?.currentDocumentData?.pages
          ?.find((p) => p.id === page.id)
          ?.containers?.find((c) => c.id === containerData.id)
          ?.columns?.find((c) => c.id === columnId),
      (state, prevState) => {
        if (state?.updateDate !== prevState?.updateDate) {
          setColumn(state);
        }
      },
      {
        equalityFn: shallow,
        fireImmediately: true,
      },
    );
    return unsub;
  }, []);

  if (!column) return <></>;

  if (!column?.blocks || column?.blocks?.length === 0) {
    if (hideEditor) return <></>;
    return (
      <EmptyColumnContainer
        key={`empty_container_column_${column.id}_${index}`}
        column={column}
        columnRef={columnRef}
        spacing={spacing}
        showResizer={
          index < containerData.columns.length - 1 && columnRef !== undefined
        }
        containerID={containerData.id}
        index={index}
        page={page}
      />
    );
  }
  return (
    <div
      ref={columnRef}
      key={`container_column_${column.id}_${index}`}
      className={cn(`justify-${contentAlignment}`, `q-container-c relative`)}
      style={{
        width: column?.style?.width ?? "100%",
        ...(column?.style?.background?.style === "color" && {
          backgroundColor: column?.style?.background?.color ?? "transparent",
        }),
        justifyContent:
          contentAlignment === "center"
            ? "center"
            : contentAlignment === "bottom"
              ? "flex-end"
              : "flex-start",
        paddingTop: `${column?.style?.padding?.top ?? 0}px`,
        paddingLeft: `${column?.style?.padding?.left ?? 0}px`,
        paddingRight: `${column?.style?.padding?.right ?? 0}px`,
        paddingBottom: `${column?.style?.padding?.bottom ?? 0}px`,
        borderLeftWidth: `${column?.style?.border?.left ?? 0}px`,
        borderLeftStyle: column?.style?.border?.style ?? "solid",
        borderLeftColor: column?.style?.border?.color ?? "",
        borderRightWidth: `${column?.style?.border?.right ?? 0}px`,
        borderRightStyle: column?.style?.border?.style ?? "solid",
        borderRightColor: column?.style?.border?.color ?? "",
        borderTopWidth: `${column?.style?.border?.top ?? 0}px`,
        borderTopStyle: column?.style?.border?.style ?? "solid",
        borderTopColor: column?.style?.border?.color ?? "",
        borderBottomWidth: `${column?.style?.border?.bottom ?? 0}px`,
        borderBottomStyle: column?.style?.border?.style ?? "solid",
        borderBottomColor: column?.style?.border?.color ?? "",
      }}
    >
      <SetupContainerColumn
        index={index}
        firstColumn={index === 0}
        lastColumn={index === containerData.columns.length - 1}
        spacing={spacing}
        column={column}
        containerData={containerData}
        page={page}
      />
      {index < containerData.columns.length - 1 &&
        columnRef !== undefined &&
        !hideEditor && (
          <ContainerColumnResizer
            key={index}
            columnReference={columnRef}
            columnID={column.id}
            index={index}
            pageID={page.id}
            containerID={containerData.id}
          />
        )}
    </div>
  );
};

const isEqual = (prevProps: ColumnProps, nextProps: ColumnProps) => {
  // Check for equality on all props except 'page'
  if (prevProps.spacing !== nextProps.spacing) return false;
  if (prevProps.index !== nextProps.index) return false;
  if (prevProps.columnlength !== nextProps.columnlength) return false;
  return prevProps.contentAlignment !== nextProps.contentAlignment;
};

export const MemoizedContainerColumnBlock = memo(ContainerColumnBlock, isEqual);

// export default ContainerColumnBlock;
