"use client";

import { useEditor } from "@/providers/stores/editor.provider";
import type {
  PricingTableData,
  RecuringMultiplierPricingTableColumn,
} from "@/types/blocks/pricingTable";
import { Dispatch, SetStateAction, useMemo, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import DetailedTotalsTable from "./totals/detailed";
import SimplifiedTotalsTable from "./totals/simplified";

const TotalsTable = ({
  pricingData,
  editingRow,
  setEditingRow,
}: {
  pricingData: PricingTableData;
  editingRow: string | undefined;
  setEditingRow: Dispatch<SetStateAction<string | undefined>>;
}) => {
  const editorStore = useEditor();
  const addCustomRow = editorStore(useShallow((state) => state.addCustomRow));
  const hideEditor = editorStore((state) => state.hideEditor);
  const setBlockFocus = editorStore(useShallow((state) => state.setBlockFocus));
  const userID = editorStore(useShallow((state) => state.userID));
  const TotalsTable = useRef<HTMLDivElement>(null);

  const hasRecuringMultiplier = useMemo(() => {
    const column = pricingData.data?.table?.columns?.find(
      (column) => column.type === "recuringMultiplier",
    );
    if (column) return column as RecuringMultiplierPricingTableColumn;
    return undefined;
  }, [pricingData.data?.table?.columns?.length]);

  const headerStyle = pricingData.style?.totalRow;

  if (pricingData?.settings?.totalsTheme === "detailed") {
    return (
      <DetailedTotalsTable
        focused={pricingData.focused === userID}
        hasRecuringMultiplier={hasRecuringMultiplier}
        pricingData={pricingData}
      />
    );
  }

  if (pricingData?.settings?.totalsTheme === "simplified") {
    return (
      <SimplifiedTotalsTable
        focused={pricingData.focused === userID}
        pricingData={pricingData}
      />
    );
  }
  return <></>;
};

export default TotalsTable;
