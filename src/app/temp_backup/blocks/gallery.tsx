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
import {
  faClone,
  faCog,
  faColumns,
  faCopy,
  faImage,
  faImages,
  faLockOpen,
  faObjectsAlignCenterHorizontal,
  faObjectsAlignLeft,
  faObjectsAlignRight,
  faPencil,
  faRefresh,
  faTrash,
  faUpload,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAction } from 'next-safe-action/hooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar';
import { useShallow } from 'zustand/react/shallow';
import { shallow } from 'zustand/shallow';
import FloatingToolbar from '../editorUIHelpers/floatingToolbar';
import BlockOutlineContainer from './helpers/blockOutlineContainer';

// Import the editor styles
import '@pqina/pintura/pintura.css';

import { cn } from '@/lib/utils';
import {
  type GalleryBlockData,
  type GalleryImageData,
} from '@/types/blocks/gallery';
import { ImageSource } from '@pqina/pintura';
// import { gridLayouts } from '@/types/blocks/gallery';

type GalleryBlockProps = {
  id: string;
  columnID: string;
  containerID: string;
  pageID: string;
  lastBlock: boolean;
  isFloating?: boolean;
  // infer types with `typeof`
};

type GalleryImageProps = {
  id: string;
  galleryIndex: number;
  imageData: GalleryImageData | undefined;
  // infer types with `typeof`
};

export const gridLayouts = [
  { name: 'Layout 1', value: ['area1'], areas: 1 },
  { name: 'Layout 2', value: ['area1 area1', 'area2 area2'], areas: 2 },
  { name: 'Layout 3', value: ['area1 area2', 'area1 area2'], areas: 2 },
  {
    name: 'Layout 4',
    value: ['area1 area2 area3', 'area1 area2 area3', 'area1 area2 area3'],
    areas: 3,
  },
  {
    name: 'Layout 5',
    value: ['area1 area1 area1', 'area2 area2 area2', 'area3 area3 area3'],
    areas: 3,
  },
  { name: 'Layout 6', value: ['area1 area2', 'area3 area3'], areas: 3 },
  { name: 'Layout 7', value: ['area1 area1', 'area2 area3'], areas: 3 },
  { name: 'Layout 8', value: ['area1 area2', 'area3 area2'], areas: 3 },
  { name: 'Layout 9', value: ['area1 area2', 'area1 area3'], areas: 3 },
  { name: 'Layout 10', value: ['area1 area2', 'area3 area4'], areas: 4 },
  {
    name: 'Layout 11',
    value: ['area1 area2 area3 area4'],
    areas: 4,
  },
  {
    name: 'Layout 12',
    value: ['area1 area1', 'area2 area2', 'area3 area3', 'area4 area4'],
    areas: 4,
  },
  {
    name: 'Layout 13',
    value: ['area1 area2 area3', 'area1 area4 area3'],
    areas: 4,
  },
  {
    name: 'Layout 14',
    value: ['area1 area2 area3', 'area4 area2 area3'],
    areas: 4,
  },
  {
    name: 'Layout 15',
    value: ['area1 area1', 'area1 area1', 'area2 area3', 'area2 area4'],
    areas: 4,
  },
  {
    name: 'Layout 16',
    value: ['area1 area2', 'area3 area2', 'area4 area4', 'area4 area4'],
    areas: 4,
  },
  {
    name: 'Layout 17',
    value: [
      'area1 area2 area3 area3',
      'area1 area2 area3 area3',
      'area4 area4 area3 area3',
      'area4 area4 area3 area3',
    ],
    areas: 4,
  },
  {
    name: 'Layout 18',
    value: [
      'area1 area1 area2 area2',
      'area1 area1 area2 area2',
      'area3 area4 area2 area2',
      'area3 area4 area2 area2',
    ],
    areas: 4,
  },
  {
    name: 'Layout 19',
    value: ['area1 area1 area1', 'area2 area3 area4'],
    areas: 4,
  },
  {
    name: 'Layout 20',
    value: ['area1 area2 area3', 'area4 area4 area4'],
    areas: 4,
  },
  {
    name: 'Layout 21',
    value: ['area1 area2', 'area1 area3', 'area1 area4'],
    areas: 4,
  },
  {
    name: 'Layout 22',
    value: ['area1 area2', 'area3 area2', 'area4 area2'],
    areas: 4,
  },
  {
    name: 'Layout 23',
    value: ['area1 area1', 'area2 area3', 'area4 area4'],
    areas: 4,
  },
  {
    name: 'Layout 24',
    value: ['area1 area1', 'area2 area2', 'area3 area4'],
    areas: 4,
  },
];

