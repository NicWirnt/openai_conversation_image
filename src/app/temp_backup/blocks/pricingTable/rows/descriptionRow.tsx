import { cn } from "@/lib/utils";
import { useEditor } from "@/providers/stores/editor.provider";
import {
  DescriptionCell,
  PricingTableColumn,
  ProductRow,
  TaxPricingTableColumn,
  TotalPricingTableColumn,
} from "@/types/blocks/pricingTable";
import { PricingTableRowStyles } from "@/types/document";
import _ from "lodash";
import {
  Dispatch,
  SetStateAction,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import { useShallow } from "zustand/react/shallow";

type DescriptionRowProps = {
  rowData: ProductRow;
  tableId: string;
  columnListData:
    | PricingTableColumn[]
    | TaxPricingTableColumn[]
    | TotalPricingTableColumn[];
  styles: PricingTableRowStyles;
  hideEditor: boolean;
  focused: boolean;
  editing: boolean;
  setEditing: Dispatch<SetStateAction<string | undefined>>;
  forceShowDescription: boolean;
  setForceShowDescription: Dispatch<SetStateAction<boolean>>;
};

const DescriptionRow = ({
  tableId,
  rowData,
  columnListData,
  styles,
  hideEditor,
  focused,
  editing,
  setEditing,
  forceShowDescription,
  setForceShowDescription,
}: DescriptionRowProps) => {
  const editorStore = useEditor();
  const updateProductDescriptionCell = editorStore(
    useShallow((state) => state.updateProductDescriptionCell),
  );
  const descriptionColumn = columnListData?.find(
    (col) => col.type === "description",
  );
  const descriptionCell = rowData?.cells?.find(
    (row) => row.columnID === descriptionColumn?.id,
  ) as DescriptionCell;

  const [currentValue, setCurrentValue] = useState<string | undefined>(
    undefined,
  );

  const descriptionInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (forceShowDescription) {
      // Focus on description input if forceShowDescription is true with a delay of 100ms
      setTimeout(() => {
        const descriptionInput = descriptionInputRef?.current;
        if (descriptionInput) {
          descriptionInput.focus();
        }
      }, 100);
    }
  }, [descriptionInputRef?.current, forceShowDescription]);

  useEffect(() => {
    if (!editing) {
      setCurrentValue(undefined);
      setForceShowDescription(false);
    }
  }, [editing]);

  if (!forceShowDescription && descriptionCell?.description?.length < 1)
    return <></>;

  return (
    <tr className="relative" key={rowData?.id}>
      <td
        colSpan={columnListData.length}
        className={cn(
          "group/cell relative",
          editing ? "!bg-blue-100 !bg-opacity-30" : "",
        )}
        style={{
          color: styles.descriptionTypography.color,
          backgroundColor: styles.background,
          fontSize: `${styles.descriptionTypography.fontSize}px`,
          fontWeight: styles.descriptionTypography.fontWeight,
          textAlign: styles.descriptionTypography.alignment,
          paddingTop: styles.padding.top,
          paddingBottom: styles.padding.bottom,
          paddingLeft: styles.padding.left,
          paddingRight: styles.padding.right,
          borderBottomWidth: styles.borders.bottom.width,
          borderBottomStyle: styles.borders.bottom.style,
          borderBottomColor: styles.borders.bottom.color,

          // have one here for the alternative row color
        }}
      >
        {editing && focused ? (
          <input
            ref={descriptionInputRef}
            className="rounded-xs w-full border-none bg-neutral-100 px-2 py-0 focus:outline-none focus:ring-0"
            type="text"
            placeholder="Type description here..."
            value={currentValue ?? descriptionCell?.description} // Ensure value is treated as a string
            onChange={(e) => setCurrentValue(e.target.value)} // Directly pass string value
            onBlur={() => {
              if (currentValue !== undefined) {
                updateProductDescriptionCell({
                  columnId: descriptionColumn!.id,
                  rowId: rowData.id,
                  value: currentValue,
                  blockId: tableId,
                });
                setCurrentValue(undefined);
              }
              setForceShowDescription(false);
            }}
          />
        ) : (
          <div className="">{descriptionCell?.description ?? ""}</div>
        )}
      </td>
    </tr>
  );
};

const isRowEqual = (
  prevProps: DescriptionRowProps,
  nextProps: DescriptionRowProps,
) => {
  // Check for equality on all props except 'page'

  if (prevProps.forceShowDescription !== nextProps.forceShowDescription)
    return false;

  if (!_.isEqual(prevProps.styles, nextProps.styles)) return false;
  if (prevProps.focused !== nextProps.focused) return false;
  if (prevProps.hideEditor !== nextProps.hideEditor) return false;
  if (prevProps.editing !== nextProps.editing) return false;
  return _.isEqual(prevProps.rowData, nextProps.rowData);
};

export const DescriptionRowMemoized = memo(DescriptionRow, isRowEqual);
