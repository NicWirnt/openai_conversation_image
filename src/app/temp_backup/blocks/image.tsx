'use client';

import { ImageItemLoader } from '@/app/[lang]/_sharedComponents/loaders/ImageItemLoader';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEditor } from '@/providers/stores/editor.provider';
import {
  MainSideBarType,
  SideBarType,
} from '@/providers/stores/editor/properties';
import { useEditorClipboard } from '@/providers/stores/editorClipboard.provider';
import { createS3PresignedUrlForAttachments } from '@/server/actions/fileManager/createS3PresignedUrl';
import { performS3Action } from '@/server/actions/fileManager/performS3Action';
import {
  FileAttachmentArea,
  FileAttachmentType,
  S3RequestType,
  validImageExtensions,
} from '@/server/schemas/fileManager';
import type { ImageBlockData } from '@/types/blocks/image';
import {
  faClone,
  faCog,
  faColumns,
  faCopy,
  faImage,
  faLockOpen,
  faObjectsAlignCenterHorizontal,
  faObjectsAlignLeft,
  faObjectsAlignRight,
  faPencil,
  faPlus,
  faRefresh,
  faTrash,
  faUpload,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAction } from 'next-safe-action/hooks';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import type { LoadingBarRef } from 'react-top-loading-bar';
import LoadingBar from 'react-top-loading-bar';
import { useShallow } from 'zustand/react/shallow';
import { shallow } from 'zustand/shallow';
import FloatingToolbar from '../editorUIHelpers/floatingToolbar';
import BlockOutlineContainer from './helpers/blockOutlineContainer';

// Import the editor styles
import '@pqina/pintura/pintura.css';

// Import the editor default configuration
// pintura
import {
  ImageSource,
  PinturaEditor,
  appendNode,
  createDefaultImageReader,
  createDefaultImageWriter,
  createDefaultShapePreprocessor,
  createNode,
  findNode,
  //config
  getEditorDefaults,
  // editor
  locale_en_gb,
  markup_editor_defaults,
  markup_editor_locale_en_gb,
  openDefaultEditor,
  plugin_annotate,
  plugin_annotate_locale_en_gb,
  plugin_crop,
  plugin_crop_locale_en_gb,
  plugin_filter,
  plugin_filter_defaults,
  plugin_filter_locale_en_gb,
  plugin_finetune,
  plugin_finetune_defaults,
  plugin_finetune_locale_en_gb,
  // plugins
  setPlugins,
} from '@pqina/pintura';

// Import the editor component from `react-pintura`
import {
  PinturaEditorOverlay,
  PinturaEditor as PinturaEditorReact,
} from '@pqina/react-pintura';

import { cn, convertBlobToFile } from '@/lib/utils';
import { containerBlockOptions } from '.';
import BlockDropdown from '../editorUIHelpers/newBlock/blockDropdown';
import Resizeable from '../editorUIHelpers/resizeable';

type Props = {
  id: string;
  columnID: string;
  containerID: string;
  pageID: string;
  lastBlock: boolean;
  isFloating?: boolean;
  // infer types with `typeof`
};

setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_annotate);

const editorDefaults = {
  imageReader: createDefaultImageReader(),
  imageWriter: createDefaultImageWriter(),
  shapePreprocessor: createDefaultShapePreprocessor(),
  ...plugin_finetune_defaults,
  ...plugin_filter_defaults,
  ...markup_editor_defaults,
  locale: {
    ...locale_en_gb,
    ...plugin_crop_locale_en_gb,
    ...plugin_finetune_locale_en_gb,
    ...plugin_filter_locale_en_gb,
    ...plugin_annotate_locale_en_gb,
    ...markup_editor_locale_en_gb,
  },
};

const widgetProperties = {
  width: '100%',
  type: 'fixed',
};

