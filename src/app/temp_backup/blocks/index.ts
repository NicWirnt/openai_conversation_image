import type { BlockType } from "@/types/blocks";
import {
  faAlignJustify,
  faCloud,
  faExpandWide,
  faFileDashedLine,
  faFileSpreadsheet,
  faHeading,
  faImage,
  faImages,
  faPaperclip,
  faPlaneDeparture,
  faSignature,
  faTags,
  faVideo,
  type IconDefinition,
} from "@fortawesome/pro-solid-svg-icons";

export interface BlockOptionsType {
  icon: IconDefinition;
  name: string;
  type: BlockType;
  featureSet: "base" | "itinerary" | "telco";
}

export const blockOptions: BlockOptionsType[] = [
  {
    icon: faTags,
    name: "Pricing Table",
    type: "pricingTable",
    featureSet: "base",
  },
  {
    icon: faHeading,
    name: "Heading",
    type: "headingBlock",
    featureSet: "base",
  },
  {
    icon: faAlignJustify,
    name: "Text",
    type: "textBlock",
    featureSet: "base",
  },
  {
    icon: faImage,
    name: "Image",
    type: "imageBlock",
    featureSet: "base",
  },
  {
    icon: faImages,
    name: "Gallery",
    type: "galleryBlock",
    featureSet: "base",
  },
  {
    icon: faVideo,
    name: "Video",
    type: "videoBlock",
    featureSet: "base",
  },
  {
    icon: faPaperclip,
    name: "Attachment",
    type: "attachmentBlock",
    featureSet: "base",
  },
  {
    icon: faSignature,
    name: "Signature",
    type: "eSignBlock",
    featureSet: "base",
  },
  {
    icon: faFileSpreadsheet,
    name: "Form",
    type: "formBlock",
    featureSet: "base",
  },
  {
    icon: faFileSpreadsheet,
    name: "Spreadsheet",
    type: "spreadsheetBlock",
    featureSet: "base",
  },
  {
    icon: faExpandWide,
    name: "Empty Space",
    type: "emptySpaceBlock",
    featureSet: "base",
  },
  {
    icon: faPlaneDeparture,
    name: "Itinerary",
    type: "itineraryBlock",
    featureSet: "itinerary",
  },
  {
    icon: faFileDashedLine,
    name: "Page Break",
    type: "pageBreakBlock",
    featureSet: "base",
  },
  {
    icon:faCloud,
    name:"Weather",
    type:"weatherBlock",
    featureSet:"base",
  }
 
];

export const containerBlockOptions: BlockOptionsType[] = [
  {
    icon: faHeading,
    name: "Heading",
    type: "headingBlock",
    featureSet: "base",
  },
  {
    icon: faAlignJustify,
    name: "Text",
    type: "textBlock",
    featureSet: "base",
  },
  {
    icon: faImage,
    name: "Image",
    type: "imageBlock",
    featureSet: "base",
  },
  {
    icon: faImages,
    name: "Gallery",
    type: "galleryBlock",
    featureSet: "base",
  },
  {
    icon: faVideo,
    name: "Video",
    type: "videoBlock",
    featureSet: "base",
  },
  {
    icon: faPaperclip,
    name: "Attachment",
    type: "attachmentBlock",
    featureSet: "base",
  },
  {
    icon: faSignature,
    name: "Signature",
    type: "eSignBlock",
    featureSet: "base",
  },
  {
    icon: faFileSpreadsheet,
    name: "Form",
    type: "formBlock",
    featureSet: "base",
  },
  {
    icon: faExpandWide,
    name: "Empty Space",
    type: "emptySpaceBlock",
    featureSet: "base",
  },
  {
    icon:faCloud,
    name:"Weather",
    type:"weatherBlock",
    featureSet:"base",
  }
];
