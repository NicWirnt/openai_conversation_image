import { cn } from "@/lib/utils";
import { useEditor } from "@/providers/stores/editor.provider";
import { useState } from "react";

const DragTargets = ({
  target,
  hovered,
  pageID,
  blockID,
  containerID,
  columnID,
}: {
  target: "top" | "bottom" | "left" | "right";
  hovered: boolean;
  pageID: string;
  blockID?: string;
  containerID: string;
  columnID: string;
}) => {
  // I need to have a blue bar on the top, bottom, left, and right of the block
  return (
    <div
      className={cn(
        "drop-receivers relative hidden h-full w-full group-hover/block:block",
      )}
      data-pageid={pageID}
      data-blockid={blockID}
      data-containerid={containerID}
      data-columnid={columnID}
    >
      <div
        className={cn(
          "absolute -top-2 left-0 h-1 w-full rounded-full bg-blue-300",
          target === "top" ? "opacity-100" : "opacity-40",
          target === "top" ? "active-receiver" : "",
        )}
        data-position="top"
      ></div>
      <div
        className={cn(
          "absolute -bottom-2 left-0 h-1 w-full rounded-full bg-blue-300",
          target === "bottom" ? "opacity-100" : "opacity-40",
          target === "bottom" ? "active-receiver" : "",
        )}
        data-position="bottom"
      ></div>
      <div
        className={cn(
          "absolute -left-2 top-0 h-full w-1 rounded-full bg-blue-300",
          target === "left" ? "opacity-100" : "opacity-40",
          target === "left" ? "active-receiver" : "",
        )}
        data-position="left"
      ></div>
      <div
        className={cn(
          "absolute -right-2 top-0 h-full w-1 rounded-full bg-blue-300",
          target === "right" ? "opacity-100" : "opacity-40",
          target === "right" ? "active-receiver" : "",
        )}
        data-position="right"
      ></div>
    </div>
  );
};

const BlockOutlineContainer = ({
  focused,
  hovered,
  blockRef,
  isFloating,
  pageID,
  blockID,
  containerID,
  columnID,
}: {
  focused?: boolean;
  hovered?: boolean;
  blockRef: any;
  isFloating: boolean;
  pageID: string;
  blockID?: string;
  containerID: string;
  columnID: string;
}) => {
  const editorStore = useEditor();
  const dragBlock = editorStore((state) => state.dragBlock);
  const [target, setTarget] = useState<"top" | "bottom" | "left" | "right">(
    "bottom",
  ); // This state could be lifted up if needed

  const handleMouseMove = (e: any) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left; // Cursor position relative to the container's left edge
    const y = e.clientY - top; // Cursor position relative to the container's top edge

    // Determine the closest side
    const distances = {
      top: y,
      bottom: height - y,
      left: x,
      right: width - x,
    };

    const closestSide = Object.keys(distances).reduce((a, b) =>
      (distances as any)[a] < (distances as any)[b] ? a : b,
    ) as "top" | "bottom" | "left" | "right";
    setTarget(closestSide);
  };

  return (
    <div
      ref={blockRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "widget-outline-container",
        focused
          ? "block border !border-blue-300 !opacity-100"
          : "group-hover/block:block group-hover/block:opacity-40",
        !dragBlock && "disabled-container",
      )}
    >
      {!isFloating && dragBlock && (
        <DragTargets
          target={target}
          hovered={dragBlock !== undefined}
          pageID={pageID}
          blockID={blockID}
          containerID={containerID}
          columnID={columnID}
        />
      )}
    </div>
  );
};

export default BlockOutlineContainer;