const ToolbarOptions = ({
  isFloating,
  blockData,
  columnID,
  containerID,
  pageID,
  setIsOpen,
}: {
  isFloating: boolean;
  blockData: ImageBlockData;
  columnID: string;
  containerID: string;
  pageID: string;
  setIsOpen: (e: boolean) => void;
}) => {
  const addNewColumnToContainer = useEditor()(
    (state) => state.addNewColumnToContainer,
  );
  const setSideBarContext = useEditor()((state) => state.setSideBarContext);
  const deleteBlock = useEditor()((state) => state.deleteBlock);
  const copyBlock = useEditorClipboard()((state) => state.copyBlock);
  const cloneBlock = useEditor()((state) => state.cloneBlock);
  const saveBlock = useEditor()((state) => state.saveBlock);

  const { execute, result, status } = useAction(performS3Action, {
    onSuccess(data, input, reset) {
      //const { url, s3ID, attachmentData } = ;
      if (data && data.success && data.responseMetadata) {
        const url = data.responseMetadata.url;
        const s3ID = data.responseMetadata.s3ID;
        const attachmentData = data.responseMetadata.attachmentData;
        const newID = input.extras.newBlockID;
        saveBlock({
          blockID: newID,
          data: {
            image: url,
            metadata: attachmentData?.metadata,
            // imageWidth: attachmentData?.metadata.width,
            // imageHeight: attachmentData?.metadata.height,
          },
        });
        console.log(data);
      }
    },
    onError(error, input, reset) {
      console.log(error);
    },
  });

  return (
    <>
      <Tooltip>
        <Separator
          orientation="vertical"
          className="mt-[2px] h-[20px] bg-neutral-400"
        />
        <TooltipTrigger asChild>
          <div
            className="flex cursor-pointer items-center px-2 hover:bg-neutral-600"
            onClick={() => {
              saveBlock({
                blockID: blockData.id,
                data: {
                  imagePosition: 'left',
                },
              });
            }}
          >
            <FontAwesomeIcon
              icon={faObjectsAlignLeft}
              size="xs"
              className={' text-white'}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Align Left</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="flex cursor-pointer items-center px-2 hover:bg-neutral-600"
            onClick={() => {
              saveBlock({
                blockID: blockData.id,
                data: {
                  imagePosition: 'center',
                },
              });
            }}
          >
            <FontAwesomeIcon
              icon={faObjectsAlignCenterHorizontal}
              size="xs"
              className={' text-white'}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Align Center</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="flex cursor-pointer items-center px-2 hover:bg-neutral-600"
            onClick={() => {
              saveBlock({
                blockID: blockData.id,
                data: {
                  imagePosition: 'right',
                },
              });
            }}
          >
            <FontAwesomeIcon
              icon={faObjectsAlignRight}
              size="xs"
              className={' text-white'}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Align Right</p>
        </TooltipContent>
      </Tooltip>
      <Separator
        orientation="vertical"
        className="mt-[2px] h-[20px] bg-neutral-400"
      />
      <Tooltip>
        <Separator
          orientation="vertical"
          className="mt-[2px] h-[20px] bg-neutral-400"
        />
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
              className={' text-white'}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy Image Block</p>
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
                callback: (newID: string) => {
                  console.log(newID);
                  execute({
                    blockID: blockData.id,
                    requestType: S3RequestType.COPY,
                    extras: {
                      newBlockID: newID,
                    },
                  });
                },
              });
            }}
          >
            <FontAwesomeIcon
              icon={faClone}
              size="xs"
              className={' text-white'}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Clone Image Block</p>
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
                    className={' text-white'}
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
              className={' text-white'}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add Column</p>
        </TooltipContent>
      </Tooltip>
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
                  type: 'imageBlock',
                  name: 'Image Block',
                  icon: (
                    <FontAwesomeIcon
                      icon={faImage}
                      className={' text-neutral-500'}
                    />
                  ),
                },
              });
            }}
          >
            <FontAwesomeIcon icon={faCog} size="xs" className={' text-white'} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Image Block Settings</p>
        </TooltipContent>
      </Tooltip>
      {/* {s3URL && (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="cursor-pointer flex items-center px-2 hover:bg-neutral-600"
            onClick={() => {
              openDefaultEditor({
                src: s3URL
              })
            }}
          >
            <FontAwesomeIcon icon={faEdit} size="xs" className={' text-white'} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit Image</p>
        </TooltipContent>
      </Tooltip>
      )} */}
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
              className={' text-white'}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Lock Image Block</p>
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
              className={'text-white group-hover/deleteButton:text-red-600'}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete Image Block</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
};

type ImageMetadata = {
  type?: string;
  size?: number;
  blockID?: string;
  relationID?: number;
  width?: number;
  height?: number;
};

