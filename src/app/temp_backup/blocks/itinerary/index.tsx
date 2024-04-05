import { useEditor } from "@/providers/stores/editor.provider";
import { unsplashAIGenerator } from "@/server/actions/unsplash/unsplash";
import type {
  BookingData,
  ItineraryBlockData,
  ItineraryBlockType,
  SegmentCI,
} from "@/types/blocks/itineary";
import { faPlaneDeparture } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { shallow } from "zustand/shallow";
import SegmentAddToolbar from "../../editorUIHelpers/itinerary/SegmentAddToolbar";
import Aeroplane from "./styles/aeroplane";
import Escape from "./styles/escape";
import Explorer from "./styles/explorer";
import Flight from "./styles/flight";
import HelloWorld from "./styles/helloworld";

type Props = {
  type: ItineraryBlockType;
  itineraryStyle: ItineraryBlockData["itiStyle"];
  pageId: string;
  columnId: string;
  containerId: string;
  blockId: string;
  parent: string;
  currentColIndex: number;
  data?: SegmentCI | BookingData;
  edit: boolean;
};

export function formatTime(value: Date) {
  let formattedTime = new Date(value).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  formattedTime = formattedTime.startsWith("0:")
    ? formattedTime.replace("0:", "12:")
    : formattedTime;
  return formattedTime;
}

export function formatDate(value: Date) {
  const formattedDate = new Date(value).toLocaleDateString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formattedDate;
}

export function getStartDate(segmentData: SegmentCI, type: string) {
  let date;
  switch (type) {
    case "flight":
    case "activity":
    case "package":
    case "surface":
    case "insurance":
    case "miscellaneous":
      date =
        segmentData[type === "package" ? "packageCi" : type]?.departs?.date;
      break;
    case "hotel":
      date = segmentData.hotel?.checkinDate;
      break;
    case "car":
      date =
        segmentData.car?.pickup?.vehicleLocationDateTime?.locationCityDateTime
          ?.date;
      break;
    case "train":
    case "bus":
    case "cruise":
    case "ferry":
    case "tour":
    case "transfer":
      date =
        segmentData[type === "train" ? "rail" : type]?.departs
          ?.locationCityDateTime?.date;
      break;
    case "ownArrangement":
      date = segmentData.ownArrangement?.from?.date;
      break;
    default:
      return null;
  }
  return date ? new Date(date) : null;
}

export function getEndDate(segmentData: SegmentCI, type: string) {
  let date;
  switch (type) {
    case "flight":
    case "activity":
    case "package":
    case "surface":
    case "miscellaneous":
      date =
        segmentData[type === "package" ? "packageCi" : type]?.arrives?.date;
      break;
    case "insurance":
      date = segmentData.insurance?.terminationDate;
      break;
    case "hotel":
      date = segmentData.hotel?.checkoutDate;
      break;
    case "car":
      date =
        segmentData.car?.dropoff?.vehicleLocationDateTime?.locationCityDateTime
          ?.date;
      break;
    case "train":
    case "bus":
    case "cruise":
    case "ferry":
    case "tour":
    case "transfer":
      date =
        segmentData[type === "train" ? "rail" : type]?.arrives
          ?.locationCityDateTime?.date;
      break;
    case "ownArrangement":
      date = segmentData.ownArrangement?.to?.date;
      break;
    default:
      return null;
  }
  return date ? new Date(date) : null;
}

