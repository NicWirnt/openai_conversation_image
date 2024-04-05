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
import {
  setActiveEditor,
  updateEditorFocus,
} from "@/providers/stores/editor/toolbar.stores";
import { useEditorClipboard } from "@/providers/stores/editorClipboard.provider";
import { handler } from "@/server/actions/openai/streamAIGeneratedText";
import type { TextBlockData } from "@/types/blocks/text";
import {
  inter,
  lato,
  montserrat,
  noto_Sans,
  open_sans,
  oswald,
  playfair_Display,
  poppins,
  raleway,
  roboto,
  source_Sans_3,
} from "@/utils/fonts";
import { FontFamily } from "@/utils/tiptap/fontFamily";
import {
  faAlignJustify,
  faClone,
  faCog,
  faColumns,
  faCopy,
  faLockOpen,
  faPlus,
  faTrash,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Color from "@tiptap/extension-color";
import HighLight from "@tiptap/extension-highlight";
import Superscript from "@tiptap/extension-subscript";
import Subscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor as tipTapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Indent from "@weiruo/tiptap-extension-indent";
import { useChat } from "ai/react";
import { useEffect, useMemo, useRef, useState } from "react";
import reactElementToJSXString from "react-element-to-jsx-string";
import FontSize from "tiptap-extension-font-size";
import LineHeight from "tiptap-line-height";
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
  blockData: TextBlockData;
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
          <p>Clone Text Block</p>
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
          classNames="text-container-drop"
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
          <p>Text Block Settings</p>
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
          <p>Delete Text Block</p>
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

const TextBlock = ({
  id,
  isFloating = false,
  columnID,
  containerID,
  pageID,
  lastBlock,
  classNames,
  styles,
}: BlockProps) => {
  const editorStore = useEditor();
  const [blockData, setBlockData] = useState<TextBlockData>(
    editorStore.getState().currentDocumentData.blocks[id] as TextBlockData,
  );
  const triggeringAICall = useRef<boolean>(false);
  const [aiTextContent, setAITextContent] = useState<string | undefined>("");
  const [hideEditor, setHideEditor] = useState<boolean>(false);
  const saveBlock = editorStore(useShallow((state) => state.saveBlock));
  const userID = editorStore(useShallow((state) => state.userID));
  const setBlockFocus = editorStore(useShallow((state) => state.setBlockFocus));
  const [isOpen, setIsOpen] = useState(false);
  const removeTextBlockAIContentTrigger = editorStore(
    useShallow((state) => state.removeTextBlockAIContentTrigger),
  );

  // const hideEditor = useEditor()((state) => state.hideEditor);

  const activeListener = useRef<boolean>(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [prompt, setPrompt] = useState("");
  const { messages, input, reload, setInput, handleInputChange, handleSubmit } =
    useChat({
      api: handler,
      onFinish: (message) => {
        console.log("finished");
        debugger;
        setInput("");
        setPrompt("");
        setAITextContent(undefined);
        triggeringAICall.current = false;
        removeTextBlockAIContentTrigger();
        saveBlock({
          blockID: blockData.id,
          data: {
            value:
              reactElementToJSXString(message?.ui)?.replaceAll("{' '}", " ") ??
              "",
          },
        });
      },
      onError: (error) => {
        console.log("error", error);
        setPrompt("");
        setAITextContent(undefined);
        triggeringAICall.current = false;
        removeTextBlockAIContentTrigger();
      },
    });

  useEffect(() => {
    const unsub = editorStore.subscribe(
      (state) => state.aiQuery,
      (newQuery, prevQuery) => {
        debugger;
        if (
          newQuery &&
          newQuery?.blockId === id &&
          triggeringAICall.current === false &&
          formRef.current !== undefined
        ) {
          triggeringAICall.current = true;
          setInput(newQuery?.query);
          setPrompt(newQuery?.query);
          debugger;
          setTimeout(() => {
            formRef.current?.dispatchEvent(
              new Event("submit", {
                bubbles: true,
                cancelable: true,
              }),
            );
          }, 300);
        }
      },
      {
        equalityFn: shallow,
        fireImmediately: true,
      },
    );
    return unsub;
  }, []);

  const aiText = useMemo(() => {
    let result = "";
    try {
      debugger;
      result = triggeringAICall.current
        ? messages?.[1]?.ui
          ? reactElementToJSXString(messages?.[1]?.ui)?.replaceAll(
              "{' '}",
              " ",
            ) ?? ""
          : ""
        : "";
    } catch (error) {
      debugger;
      result = messages?.[1]?.ui as string;
    }
    return result;
  }, [messages]);

  useEffect(() => {
    const unsub = editorStore.subscribe(
      (state) => state.currentDocumentData.blocks[id] as TextBlockData,
      (block, prevBlock) => {
        console.log("hovering block", block?.hovered);
        if (block?.updateDate !== prevBlock?.updateDate) {
          setBlockData(block);
        } else if (block?.focused !== prevBlock?.focused) {
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

  const editor = tipTapEditor(
    {
      editorProps: {
        handlePaste(this, view, event, slice) {
          const text = event?.clipboardData?.getData("text/plain");
          if (text) {
            if (/<[^>]*>/.test(text)) {
              return view.pasteHTML(text);
            }
            return view.pasteText(text);
          }
        },
        // transformPastedText(text) {
        //   return text.toUpperCase();
        // },
      },
      extensions: [
        StarterKit,
        TextStyle,
        FontSize,
        Underline,
        Color,
        Superscript,
        FontFamily.configure({
          types: ["textStyle"],
        }),
        HighLight.configure({
          multicolor: true,
        }),
        Indent,
        Subscript,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        LineHeight.configure({
          heights: ["1", "1.15", "1.5", "2"],
        }),
      ],
      content: aiText !== "" ? aiText : blockData?.value ?? "",
    },
    [aiText, blockData?.value],
  );

  if (!blockData) return <></>;

  const handleClickOutside = (event: any) => {
    event.stopPropagation();
    const toolbar = event.target.closest("#toolbar-container");
    const toolbarDrop = event.target.closest(".text-container-drop");
    const sideBarMenu = event.target.closest("#sidebar-container");
    const htmlTargeted = event.target === document.documentElement;
    if (!componentRef.current) return;
    const mainBlock = componentRef.current.closest(".q-block");
    if (toolbar || toolbarDrop || sideBarMenu || htmlTargeted) {
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
    if (!editor) return;
    if (blockData.value?.trim() === editor.getHTML()?.trim()) return;
    saveBlock({
      blockID: blockData.id,
      data: { value: editor.getHTML() },
    });
  };

  if (hideEditor) {
    return (
      <>
        <div
          id={`${blockData.id}`}
          className={cn(
            `q-block p-3`,
            lastBlock && "last-block",
            `jsx-${blockData.id}`,
            roboto.variable,
            inter.variable,
            lato.variable,
            montserrat.variable,
            noto_Sans.variable,
            open_sans.variable,
            oswald.variable,
            playfair_Display.variable,
            poppins.variable,
            raleway.variable,
            source_Sans_3.variable,
          )}
          dangerouslySetInnerHTML={{ __html: blockData?.value ?? "" }}
        />
        {/* //convert font-size to px */}
        <style jsx global>{`
          .jsx-${blockData.id} h1 {
            font-size: ${blockData?.style?.heading1?.fontSize ?? "24"}px;
            font-weight: ${blockData?.style?.heading1?.fontWeight ?? "600"};
            font-family: var(
              ${blockData?.style?.heading1?.fontFamily ?? "--font-roboto"}
            );
          }
          .jsx-${blockData.id} h2 {
            font-size: ${blockData?.style?.heading2?.fontSize ?? "20"}px;
            font-weight: ${blockData?.style?.heading2?.fontWeight ?? "600"};
            font-family: var(
              ${blockData?.style?.heading2?.fontFamily ?? "--font-roboto"}
            );
          }
          .jsx-${blockData.id} h3 {
            font-size: ${blockData?.style?.heading3?.fontSize ?? "18"}px;
            font-weight: ${blockData?.style?.heading3?.fontWeight ?? "600"};
            font-family: var(
              ${blockData?.style?.heading3?.fontFamily ?? "--font-roboto"}
            );
          }
          .jsx-${blockData.id} h4 {
            font-size: ${blockData?.style?.heading4?.fontSize ?? "16"}px;
            font-weight: ${blockData?.style?.heading4?.fontWeight ?? "600"};
            font-family: var(
              ${blockData?.style?.heading4?.fontFamily ?? "--font-roboto"}
            );
          }
          .jsx-${blockData.id} h5 {
            font-size: ${blockData?.style?.heading5?.fontSize ?? "14"}px;
            font-weight: ${blockData?.style?.heading5?.fontWeight ?? "600"};
            font-family: var(
              ${blockData?.style?.heading5?.fontFamily ?? "--font-roboto"}
            );
          }
          .jsx-${blockData.id} p {
            font-size: ${blockData?.style?.normalText?.fontSize ?? "12"}px;
            font-weight: ${blockData?.style?.normalText?.fontWeight ?? "400"};
            font-family: var(
              ${blockData?.style?.normalText?.fontFamily ?? "--font-roboto"}
            );
          }
        `}</style>
      </>
    );
  }

  return (
    <FloatingToolbar
      containerName={"Text Block"}
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
      blockType="textBlock"
      containerID={containerID}
      pageID={pageID}
    >
      <form ref={formRef} className="hidden" onSubmit={handleSubmit}>
        <input
          type="hidden"
          className="absolute hidden"
          value={prompt ?? ""}
          onChange={handleInputChange}
        />
      </form>
      <EditorContent
        editor={editor}
        onClick={() => {
          if (!editor) return;
          updateEditorFocus();
        }}
        onFocus={(e) => {
          if (!activeListener.current && componentRef.current && editor) {
            console.log("focus");
            activeListener.current = true;
            document.addEventListener("mousedown", handleClickOutside);
            setBlockFocus({
              blockID: blockData.id,
              focus: true,
            });
            setActiveEditor({
              editorID: blockData.id,
              editor: editor,
            });
          }
        }}
        className={cn(
          "text-editor-inner overflow-hidden",
          classNames ?? "",
          blockData?.focused === userID ? "text-block-focued" : "",
          `jsx-${blockData.id}`,
          roboto.variable,
          inter.variable,
          lato.variable,
          montserrat.variable,
          noto_Sans.variable,
          open_sans.variable,
          oswald.variable,
          playfair_Display.variable,
          poppins.variable,
          raleway.variable,
          source_Sans_3.variable,
        )}
        style={{
          backgroundColor:
            blockData?.style?.background?.style === "color"
              ? blockData?.style?.background?.color ?? ""
              : "",
          paddingTop: `${blockData?.style?.padding?.top ?? 0}px`,
          paddingLeft: `${blockData?.style?.padding?.left ?? 0}px`,
          paddingRight: `${blockData?.style?.padding?.right ?? 0}px`,
          paddingBottom: `${blockData?.style?.padding?.bottom ?? 0}px`,
          borderLeftWidth: `${blockData?.style?.border?.left ?? 0}px`,
          borderLeftStyle: blockData?.style?.border?.style ?? "solid",
          borderLeftColor: blockData?.style?.border?.color ?? "",
          borderRightWidth: `${blockData?.style?.border?.right ?? 0}px`,
          borderRightStyle: blockData?.style?.border?.style ?? "solid",
          borderRightColor: blockData?.style?.border?.color ?? "",
          borderTopWidth: `${blockData?.style?.border?.top ?? 0}px`,
          borderTopStyle: blockData?.style?.border?.style ?? "solid",
          borderTopColor: blockData?.style?.border?.color ?? "",
          borderBottomWidth: `${blockData?.style?.border?.bottom ?? 0}px`,
          borderBottomStyle: blockData?.style?.border?.style ?? "solid",
          borderBottomColor: blockData?.style?.border?.color ?? "",
          borderTopLeftRadius: `${blockData?.style?.borderRadius?.topLeft ?? 0}px`,
          borderTopRightRadius: `${blockData?.style?.borderRadius?.topRight ?? 0}px`,
          borderBottomLeftRadius: `${blockData?.style?.borderRadius?.bottomLeft ?? 0}px`,
          borderBottomRightRadius: `${blockData?.style?.borderRadius?.bottomRight ?? 0}px`,
          ...(styles ?? {}),
        }}
        onPaste={(e) => {
          e.preventDefault();

          const text = e.clipboardData.getData("text/plain");
          // document.execCommand("insertHTML", false, text);
        }}
      />
      <BlockOutlineContainer
        blockRef={componentRef}
        pageID={pageID}
        containerID={containerID}
        columnID={columnID}
        blockID={blockData.id}
        focused={blockData?.focused === userID}
        hovered={blockData?.hovered === userID}
        isFloating={isFloating}
      />
      <style jsx global>{`
        .jsx-${blockData.id} h1 {
          font-size: ${blockData?.style?.heading1?.fontSize ?? "24"}px;
          font-weight: ${blockData?.style?.heading1?.fontWeight ?? "600"};
          font-family: var(
            ${blockData?.style?.heading1?.fontFamily ?? "--font-roboto"}
          );
        }
        .jsx-${blockData.id} h2 {
          font-size: ${blockData?.style?.heading2?.fontSize ?? "20"}px;
          font-weight: ${blockData?.style?.heading2?.fontWeight ?? "600"};
          font-family: var(
            ${blockData?.style?.heading2?.fontFamily ?? "--font-roboto"}
          );
        }
        .jsx-${blockData.id} h3 {
          font-size: ${blockData?.style?.heading3?.fontSize ?? "18"}px;
          font-weight: ${blockData?.style?.heading3?.fontWeight ?? "600"};
          font-family: var(
            ${blockData?.style?.heading3?.fontFamily ?? "--font-roboto"}
          );
        }
        .jsx-${blockData.id} h4 {
          font-size: ${blockData?.style?.heading4?.fontSize ?? "16"}px;
          font-weight: ${blockData?.style?.heading4?.fontWeight ?? "600"};
          font-family: var(
            ${blockData?.style?.heading4?.fontFamily ?? "--font-roboto"}
          );
        }
        .jsx-${blockData.id} h5 {
          font-size: ${blockData?.style?.heading5?.fontSize ?? "14"}px;
          font-weight: ${blockData?.style?.heading5?.fontWeight ?? "600"};
          font-family: var(
            ${blockData?.style?.heading5?.fontFamily ?? "--font-roboto"}
          );
        }
        .jsx-${blockData.id} p {
          font-size: ${blockData?.style?.normalText?.fontSize ?? "12"}px;
          font-weight: ${blockData?.style?.normalText?.fontWeight ?? "400"};
          font-family: var(
            ${blockData?.style?.normalText?.fontFamily ?? "--font-roboto"}
          );
        }
      `}</style>
    </FloatingToolbar>
  );
};

// const isEqual = (prevProps: BlockProps, nextProps: BlockProps) => {
//   // Check for equality on all props except 'page'
//   console.log('checking page');
//   if (prevProps.page.updateDate !== nextProps.page.updateDate) {
//     console.log('Regenerating page', nextProps.page.id);
//   }
//   return prevProps..updateDate === nextProps.page.updateDate;
// };

// export const MemoizedTextBlock = memo(TextBlock, isEqual);
export default TextBlock;