const ToolbarImageOptions = ({
  blockData,
  unsplashCallback,
  pinturaCallback,
}: {
  blockData: ImageBlockData;
  unsplashCallback?: (file: File | Blob, fileName?: string) => void;
  pinturaCallback?: () => void;
}) => {
  const editorStore = useEditor();
  const saveBlock = editorStore((state) => state.saveBlock);
  const setUnsplashPickerBlockLinkId = editorStore(
    useShallow((state) => state.setUnsplashPickerBlockLinkId),
  );
  const setUnsplashCallback = editorStore(
    useShallow((state) => state.setUnsplashCallback),
  );

  return (
    <>
      {pinturaCallback && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="flex cursor-pointer items-center px-2 hover:bg-neutral-600"
              onClick={() => {
                pinturaCallback();
              }}
            >
              <FontAwesomeIcon
                icon={faPencil}
                size="xs"
                className={' text-white'}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Image</p>
          </TooltipContent>
        </Tooltip>
      )}
      {unsplashCallback && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="flex cursor-pointer items-center px-2 hover:bg-neutral-600"
              onClick={() => {
                setUnsplashPickerBlockLinkId(blockData.id);
                setUnsplashCallback({
                  callback: unsplashCallback,
                });
              }}
            >
              <FontAwesomeIcon
                icon={faRefresh}
                size="xs"
                className={' text-white'}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Change Image</p>
          </TooltipContent>
        </Tooltip>
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="group/deleteButton cursor-pointer rounded px-2 hover:bg-red-200"
            onClick={() => {
              saveBlock({
                blockID: blockData.id,
                data: {
                  image: undefined,
                  metadata: undefined,
                  tempImage: undefined,
                },
              });
            }}
          >
            <FontAwesomeIcon
              icon={faTrash}
              size="xs"
              className={'text-white group-hover/deleteButton:text-red-600'}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete Image</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
};

const ImageBlock = ({
  id,
  columnID,
  containerID,
  pageID,
  isFloating = false,
}: Props) => {
  const editorStore = useEditor();
  const hideEditor = editorStore(useShallow((state) => state.hideEditor));
  const saveBlock = editorStore(useShallow((state) => state.saveBlock));
  const [isOpen, setIsOpen] = useState(false);

  const setUnsplashPickerBlockLinkId = editorStore(
    useShallow((state) => state.setUnsplashPickerBlockLinkId),
  );
  const setUnsplashCallback = editorStore(
    useShallow((state) => state.setUnsplashCallback),
  );

  const [blockData, setBlockData] = useState<ImageBlockData>(
    editorStore.getState().currentDocumentData.blocks[id] as ImageBlockData,
  );
  const [blockStatus, setBlockStatus] = useState<any>(
    editorStore.getState().blockStatus[id],
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [s3URL, setS3URL] = useState<string>();
  const [dataBlob, setDataBlob] = useState<ImageSource>();

  const [imageMetadata, setImageMetadata] = useState<ImageMetadata>({});

  const [imageWidth, setImageWidth] = useState<number>();
  const [imageHeight, setImageHeight] = useState<number>();
  const [elementWidth, setElementWidth] = useState<number | undefined>();
  const [elementHeight, setElementHeight] = useState<number>();
  const [editorEnabled, setEditorEnabled] = useState<boolean>(false);
  const [editorImage, setEditorImage] = useState<ImageSource>();
  const [tempImage, setTempImage] = useState<string | undefined>();

  const documentID = editorStore(useShallow((state) => state.documentID));
  const setBlockFocus = editorStore(useShallow((state) => state.setBlockFocus));
  const setBlockHover = editorStore(useShallow((state) => state.setBlockHover));
  const userID = editorStore(useShallow((state) => state.userID));

  const componentRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<LoadingBarRef>(null);
  const overlayRef = useRef<PinturaEditorReact>(null);
  const activeListener = useRef<boolean>(false);
  // const imageRef = useRef<HTMLIma>(null);

  const editorConfig = getEditorDefaults();
  editorConfig.enableButtonClose = true;

  const overlayConfig = editorDefaults;
  // overlayConfig.enableButtonClose = true;
  // overlayConfig.enableUtils = false;
  //overlayConfig.utils =;

  let editor: PinturaEditor;

  //   const willRenderToolbar = (toolbar, env, redraw) => {
  //     console.log(toolbar);
  //     // logs: [ Array(4), Array(4), Array(4) ]

  //     console.log(env);
  //     // logs: { orientation: "landscape", verticalSpace: "short", … }

  //     // call redraw to trigger a redraw of the editor state

  //     // insert your item
  //     return [
  //         createNode('div', 'my-div', { textContent: 'Hello world' }),
  //         ...toolbar,
  //     ];
  // };

  const willRenderModalToolbar = (toolbar: any, env: any, redraw: any) => {
    const revert = findNode('revert', toolbar);
    const history = findNode('alpha-set', toolbar);
    if (s3URL && editorImage !== s3URL) {
      const editOriginal = createNode('Button', 'edit-original', {
        // The button label
        title: 'Edit original image',
        // An optional button SVG icon
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V299.6l-94.7 94.7c-8.2 8.2-14 18.5-16.8 29.7l-15 60.1c-2.3 9.4-1.8 19 1.4 27.8H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z"/></svg>',
        // A click event handler
        onclick: () => {
          /* do something here */
          editor?.loadImage(s3URL).catch(console.error);
        },
      });

      if (history) {
        appendNode(editOriginal, history);
      }
    }

    return [...toolbar];
  };

  useEffect(() => {
    if (blockData?.id) {
      setBlockFocus({
        blockID: blockData.id,
        focus: false,
      });
      setBlockData({ ...blockData, focused: undefined });
    }
  }, []);

  const willRenderOverlayToolbar = (toolbar: any, env: any, redraw: any) => {
    const revert = findNode('revert', toolbar);
    const history = findNode('alpha-set', toolbar);
    const exportButton = findNode('export', toolbar);
    const editorButton = createNode('Button', 'open-editor', {
      // The button label
      title: 'Open Editor',
      // An optional button SVG icon
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V299.6l-94.7 94.7c-8.2 8.2-14 18.5-16.8 29.7l-15 60.1c-2.3 9.4-1.8 19 1.4 27.8H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z"/></svg>',
      // A click event handler
      onclick: () => {
        /* do something here */
        editorConfig.willRenderToolbar = willRenderModalToolbar;

        openPinturaEditor();

        // editor = openDefaultEditor({
        //   src: blockData.tempImage || s3URL,
        //   ...editorConfig,
        // });

        // setEditorImage(blockData.tempImage || s3URL);

        // editor.on('process', (imageWriterResult) => {
        //   console.log(imageWriterResult);
        //   // logs: { src:…, dest:… , imageState:…, store:… }
        //   setEditorEnabled(false);
        //   console.log(imageWriterResult);
        //   // setS3URL(undefined);
        //   const imageData = URL.createObjectURL(imageWriterResult.dest);
        //   // setDataBlob(imageData);
        //   saveBlock({
        //     blockID: blockData.id,
        //     data: {
        //       tempImage: imageData,
        //     },
        //   });
        // });
      },
    });
    appendNode(editorButton, history!);

    if (s3URL && editorImage !== s3URL) {
      const editOriginal = createNode('Button', 'edit-original', {
        // The button label
        title: 'Edit original image',
        // An optional button SVG icon
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z"/></svg>',
        // A click event handler
        onclick: () => {
          /* do something here */
          setEditorImage(s3URL);
          overlayRef?.current?.editor.loadImage(s3URL).catch(console.error);
        },
      });

      if (history) {
        appendNode(editOriginal, history);
      }
    }

    return [...toolbar];
  };

  const openPinturaEditor = () => {
    editor = openDefaultEditor({
      src: tempImage ?? s3URL,
      ...editorConfig,
    });

    setEditorImage(tempImage ?? s3URL);

    editor.on('processstart', (imageWriterResult) => {
      console.log('History Length' + editor.history.length);
      const historyLength = editor?.history.length ?? 1;
      const historyIndex = editor?.history.index;
      console.log('History Length' + historyLength);
      console.log('History Index' + historyIndex);
      if (historyLength < 2 || historyIndex === 0) {
        editor.abortProcessImage();
        setEditorEnabled(false);
        editor.close();
      }
    });

    editor.on('process', onPinturaProcess);
  };

  let uploadFile: File | null;
  let uploadTimeout: any;

  const { execute, result, status } = useAction(
    createS3PresignedUrlForAttachments,
    {
      onSuccess(data, input, reset) {
        const url = data?.url;
        switch (input.requestType as S3RequestType) {
          case S3RequestType.GET:
            console.log(url);
            setS3URL(url);
            setIsLoading(false);
            if (url && (!imageMetadata.width || !imageMetadata.height)) {
              processImageMetadata(url);
            }
            break;
          case S3RequestType.PUT:
            if (url && uploadFile) {
              fetch(url, {
                method: 'PUT',
                headers: {
                  'Content-Type': uploadFile.type,
                  'Access-Control-Allow-Origin': '*',
                },
                body: uploadFile,
              })
                .then((response) => {
                  setTempImage(undefined);
                  saveBlock({
                    blockID: blockData.id,
                    data: {
                      image: data?.path,
                      metadata: input.metadata,
                      tempImage: undefined,
                      // imageWidth: input.metadata.width,
                      // imageHeight: input.metadata.height,
                    },
                  });
                  setIsLoading(false);
                  loadingRef.current?.complete();
                })
                .finally(() => {
                  uploadFile = null;
                })
                .catch(console.error);
            }
            loadingRef.current?.complete();
            break;
          case S3RequestType.UPDATE:
            if (url && uploadFile) {
              fetch(url, {
                method: 'PUT',
                headers: {
                  'Content-Type': uploadFile.type,
                  'Access-Control-Allow-Origin': '*',
                },
                body: uploadFile,
              })
                .then((response) => {
                  setTempImage(undefined);
                  saveBlock({
                    blockID: blockData.id,
                    data: {
                      image: data?.path,
                      metadata: input.metadata,
                      tempImage: undefined,
                      // imageWidth: input.metadata.width,
                      // imageHeight: input.metadata.height,
                    },
                  });
                  setIsLoading(false);
                  loadingRef.current?.complete();
                })
                .finally(() => {
                  uploadFile = null;
                })
                .catch(console.error);
            }
            break;
          default:
            console.log('Unknown request type');
            break;
        }
      },
      onError(error, input, reset) {
        // setIsCreating(false);
        console.log(error);
      },
      onExecute(input) {
        // setIsCreating(true);
      },
    },
  );

  const setSideBarContext = useEditor()((state) => state.setSideBarContext);
  const currentDocument = useEditor()(
    (state) => state.documentList[state.currentVersion]!,
  );

  const processUnsplashBlobForUpload = useCallback(
    (file: File | Blob, fileName = 'unsplash-image.jpg') => {
      let newFile = file as File;
      if (file instanceof Blob) {
        newFile = new File(
          [file as any], // cast as any
          fileName,
          {
            lastModified: new Date().getTime(),
            type: file.type,
          },
        );
      }
      uploadFile = newFile;
      processImageForUpload(newFile);
    },
    [],
  );

  const processImageForUpload = useCallback(
    (
      image: File | Blob | string,
      requestType: S3RequestType = S3RequestType.PUT,
    ) => {
      const img = document.createElement('img');
      img.onload = function (image) {
        setIsLoading(true);
        const imageElement = image.currentTarget as HTMLImageElement;
        setImageMetadata({
          type: uploadFile?.type,
          size: uploadFile?.size,
          width: imageElement.width,
          height: imageElement.height,
        });
        execute({
          name: uploadFile?.name,
          type: 'document',
          attachmentArea: FileAttachmentArea.DocumentAttachment,
          attachmentType: FileAttachmentType.Image,
          requestType: requestType,
          blockID: blockData.id,
          relationID: documentID,
          metadata: {
            type: uploadFile?.type,
            size: uploadFile?.size,
            name: uploadFile?.name,
            width: imageElement.width,
            height: imageElement.height,
          },
        });
      };

      if (image instanceof File) {
        const reader = new FileReader();
        reader.onloadend = function (ended) {
          img.src = ended?.target?.result?.toString() ?? '';
        };
        reader.readAsDataURL(image);
      } else if (image instanceof Blob) {
        const reader = new FileReader();
        const file = convertBlobToFile(image, 'new-image.jpg');
        uploadFile = file;
        setDataBlob(file);
        reader.onloadend = function (ended) {
          img.src = ended?.target?.result?.toString() ?? '';
        };
        reader.readAsDataURL(uploadFile);
      } else {
        if (image.includes('blob')) {
          fetch(image)
            .then((r) => {
              r.blob()
                .then((b) => {
                  processImageForUpload(b, requestType);
                })
                .catch(console.error);
            })
            .catch(console.error);
        }
      }
    },
    [],
  );

  const processImageMetadata = (imageURL: any) => {
    const img = document.createElement('img');

    img.src = imageURL;

    img.onload = function (image) {
      const imageElement = image.currentTarget as HTMLImageElement;
      setImageMetadata({
        width: imageElement.width,
        height: imageElement.height,
      });
      // saveBlock({
      //   blockID: blockData.id,
      //   data: {
      //     imageWidth: imageElement.width,
      //     imageHeight: imageElement.height,
      //   },
      // });
    };
  };

  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles[0]);
    const file = acceptedFiles[0];
    setS3URL(undefined);
    setImageMetadata({});
    uploadFile = file;
    const imageData = URL.createObjectURL(file);
    processImageForUpload(file);
  }, []);

  const onPinturaProcess = useCallback((res: any) => {
    console.log(res);
    // setS3URL(undefined);
    const imageData = URL.createObjectURL(res.dest);
    // setDataBlob(imageData);
    const file = res.dest;
    setTempImage(imageData);
    setDataBlob(file);
    uploadFile = file;
    saveBlock({
      blockID: blockData.id,
      data: {
        tempImage: imageData,
      },
    });
    setEditorEnabled(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    noDragEventsBubbling: true,
    noClick: true,
    accept: {
      'image/jpeg': validImageExtensions,
    },
  });

  const getImageProps = (blockData: ImageBlockData) => {
    const imageProps: any = {};
    const imageWidth =
      elementWidth ??
      blockData.width ??
      blockData.metadata?.width ??
      imageMetadata.width;
    const imageHeight =
      elementHeight ??
      blockData.height ??
      blockData.metadata?.height ??
      imageMetadata.height;
    if (imageWidth && imageHeight) {
      imageProps.width = imageWidth;
      imageProps.height = imageHeight;
      //imageProps['layout'] = 'responsive';
      imageProps.style = {};
      if (imageWidth > imageHeight) {
        imageProps.style.maxWidth = '100%';
        imageProps.style.maxHeight = '100%';
        imageProps.style.height = 'auto';
      } else {
        imageProps.style.maxHeight = '100%';
        imageProps.style.maxWidth = '100%';
        imageProps.style.width = 'auto';
      }
    } else {
      imageProps.fill = true;
    }
    if (imageProps.style) {
      imageProps.style.borderTopLeftRadius =
        blockData?.style?.borderRadius?.topLeft ?? 0;
      imageProps.style.borderTopRightRadius =
        blockData?.style?.borderRadius?.topRight ?? 0;
      imageProps.style.borderBottomLeftRadius =
        blockData?.style?.borderRadius?.bottomLeft ?? 0;
      imageProps.style.borderBottomRightRadius =
        blockData?.style?.borderRadius?.bottomRight ?? 0;
    }
    return imageProps;
  };

  useEffect(() => {
    if (blockData.tempImage && blockData.tempImage.length > 0) {
      setTempImage(blockData.tempImage);
      if (tempImage) {
        if (uploadTimeout) {
          clearTimeout(uploadTimeout);
        }
        uploadTimeout = setTimeout(() => {
          console.log('Processing Pintura Edit for Upload');
          processImageForUpload(tempImage, S3RequestType.UPDATE);
        }, 10000);
      }
    }
    return () => {
      clearTimeout(uploadTimeout);
    };
  }, [blockData.tempImage]);

  useEffect(() => {
    if (blockData.image && blockData.image.length > 0) {
      setTempImage(undefined);
      saveBlock({
        blockID: blockData.id,
        data: {
          tempImage: undefined,
        },
      });
      if (!s3URL || !s3URL.includes(blockData.image)) {
        const url =
          'https://quotecloud-v2-ap-southeast-2.s3.ap-southeast-2.amazonaws.com/' +
          blockData.image;
        console.log('GENERATED URL: ' + s3URL);
        setS3URL(url);
        // execute({
        //   name: blockData.image,
        //   type: "document",
        //   attachmentArea: blockData.source
        //     ? blockData.source
        //     : FileAttachmentArea.DocumentAttachment,
        //   attachmentType: "image",
        //   relationID: documentID,
        //   blockID: blockData.id,
        //   requestType: S3RequestType.GET,
        // });
      }
    } else {
      setTempImage(undefined);
      setS3URL(undefined);
    }
  }, [blockData.image]);

  // useEffect(() => {
  //   if (blockData.image && blockData.image.length > 0) {
  //     execute({
  //       name: blockData.image,
  //       type: 'document',
  //       attachmentArea: FileAttachmentArea.DocumentAttachment,
  //       attachmentType: 'image',
  //       requestType: S3RequestType.GET,
  //       metadata: {
  //         blockID: blockData.id,
  //       },
  //     });
  //   }
  // }, [id]);

  useEffect(() => {
    if (isLoading && loadingRef.current) {
      loadingRef.current?.continuousStart();
    }
  }, [isLoading]);

  useEffect(() => {
    const status = editorStore.subscribe(
      (state) => state.blockStatus[id],
      (block, prevBlock) => {
        if (block?.updateDate !== prevBlock?.updateDate) {
          setBlockStatus(block);
        }
      },
      {
        equalityFn: shallow,
        fireImmediately: true,
      },
    );
    return status;
  }, []);

  useEffect(() => {
    const unsub = editorStore.subscribe(
      (state) => state.currentDocumentData.blocks[id] as ImageBlockData,
      (block, prevBlock) => {
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

  if (!blockData) return <></>;

  const handleClickOutside = (event: any) => {
    event.stopPropagation();
    const sideBarMenu = event.target.closest('#sidebar-container');
    const htmlTargeted = event.target === document.documentElement;
    if (!componentRef.current) return;
    const mainBlock = componentRef.current.closest('.q-block');
    if (sideBarMenu || htmlTargeted) {
      return;
    }
    if (mainBlock) {
      const widgetOutlineContainer = mainBlock.querySelector(
        '.widget-outline-container',
      );
      if (
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        widgetOutlineContainer?.contains(event.target) ||
        mainBlock.contains(event.target)
      )
        return;
    }
    activeListener.current = false;
    document.removeEventListener('mousedown', handleClickOutside);
    setBlockFocus({
      blockID: blockData.id,
      focus: false,
    });
  };

  if (hideEditor) {
    return (
      <div className="q-block">
        <div
          className={cn(
            `margin-wrapper ${blockStatus?.marginHover ? '!bg-orange-100' : ''} ${
              blockStatus?.marginFocus ? '!bg-orange-100' : ''
            }`,
          )}
          style={{
            paddingTop: blockData?.style?.margin?.top ?? 0,
            paddingLeft: blockData?.style?.margin?.left ?? 0,
            paddingRight: blockData?.style?.margin?.right ?? 0,
            paddingBottom: blockData?.style?.margin?.bottom ?? 0,
          }}
        >
          <div
            className={cn(
              `clearfix font-0 relative border-solid border-black 
        ${blockStatus?.borderHover ? '!border-blue-100' : ''} ${
          blockStatus?.borderFocus ? '!border-blue-100' : ''
        } 
        ${blockStatus?.paddingHover ? '!bg-green-100' : ''} ${
          blockStatus?.paddingFocus ? '!bg-green-100' : ''
        } 
        ${blockData.imagePosition ? 'text-' + blockData.imagePosition : ''}`,
            )}
            style={{
              ...(blockData?.style?.background.style === 'color' && {
                backgroundColor:
                  blockData?.style?.background?.color ?? 'transparent',
              }),
              borderTop: blockData?.style?.border?.top ?? 0,
              borderLeft: blockData?.style?.border?.left ?? 0,
              borderRight: blockData?.style?.border?.right ?? 0,
              borderBottom: blockData?.style?.border?.bottom ?? 0,
              borderStyle: blockData?.style?.borderStyle ?? 'solid',
              borderColor: blockData?.style?.borderColor ?? '#000',
              paddingTop: blockData?.style?.padding?.top ?? 0,
              paddingLeft: blockData?.style?.padding?.left ?? 0,
              paddingRight: blockData?.style?.padding?.right ?? 0,
              paddingBottom: blockData?.style?.padding?.bottom ?? 0,
            }}
          >
            <div className="relative inline-block">
              {
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                tempImage || s3URL ? (
                  <Image
                    src={tempImage ?? s3URL}
                    alt={'Image Block image'}
                    onLoadingComplete={(e: any) => {
                      const imageWidth = e.width;
                      const imageHeight = e.height;
                      setImageWidth(imageWidth);
                      setImageHeight(imageHeight);
                    }}
                    onError={(e) => {
                      setS3URL(undefined);
                      setImageMetadata({});
                    }}
                    {...getImageProps(blockData)}
                  />
                ) : (
                  <></>
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <FloatingToolbar
      containerName={'Image Block'}
      id={`${blockData.id}`}
      classNames="q-block group"
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
      blockType="itineraryBlock"
      containerID={containerID}
      pageID={pageID}
    >
      <div
        className={cn(
          blockData?.focused === userID && 'group/imageBlock',
          `margin-wrapper ${blockStatus?.marginHover ? '!bg-orange-100' : ''} ${
            blockStatus?.marginFocus ? '!bg-orange-100' : ''
          }`,
        )}
        style={{
          paddingTop: blockData?.style?.margin?.top ?? 0,
          paddingLeft: blockData?.style?.margin?.left ?? 0,
          paddingRight: blockData?.style?.margin?.right ?? 0,
          paddingBottom: blockData?.style?.margin?.bottom ?? 0,
        }}
        onMouseDown={() => {
          if (!activeListener.current && componentRef.current) {
            activeListener.current = true;
            document.addEventListener('mousedown', handleClickOutside);
            setBlockFocus({
              blockID: blockData.id,
              focus: true,
            });
          }
        }}
      >
        <div
          className={cn(
            `clearfix font-0 relative border-solid border-black 
        ${blockStatus?.borderHover ? '!border-blue-100' : ''} ${
          blockStatus?.borderFocus ? '!border-blue-100' : ''
        } 
        ${blockStatus?.paddingHover ? '!bg-green-100' : ''} ${
          blockStatus?.paddingFocus ? '!bg-green-100' : ''
        } 
        ${blockData.imagePosition ? 'text-' + blockData.imagePosition : ''}`,
          )}
          style={{
            ...(blockData?.style?.background.style === 'color' && {
              backgroundColor:
                blockData?.style?.background?.color ?? 'transparent',
            }),
            borderTop: blockData?.style?.border?.top ?? 0,
            borderLeft: blockData?.style?.border?.left ?? 0,
            borderRight: blockData?.style?.border?.right ?? 0,
            borderBottom: blockData?.style?.border?.bottom ?? 0,
            borderStyle: blockData?.style?.borderStyle ?? 'solid',
            borderColor: blockData?.style?.borderColor ?? '#000',
            paddingTop: blockData?.style?.padding?.top ?? 0,
            paddingLeft: blockData?.style?.padding?.left ?? 0,
            paddingRight: blockData?.style?.padding?.right ?? 0,
            paddingBottom: blockData?.style?.padding?.bottom ?? 0,
          }}
        >
          {
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            tempImage || s3URL ? (
              isLoading || !editorEnabled ? (
                <Resizeable
                  callback={(result: any) => {
                    if (result.type === 'finish') {
                      setElementWidth(undefined);
                      setElementHeight(undefined);
                      saveBlock({
                        blockID: blockData.id,
                        data: {
                          width: result.width,
                          height: result.height,
                        },
                      });
                    } else if (result.type === 'dragging') {
                      setElementWidth(result.width);
                      setElementHeight(result.height);
                    }
                  }}
                >
                  <FloatingToolbar
                    containerName={'Image'}
                    id={`${blockData.id}`}
                    classNames="q-block group"
                    allowMove={false}
                    centered={true}
                    toolbar={
                      <ToolbarImageOptions
                        blockData={blockData}
                        pinturaCallback={openPinturaEditor}
                        unsplashCallback={processUnsplashBlobForUpload}
                      />
                    }
                    blockType="imageBlock"
                  >
                    <div
                      className={cn(`overlay-wrapper`)}
                      style={{
                        ...(blockData?.style?.overlay?.style === 'color' && {
                          backgroundColor:
                            blockData?.style?.overlay?.color ?? 'transparent',
                        }),
                      }}
                    ></div>

                    <Image
                      src={tempImage ?? s3URL}
                      alt={'Image Block image'}
                      onLoadingComplete={(e: any) => {
                        const imageWidth = e.width;
                        const imageHeight = e.height;
                        setImageWidth(imageWidth);
                        setImageHeight(imageHeight);
                      }}
                      onError={(e) => {
                        setS3URL(undefined);
                        setImageMetadata({});
                      }}
                      {...getImageProps(blockData)}
                      onDoubleClick={(e) => {
                        console.log('focusing');
                        if (!editorEnabled && (tempImage ?? s3URL)) {
                          if (
                            s3URL &&
                            (e.currentTarget.width < 300 ||
                              e.currentTarget.height < 300)
                          ) {
                            setEditorImage(s3URL);
                            openPinturaEditor();
                          } else {
                            setEditorEnabled(true);
                            setEditorImage(tempImage ?? s3URL);
                          }
                        }
                      }}
                    />
                  </FloatingToolbar>
                </Resizeable>
              ) : (
                <div
                  className="relative inline-block"
                  style={{
                    height: imageHeight + 'px',
                    width: imageWidth + 'px',
                    maxWidth: '100%',
                    maxHeight: '100%',
                  }}
                >
                  <div
                    className={cn(
                      `overlay-wrapper`,
                      'pointer-events-none absolute bottom-0 left-0 right-0 top-0',
                    )}
                    style={{
                      backgroundColor:
                        blockData?.style?.overlay?.color ?? 'transparent',
                    }}
                  ></div>
                  <PinturaEditorOverlay
                    src={tempImage ?? s3URL}
                    ref={overlayRef}
                    onClose={() => {
                      setEditorEnabled(false);
                    }}
                    onProcessstart={() => {
                      const editor = overlayRef?.current?.editor;
                      const historyLength = editor?.history.length ?? 1;
                      const historyIndex = editor?.history.index;
                      console.log('History Length' + historyLength);
                      console.log('History Index' + historyIndex);
                      if (historyLength < 2 || historyIndex === 0) {
                        setEditorEnabled(false);
                        editor?.abortProcessImage();
                        editor?.close();
                      }
                    }}
                    onProcess={onPinturaProcess}
                    onLoaderror={() => {
                      execute({
                        name: blockData.image,
                        type: 'document',
                        attachmentArea: FileAttachmentArea.DocumentAttachment,
                        attachmentType: 'image',
                        relationID: documentID,
                        requestType: S3RequestType.GET,
                        blockID: blockData.id,
                      });
                    }}
                    {...overlayConfig}
                    willRenderToolbar={willRenderOverlayToolbar}
                  ></PinturaEditorOverlay>
                </div>
              )
            ) : (
              <div
                {...getRootProps({
                  className: `dropzone relative imageUpload p-5 text-center`,
                })}
                onClick={(e) => {
                  setUnsplashPickerBlockLinkId(blockData.id);
                  setUnsplashCallback({
                    callback: processUnsplashBlobForUpload,
                  });
                }}
              >
                <input {...getInputProps()} />
                <p className="text-sm italic">
                  {blockData.hovered ? (
                    <FontAwesomeIcon
                      icon={faUpload}
                      size="xs"
                      className={'imageUploadIcon ml-1.5 mr-1 text-neutral-500'}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faImage}
                      size="xs"
                      className={'imageUploadIcon ml-1.5 mr-1 text-neutral-500'}
                    />
                  )}
                  Click to upload or drag image here
                </p>
              </div>
            )
          }
          {isLoading && imageMetadata && (
            <div
              style={{
                width: imageMetadata.width,
                maxWidth: '100%',
                maxHeight: '100%',
                position: 'absolute',
                top: '0',
              }}
            >
              <LoadingBar
                ref={loadingRef}
                color={'#FF0000'}
                containerStyle={{
                  position: 'relative',
                  top: 'initial',
                  left: 'initial',
                }}
                shadow={false}
              />
              <ImageItemLoader
                imageWidth={imageMetadata.width}
                imageHeight={imageMetadata.height}
                foregroundOpacity={0.5}
                style={{ maxWidth: '100%' }}
              ></ImageItemLoader>
            </div>
          )}
        </div>
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
      </div>
      {/*<EditorContent editor={editor} className="sss" />*/}
    </FloatingToolbar>
  );
};

export default ImageBlock;