const widgetProperties = {
  width: '100%',
  type: 'fixed',
};

const ToolbarImageOptions = ({
  blockData,
  galleryIndex,
  unsplashCallback,
  pinturaCallback,
}: {
  blockData: GalleryBlockData;
  galleryIndex: number;
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
              const gallery = blockData.images;
              gallery[galleryIndex] = undefined;
              saveBlock({
                blockID: blockData.id,
                data: {
                  images: gallery,
                  // imageWidth: input.metadata.width,
                  // imageHeight: input.metadata.height,
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

const ToolbarOptions = ({
  blockData,
  columnID,
  containerID,
  pageID,
}: {
  blockData: GalleryBlockData;
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
              // copyBlock({
              //   blockData: blockData,
              // });
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
          <p>Copy Gallery Block</p>
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
          <p>Clone Gallery Block</p>
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
                  type: 'galleryBlock',
                  name: 'Gallery',
                  icon: (
                    <FontAwesomeIcon
                      icon={faImages}
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
          <p>Gallery Settings</p>
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

const GalleryImage = ({ id, galleryIndex, imageData }: GalleryImageProps) => {
  const editorStore = useEditor();
  const saveBlock = editorStore(useShallow((state) => state.saveBlock));

  const [blockData, setBlockData] = useState<GalleryBlockData>(
    editorStore.getState().currentDocumentData.blocks[id] as GalleryBlockData,
  );
  const [blockStatus, setBlockStatus] = useState<any>(
    editorStore.getState().blockStatus[id],
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [s3URL, setS3URL] = useState<ImageSource>();
  const [currentImage, setCurrentImage] = useState<any>();
  const [dataBlob, setDataBlob] = useState<ImageSource>();

  const [imageMetadata, setImageMetadata] = useState<ImageMetadata>({});

  const [imageWidth, setImageWidth] = useState<number>();
  const [imageHeight, setImageHeight] = useState<number>();
  const [elementWidth, setElementWidth] = useState<number | undefined>();
  const [elementHeight, setElementHeight] = useState<number>();
  const [editorEnabled, setEditorEnabled] = useState<boolean>(false);
  const [editorImage, setEditorImage] = useState<ImageSource>();

  const setUnsplashPickerBlockLinkId = editorStore(
    useShallow((state) => state.setUnsplashPickerBlockLinkId),
  );
  const setUnsplashCallback = editorStore(
    useShallow((state) => state.setUnsplashCallback),
  );

  const documentID = editorStore(useShallow((state) => state.documentID));
  const setBlockFocus = editorStore(useShallow((state) => state.setBlockFocus));
  const setBlockHover = editorStore(useShallow((state) => state.setBlockHover));
  const userID = editorStore(useShallow((state) => state.userID));

  const loadingRef = useRef<LoadingBarRef>(null);
  // const imageRef = useRef<HTMLIma>(null);

  let uploadFile: File | null;

  const { execute, result, status } = useAction(
    createS3PresignedUrlForAttachments,
    {
      onSuccess(data, input, reset) {
        switch (input.requestType as S3RequestType) {
          case S3RequestType.GET:
            const url = data?.url;
            console.log(url);
            setS3URL(url);
            loadingRef.current?.complete;
            if (url && (!imageMetadata.width || !imageMetadata.height)) {
              processImageMetadata(url);
            }
            break;
          case S3RequestType.PUT:
            const uploadUrl = data?.url;
            if (uploadUrl && uploadFile) {
              fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                  'Content-Type': uploadFile.type,
                  'Access-Control-Allow-Origin': '*',
                },
                body: uploadFile,
              })
                .then((response) => {
                  const gallery = blockData.images;
                  const newGalleryData = {
                    image: data?.path,
                    metadata: input.metadata,
                    s3ID: data?.attachmentsData.id,
                  } as GalleryImageData;
                  gallery[galleryIndex] = newGalleryData;
                  saveBlock({
                    blockID: blockData.id,
                    data: {
                      images: gallery,
                      // imageWidth: input.metadata.width,
                      // imageHeight: input.metadata.height,
                    },
                  });
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

  const processImageForUpload = (image: any) => {
    const img = document.createElement('img');

    img.onload = function (image) {
      loadingRef.current?.continuousStart(20, 0.5);
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
        requestType: S3RequestType.PUT,
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

    const reader = new FileReader();
    reader.onloadend = function (ended) {
      img.src = ended?.target?.result?.toString() ?? '';
    };
    reader.readAsDataURL(image);
  };

  const processImageMetadata = (image: File | string) => {
    const img = document.createElement('img');

    if (image instanceof File) {
      const reader = new FileReader();
      reader.onloadend = function (ended) {
        img.src = ended?.target?.result?.toString() ?? '';
      };
      reader.readAsDataURL(image);
    } else {
      img.src = image;
    }

    return (img.onload = function (imageData) {
      const imageElement = imageData.currentTarget as HTMLImageElement;
      const imageMetadata: any = {};
      imageMetadata.width = imageElement.width;
      imageMetadata.height = imageElement.height;
      if (image instanceof File) {
        imageMetadata.type = uploadFile?.type;
        imageMetadata.size = uploadFile?.size;
        imageMetadata.name = uploadFile?.name;
      }
      setImageMetadata({
        width: imageElement.width,
        height: imageElement.height,
      });
      return imageMetadata;
      // saveBlock({
      //   blockID: blockData.id,
      //   data: {
      //     imageWidth: imageElement.width,
      //     imageHeight: imageElement.height,
      //   },
      // });
    });
  };

  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles[0]);
    const file = acceptedFiles[0];
    setDataBlob(undefined);
    setS3URL(undefined);
    setImageMetadata({});
    uploadFile = file;
    const imageData = URL.createObjectURL(file);
    setDataBlob(imageData);
    processImageForUpload(file);
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

  const getImageProps = (image: GalleryImageData) => {
    const imageProps: any = {};
    const imageWidth =
      elementWidth ?? image?.metadata?.width ?? imageMetadata.width;
    const imageHeight =
      elementHeight ?? image?.metadata?.height ?? imageMetadata.height;
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
    return imageProps;
  };

  // useEffect(() => {
  //   if (blockData.images && blockData.images.length > 0) {
  //     console.log(blockData.image);
  //     console.log(s3URL);
  //     if(!s3URL) {
  //       execute({
  //         name: blockData.image,
  //         type: 'document',
  //         attachmentArea: (blockData.source ? blockData.source : FileAttachmentArea.DocumentAttachment),
  //         attachmentType: 'image',
  //         relationID: documentID,
  //         blockID: blockData.id,
  //         requestType: S3RequestType.GET,
  //       });
  //     }
  //   }
  // }, [blockData.image]);

  useEffect(() => {
    if (imageData?.image) {
      // setTimeout(function () {
      //   console.log("retrieving image");
      //   if (imageData?.image === currentImage?.image) return;
      //   setCurrentImage(imageData);
      //   loadingRef.current?.continuousStart(20, 0.5);
      //   const url =
      //     "https://quotecloud-v2-ap-southeast-2.s3.ap-southeast-2.amazonaws.com/" +
      //     imageData.image;
      //   setS3URL(url);
      //   // execute({
      //   //   name: imageData.image,
      //   //   type: "document",
      //   //   attachmentArea: FileAttachmentArea.DocumentAttachment,
      //   //   attachmentType: "image",
      //   //   requestType: S3RequestType.GET,
      //   //   relationID: documentID,
      //   //   assetID: imageData?.s3ID,
      //   // });
      //   setImageMetadata(imageData.metadata);
      // }, 5000);
      console.log('retrieving image');
      if (imageData?.image === currentImage?.image) return;
      setCurrentImage(imageData);
      loadingRef.current?.continuousStart(20, 0.5);
      const url =
        'https://quotecloud-v2-ap-southeast-2.s3.ap-southeast-2.amazonaws.com/' +
        imageData.image;
      setS3URL(url);
      // execute({
      //   name: imageData.image,
      //   type: "document",
      //   attachmentArea: FileAttachmentArea.DocumentAttachment,
      //   attachmentType: "image",
      //   requestType: S3RequestType.GET,
      //   relationID: documentID,
      //   assetID: imageData?.s3ID,
      // });
      setImageMetadata(imageData.metadata);
    } else {
      setS3URL(undefined);
    }
  }, [imageData]);

  useEffect(() => {
    if (isLoading && loadingRef.current) {
      loadingRef.current?.continuousStart();
    }
  }, [isLoading]);

  if (!blockData) return <></>;

  return (
    <div
      className="grid-area relative"
      style={{
        gridArea: 'area' + (galleryIndex + 1),
      }}
    >
      {imageData ? (
        imageData?.tempImage ?? s3URL ? (
          <FloatingToolbar
            containerName={'Gallery Image'}
            id={`${blockData.id}_${galleryIndex}`}
            classNames="q-block group h-full"
            allowMove={false}
            centered={true}
            toolbar={
              <ToolbarImageOptions
                galleryIndex={galleryIndex}
                blockData={blockData}
                unsplashCallback={processUnsplashBlobForUpload}
              />
            }
            blockType="galleryBlock"
          >
            <div className="h-full w-full">
              <div className={cn(`overlay-wrapper`)} style={{}}></div>
              <img
                src={imageData?.tempImage ?? s3URL?.toString() ?? ''}
                className="h-full w-full object-cover"
                alt={'Image Block image'}
                onLoad={(e: any) => {
                  const imageWidth = e.width;
                  const imageHeight = e.height;
                  setImageWidth(imageWidth);
                  setImageHeight(imageHeight);
                }}
                onError={(e) => {
                  setDataBlob(undefined);
                  setS3URL(undefined);
                  setImageMetadata({});
                }}
                // {...getImageProps(imageData)}
                // onMouseDown={(e) => {}}
              />
            </div>
          </FloatingToolbar>
        ) : imageData.metadata ? (
          <div
            style={{
              width: imageData.metadata.width,
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
              imageWidth={imageData.metadata.width}
              imageHeight={imageData.metadata.height}
              foregroundOpacity={0.5}
              style={{ maxWidth: '100%' }}
            ></ImageItemLoader>
          </div>
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
            <div className={cn(`overlay-wrapper`)} style={{}}></div>
          </div>
        )
      ) : (
        <div
          {...getRootProps({
            className: `dropzone relative imageUpload p-5 h-full w-full text-center flex justify-center items-center`,
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
                className={'imageUploadIcon ml-1.5 mr-1 text-neutral-500'}
              />
            ) : (
              <FontAwesomeIcon
                icon={faImage}
                className={'imageUploadIcon ml-1.5 mr-1 text-neutral-500'}
              />
            )}
            Click to upload or drag image here
          </p>
        </div>
      )}
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
  );
};

const GalleryBlock = ({
  id,
  columnID,
  containerID,
  pageID,
  isFloating = false,
}: GalleryBlockProps) => {
  const editorStore = useEditor();
  const hideEditor = editorStore(useShallow((state) => state.hideEditor));
  const saveBlock = editorStore(useShallow((state) => state.saveBlock));

  const [blockData, setBlockData] = useState<GalleryBlockData>(
    editorStore.getState().currentDocumentData.blocks[id] as GalleryBlockData,
  );
  const [blockStatus, setBlockStatus] = useState<any>(
    editorStore.getState().blockStatus[id],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const documentID = editorStore(useShallow((state) => state.documentID));
  const setBlockFocus = editorStore(useShallow((state) => state.setBlockFocus));
  const setBlockHover = editorStore(useShallow((state) => state.setBlockHover));
  const userID = editorStore(useShallow((state) => state.userID));

  const componentRef = useRef<HTMLDivElement>(null);
  const activeListener = useRef<boolean>(false);
  const loadingRef = useRef<LoadingBarRef>(null);
  // const imageRef = useRef<HTMLIma>(null);

  const [gridLayout, setGridLayout] = useState<any>();

  let uploadFile: File | null;

  const setSideBarContext = useEditor()((state) => state.setSideBarContext);
  const currentDocument = useEditor()(
    (state) => state.documentList[state.currentVersion]!,
  );

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

  // useEffect(() => {
  //   if (blockData.images && blockData.images.length > 0) {
  //     console.log(blockData.image);
  //     console.log(s3URL);
  //     if(!s3URL) {
  //       execute({
  //         name: blockData.image,
  //         type: 'document',
  //         attachmentArea: (blockData.source ? blockData.source : FileAttachmentArea.DocumentAttachment),
  //         attachmentType: 'image',
  //         relationID: documentID,
  //         blockID: blockData.id,
  //         requestType: S3RequestType.GET,
  //       });
  //     }
  //   }
  // }, [blockData.image]);

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
    const layout = gridLayouts.filter((element) => {
      return element.name === blockData?.style?.galleryStyle;
    })[0];
    if (layout) {
      setGridLayout(layout);
      if (layout.areas > blockData.images.length) {
        while (blockData.images.length < layout.areas) {
          blockData.images.push(undefined);
        }
        setBlockData({ ...blockData });
      }
      // if (layout.areas < blockData.images.length) {
      //   while (blockData.images.length > layout.areas) {
      //     blockData.images.pop();
      //   }
      //   setBlockData({ ...blockData });
      // }
    }
  }, [blockData?.style?.galleryStyle]);

  useEffect(() => {
    if (isLoading && loadingRef.current) {
      loadingRef.current?.continuousStart(20, 0.5);
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
      (state) => state.currentDocumentData.blocks[id] as GalleryBlockData,
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

  useEffect(() => {
    if (blockData?.id) {
      setBlockFocus({
        blockID: blockData.id,
        focus: false,
      });
      setBlockData({ ...blockData, focused: undefined });
    }
  }, []);

  if (!blockData) return <></>;

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
              `clearfix font-0 relative border-solid border-black bg-white
        ${blockStatus?.borderHover ? '!border-blue-100' : ''} ${
          blockStatus?.borderFocus ? '!border-blue-100' : ''
        } 
        ${blockStatus?.paddingHover ? '!bg-green-100' : ''} ${
          blockStatus?.paddingFocus ? '!bg-green-100' : ''
        }`,
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
            {gridLayout && (
              <div
                className={`grid grid-${gridLayout.name.toLowerCase().replace(' ', '-')}`}
                style={{
                  gridTemplateAreas: gridLayout.value
                    .map((layout: string, i: number) => {
                      return `"${layout}"`;
                    })
                    .join('\r\n'),
                  gridAutoColumns: 'minmax(0, 1fr)',
                  gridAutoRows: 'minmax(0, 1fr)',
                  gap: blockData.style.gap ? blockData.style.gap + 'px' : '4px',
                  height: blockData.style.height
                    ? blockData.style.height + 'px'
                    : 'auto',
                }}
              >
                {[...Array(gridLayout.areas)].map((element, i) => {
                  return (
                    <GalleryImage
                      key={i}
                      id={blockData.id}
                      galleryIndex={i}
                      imageData={blockData.images[i]}
                    />
                  );
                })}
              </div>
            )}
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
      toolbar={
        <ToolbarOptions
          blockData={blockData}
          columnID={columnID}
          containerID={containerID}
          pageID={pageID}
        />
      }
      blockType="itineraryBlock"
      containerID={containerID}
      pageID={pageID}
    >
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
            `clearfix font-0 relative border-solid border-black bg-white
        ${blockStatus?.borderHover ? '!border-blue-100' : ''} ${
          blockStatus?.borderFocus ? '!border-blue-100' : ''
        } 
        ${blockStatus?.paddingHover ? '!bg-green-100' : ''} ${
          blockStatus?.paddingFocus ? '!bg-green-100' : ''
        }`,
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
          {gridLayout && (
            <div
              className={`grid grid-${gridLayout.name.toLowerCase().replace(' ', '-')}`}
              style={{
                gridTemplateAreas: gridLayout.value
                  .map((layout: string, i: number) => {
                    return `"${layout}"`;
                  })
                  .join('\r\n'),
                gridAutoColumns: 'minmax(0, 1fr)',
                gridAutoRows: 'minmax(0, 1fr)',
                gap: blockData.style.gap ? blockData.style.gap + 'px' : '4px',
                height: blockData.style.height
                  ? blockData.style.height + 'px'
                  : 'auto',
              }}
            >
              {[...Array(gridLayout.areas)].map((element, i) => {
                return (
                  <GalleryImage
                    key={i}
                    id={blockData.id}
                    galleryIndex={i}
                    imageData={blockData.images[i]}
                  />
                );
              })}
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

export default GalleryBlock;
