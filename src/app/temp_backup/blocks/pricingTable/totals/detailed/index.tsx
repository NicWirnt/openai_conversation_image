import { cn } from "@/lib/utils";
import type {
  PricingTableData,
  RecuringMultiplierPricingTableColumn,
} from "@/types/blocks/pricingTable";
import DetailedTotalsHeaderRow from "./detailedHeaderRow";
import FullTermCostRow from "./fullTermCostRow";
import MinimumCostRow from "./minimumCostRow";
import OneOffCostRow from "./oneOffCostRow";
import TotalColumnAddDropdown from "./totalColumnAddDropdown";

const DetailedTotalsTable = ({
  pricingData,
  focused,
  hasRecuringMultiplier,
}: {
  pricingData: PricingTableData;
  focused: boolean;
  hasRecuringMultiplier: RecuringMultiplierPricingTableColumn | undefined;
}) => {
  return (
    <table
      className={cn(
        "group/table relative mt-6 w-fit",
        pricingData?.style?.totalAlignment === "center" && "mx-auto",
        pricingData?.style?.totalAlignment === "right" && "ml-auto",
        pricingData?.style?.totalAlignment === "left" && "mr-auto",
      )}
    >
      <tbody>
        {/* Totals header row */}
        <DetailedTotalsHeaderRow pricingData={pricingData} focused={false} />
        {hasRecuringMultiplier && (
          <>
            <MinimumCostRow
              pricingData={pricingData}
              focused={focused}
              hasRecuringMultiplier={hasRecuringMultiplier}
            />
            <FullTermCostRow
              pricingData={pricingData}
              focused={focused}
              hasRecuringMultiplier={hasRecuringMultiplier}
            />
            <OneOffCostRow pricingData={pricingData} focused={focused} />
          </>
        )}
        {!hasRecuringMultiplier && (
          <>
            <OneOffCostRow pricingData={pricingData} focused={focused} />
          </>
        )}
      </tbody>
      {focused && (
        <div className="absolute bottom-[2px] right-[-3px] top-[-1px] z-10 flex  w-[4px] items-center bg-green-600 bg-opacity-0 has-[:hover]:bg-opacity-50">
          <TotalColumnAddDropdown blockId={pricingData?.id} />
        </div>
      )}
    </table>
  );
};

export default DetailedTotalsTable;