const ItinerarySegment = ({
  type,
  itineraryStyle,
  pageId,
  columnId,
  containerId,
  blockId,
  currentColIndex,
  parent,
  data,
  edit,
}: Props) => {
  const editorStore = useEditor();
  const [showToolbar, setShowToolbar] = useState(false);
  const showHideToolbarTimeout = useRef<any>(undefined);
  const [AIProcessing, setAIProcessing] = useState(false);
  const [aiProcessingError, setAIProcessingError] = useState(false);
  const [blockData, setBlockData] = useState<ItineraryBlockData>(
    editorStore.getState().currentDocumentData.blocks[
      blockId
    ] as ItineraryBlockData,
  );
  const isTemplate =
    editorStore.getState().currentDocumentData.status === "template";

  const targetTextBlockToTriggerAIContent = editorStore(
    useShallow((state) => state.targetTextBlockToTriggerAIContent),
  );

  const showHideToolbar = (show: boolean) => {
    showHideToolbarTimeout.current &&
      clearTimeout(showHideToolbarTimeout.current);
    showHideToolbarTimeout.current = setTimeout(() => {
      setShowToolbar(show);
    }, 300);
  };

  useEffect(() => {
    const unsub = editorStore.subscribe(
      (state) =>
        state.currentDocumentData.blocks[blockId] as ItineraryBlockData,
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

  // const currentDocument = editorStore(
  //   (state) => state.documentList[state.currentVersion]!,
  // );
  // const blockData = currentDocument.blocks[blockId] as ItineraryBlockData;

  const cityName =
    type === "flight"
      ? (blockData.data.segmentData as SegmentCI).flight?.arrives?.airport
          ?.airportLocation?.cityName
      : (blockData.data.segmentData as SegmentCI).hotel?.city?.cityName;

  const uploadFileArray: (File | null)[] = [];
  const uploaded: any[] = [];
  // const galleryBlockData = useRef({
  //   ...defaultGalleryBlockData(),
  //   style: {
  //     ...defaultGalleryBlockData().style,
  //     galleryStyle: "Layout 16",
  //     height: 600,
  //   },
  // });
  // const saveBlock = editorStore(useShallow((state) => state.saveBlock));
  const generateItineraryAIContent = editorStore(
    useShallow((state) => state.generateItineraryAIContent),
  );
  // const saveStreamedTextBlock = editorStore(
  //   useShallow((state) => state.saveStreamedTextBlock),
  // );
  const documentID = editorStore.getState().documentID;
  // const aiGenerateGallery = editorStore((state) => state.aiGenerateGallery);
  // const aiGenerateTravelGuide = editorStore(
  //   (state) => state.aiGenerateTravelGuide,
  // );

  // const {
  //   execute: executeCreateS3PresignedUrlForAttachments,
  //   result: createS3PresignedUrlForAttachmentsResult,
  //   status: createS3PresignedUrlForAttachmentsStatus,
  // } = useAction(createS3PresignedUrlForAttachments, {
  //   onSuccess(data, input, reset) {
  //     const uploadUrl = data?.url;
  //     const index = uploadFileArray.findIndex(
  //       (file) => file?.name === data.attachmentsData.fileName,
  //     );
  //     const uploadFile = uploadFileArray[index];
  //     if (uploadFile && uploadUrl) {
  //       fetch(uploadUrl, {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": uploadFile.type,
  //           "Access-Control-Allow-Origin": "*",
  //         },
  //         body: uploadFile,
  //       })
  //         .then((response) => {
  //           uploaded.push({ ...data.attachmentsData, path: data.path });
  //           const newGalleryData = {
  //             image: data?.path,
  //             metadata: input.metadata,
  //             s3ID: data?.attachmentsData.id,
  //           } as GalleryImageData;
  //           galleryBlockData.current.images[index] = newGalleryData;
  //           saveBlock({
  //             blockID: galleryBlockData.current.id,
  //             data: galleryBlockData.current,
  //           });
  //           if (uploaded.length === uploadFileArray.length) {
  //             setAIProcessing(false);
  //             if (!aiTextBlock.current) {
  //               aiTextBlock.current = defaultTextBlockData();
  //               aiGenerateTravelGuide({
  //                 containerId: containerId,
  //                 pageId: pageId,
  //                 blockId: blockId,
  //                 textBlockData: aiTextBlock.current,
  //               });
  //             }
  //             if (form.current) {
  //               const event = new Event("submit", {
  //                 bubbles: true,
  //                 cancelable: true,
  //               });
  //               form.current.dispatchEvent(event);
  //             }
  //           }
  //         })
  //         .catch((error) => {
  //           console.error;
  //         });
  //     } else {
  //       uploaded.push({ error: "upload file not found" });
  //     }
  //   },
  //   onError(error, input, reset) {
  //     console.log(error);
  //     setAIProcessing(false);
  //   },
  //   onExecute(input) {
  //     setAIProcessing(true);
  //   },
  // });
  // const processImageForUpload = (image: any, index: number) => {
  //   const img = document.createElement("img");
  //   img.setAttribute("index", index.toString());
  //   const uploadFile = uploadFileArray[index];
  //   img.onload = function (image) {
  //     //setIsLoading(true);
  //     const imageElement = image.currentTarget as HTMLImageElement;
  //     const processImageIndex = imageElement.getAttribute("index");

  //     executeCreateS3PresignedUrlForAttachments({
  //       name: uploadFile?.name,
  //       type: "document",
  //       attachmentArea: FileAttachmentArea.DocumentAttachment,
  //       attachmentType: FileAttachmentType.Image,
  //       requestType: S3RequestType.PUT,
  //       blockID: blockData.id,
  //       relationID: documentID,
  //       metadata: {
  //         type: uploadFile?.type,
  //         size: uploadFile?.size,
  //         name: uploadFile?.name,
  //         width: imageElement.width,
  //         height: imageElement.height,
  //         index: parseInt(processImageIndex!),
  //       },
  //     });
  //   };
  //   //img.src = image;

  //   const reader = new FileReader();
  //   reader.onloadend = function (ended) {
  //     img.src = ended?.target?.result?.toString() ?? "";
  //   };
  //   reader.readAsDataURL(image);
  // };
  const {
    execute: unsplashSearchPhotos,
    result: unsplashSearchPhotosResult,
    status: unsplashSearchPhotosStatus,
  } = useAction(unsplashAIGenerator, {
    onSuccess(data, input, reset) {
      if (data.success) {
        debugger;
        const blockIds = generateItineraryAIContent({
          columnId: columnId,
          containerId: containerId,
          pageId: pageId,
          imageIds:
            data?.data?.map((image) => {
              return {
                s3Id: image.fileName,
                path: image.url,
              };
            }) ?? [],
        });
        debugger;
        if (blockIds?.galleryBlockId) {
          targetTextBlockToTriggerAIContent({
            query: `generate destination guide for ${input.query} with formatted headers and key points of interest`,
            textBlockId: blockIds.textBlockId!,
          });
        }
        // for (let index = 0; index < 4; index++) {
        //   if (data?.results[index]?.urls.raw) {
        //     const remoteFileUrl = data.results[index]?.urls.raw ?? "";
        //     fetch(remoteFileUrl)
        //       .then((r) => r.blob())
        //       .then((blob) => {
        //         const newFile = new File([blob], `unsplash-${index}.png`, {
        //           lastModified: new Date().getTime(),
        //           type: blob.type,
        //         });
        //         uploadFileArray[index] = newFile;
        //         processImageForUpload(newFile, index);
        //       })
        //       .catch(console.error);
        //     // const remoteFileBlob = fetchImageFromURL(remoteFileUrl);
        //   }
        // }
      } else {
        console.log(data?.error);
      }
      // aiGenerateGallery({
      //   documentID: documentID,
      //   containerId: containerId,
      //   pageId: pageId,
      //   blockId: blockId,
      //   galleryBlockData: galleryBlockData.current,
      // });
      // const pageIndex = currentDocument?.pages?.findIndex(
      //   (page: DocumentPage) => page.id === pageId,
      // );

      // const containers = currentDocument.pages[pageIndex]?.containers;
      // const activeContainer = containers?.find(
      //   (container) => container.id === containerId,
      // );
      // activeContainer!.updateDate = new Date().getTime();
      // const activeColumn = activeContainer?.columns.find((column) =>
      //   column.blocks.includes(blockId),
      // );
      // const galleryBlockId =
      //   activeColumn?.blocks[activeColumn.blocks.length - 1];
      setAIProcessing(false);
    },
    onError(error, input, reset) {
      console.log(error);
      setAIProcessing(false);
    },
    onExecute(input) {
      setAIProcessing(true);
    },
  });

  // const [prompt, setPrompt] = useState("");
  // const form = useRef<HTMLFormElement>(null);
  // const aiTextBlock = useRef<TextBlockData | null>(null);

  // const { messages, input, setInput, handleInputChange, handleSubmit } =
  //   useChat({
  //     api: handler,
  //   });
  const aiError = () => {
    setAIProcessingError(true);
    setAIProcessing(true);
    setTimeout(() => {
      setAIProcessing(false);
      setAIProcessingError(false);
    }, 2000);
  };
  // useEffect(() => {
  //   if (blockData) {
  //     setPrompt(`generate travel guide for ${cityName} with formatted headers`);
  //     setInput(`generate travel guide for ${cityName} with formatted headers`);
  //   }
  // });

  // const throttledSaveBlock2 = throttle(saveStreamedTextBlock, 2000);
  // useEffect(() => {
  //   if (aiTextBlock.current) {
  //     throttledSaveBlock2({
  //       blockID: aiTextBlock.current.id,
  //       data:
  //         messages && messages[1] && messages[1].ui
  //           ? reactElementToJSXString(messages[1].ui)
  //           : "",
  //     });
  //   }
  //   console.log("messages", messages);
  // }, [messages]);

  return (
    <div className={itineraryStyle ?? "flight"}>
      {isTemplate && (
        <div className="flex h-[70px] items-center justify-center bg-[#f7f7f7] text-center text-[14px] leading-[1.1] text-[#767676]">
          <span>
            <span className="flex items-center">
              <FontAwesomeIcon
                icon={faPlaneDeparture}
                className={"mr-2 h-3 w-3"}
              />{" "}
              <span>Itinerary Placeholder</span>
            </span>
            <span className="text-[11px]">Itinerary will load here</span>
          </span>
        </div>
      )}
      {!isTemplate && (
        <>
          {/* <form ref={form} onSubmit={handleSubmit}>
            <input
              type="hidden"
              className="absolute top-[10px]"
              value={prompt}
              onChange={handleInputChange}
            />
          </form> */}
          {edit && (showToolbar || AIProcessing) && (
            <SegmentAddToolbar
              type={type}
              containerId={containerId}
              pageId={pageId}
              currentColIndex={currentColIndex}
              blockId={blockId}
              showHideToolbar={(show) => {
                showHideToolbar(show);
              }}
              setAIProcessing={(processing) => {
                setAIProcessing(processing);
              }}
              aiProcessing={AIProcessing}
              aiProcessingError={aiProcessingError}
              automate={() => {
                if (cityName) {
                  unsplashSearchPhotos({
                    query: cityName,
                    documentId: documentID,
                  });
                } else {
                  aiError();
                }
              }}
            />
          )}

          {(!itineraryStyle || itineraryStyle === "flight") && (
            <Flight
              blockId={blockId}
              type={type}
              data={data}
              parent={parent}
              edit={edit}
              showHideToolbar={(show) => {
                showHideToolbar(show);
              }}
            ></Flight>
          )}
          {itineraryStyle === "explorer" && (
            <Explorer
              blockId={blockId}
              type={type}
              data={data}
              parent={parent}
              edit={edit}
              showHideToolbar={(show) => {
                showHideToolbar(show);
              }}
            ></Explorer>
          )}
          {itineraryStyle === "helloworld" && (
            <HelloWorld
              blockId={blockId}
              type={type}
              data={data}
              parent={parent}
              edit={edit}
              showHideToolbar={(show) => {
                showHideToolbar(show);
              }}
            ></HelloWorld>
          )}
          {itineraryStyle === "escape" && (
            <Escape
              blockId={blockId}
              type={type}
              data={data}
              parent={parent}
              edit={edit}
              showHideToolbar={(show) => {
                showHideToolbar(show);
              }}
            ></Escape>
          )}
          {itineraryStyle === "aeroplane" && (
            <Aeroplane
              blockId={blockId}
              type={type}
              data={data}
              parent={parent}
              edit={edit}
              showHideToolbar={(show) => {
                showHideToolbar(show);
              }}
            ></Aeroplane>
          )}
        </>
      )}
    </div>
  );
};
export default ItinerarySegment;
