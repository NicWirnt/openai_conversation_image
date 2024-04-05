import type {
  AdditionalMultiplierCell,
  CostCell,
  DiscountCell,
  DiscountPricingTableColumn,
  FeeCell,
  PricingTableColumn,
  PricingTableRow,
  ProductRow,
  RecuringMultiplierCell,
  TaxCell,
  TaxPricingTableColumn,
  TermTotalCell,
  TotalCell,
  TotalPricingTableColumn,
} from "@/types/blocks/pricingTable";
import _ from "lodash";

export const calculatePricingTotals = ({
  currentColumn,
  rowData,
  columnList,
  termTax = false,
}: {
  currentColumn:
    | PricingTableColumn
    | TaxPricingTableColumn
    | TotalPricingTableColumn;
  rowData: ProductRow;
  columnList:
    | PricingTableColumn[]
    | TaxPricingTableColumn[]
    | TotalPricingTableColumn[];
  termTax?: boolean;
}) => {
  let total = 0;

  try {
    if (currentColumn.type === "tax") {
      const feeColumns = columnList.filter((column) => column.type === "fee");
      const additionalMultiplierColumns = columnList.filter(
        (column) => column.type === "additionalMultiplier",
      );
      const recuringMultiplierColumns = columnList.filter(
        (column) => column.type === "recuringMultiplier",
      );
      const preTaxDiscountColumns = columnList.filter(
        (column) => column.type === "discount" && !column.postTaxDiscount,
      );

      const taxCell = rowData.cells.find(
        (cell) => cell.columnID === currentColumn.id,
      ) as TaxCell;
      if (taxCell) {
        const value = taxCell.value;
        // Calculate fee (take tax percentage value off (feeColumns * additionalMultiplierColumns * recuringMultiplierColumns - preTaxDiscountColumns))
        const fee = feeColumns
          .map((column) => {
            const cell = rowData.cells.find(
              (cell) => cell.columnID === column.id,
            ) as FeeCell;
            if (cell) {
              return cell.value;
            }
            return 0;
          })
          .reduce((acc, value) => acc + value, 0);

        // Calculate additionalMultiplier (take tax percentage value off (additionalMultiplierColumns * recuringMultiplierColumns - preTaxDiscountColumns))
        const additionalMultiplier = additionalMultiplierColumns
          .map((column) => {
            const cell = rowData.cells.find(
              (cell) => cell.columnID === column.id,
            ) as FeeCell;
            if (cell) {
              return cell.value;
            }
            return 0;
          })
          .reduce((acc, value) => acc + value, 0);

        // Calculate recuringMultiplier (take tax percentage value off (recuringMultiplierColumns - preTaxDiscountColumns))
        const recuringMultiplier =
          recuringMultiplierColumns.length > 0
            ? recuringMultiplierColumns
                .map((column) => {
                  const cell = rowData.cells.find(
                    (cell) => cell.columnID === column.id,
                  ) as FeeCell;
                  if (cell) {
                    return cell.value;
                  }
                  return 0;
                })
                .reduce((acc, value) => acc + value, 0)
            : 1;

        // Calculate preTaxDiscount (take tax percentage value off (preTaxDiscountColumns))
        const preTaxDiscount = preTaxDiscountColumns
          .map((column) => {
            const cell = rowData.cells.find(
              (cell) => cell.columnID === column.id,
            ) as FeeCell;
            if (cell) {
              if (
                termTax &&
                (column as DiscountPricingTableColumn).termBasedDiscount
              ) {
                return cell.value * recuringMultiplier;
              }
              return cell.value;
            }
            return 0;
          })
          .reduce((acc, value) => acc + value, 0);

        const cost = !termTax
          ? fee * additionalMultiplier * recuringMultiplier + preTaxDiscount
          : fee * additionalMultiplier + preTaxDiscount;
        total = (value / 100) * cost;
      }
    }
    // else if (currentColumn.type === "termTax") {
    //   const feeColumns = columnList.filter((column) => column.type === "fee");
    //   const additionalMultiplierColumns = columnList.filter(
    //     (column) => column.type === "additionalMultiplier",
    //   );
    //   const preTaxDiscountColumns = columnList.filter(
    //     (column) => column.type === "discount" && !column.postTaxDiscount,
    //   );

    //   const termTaxCell = rowData.cells.find(
    //     (cell) => cell.columnID === currentColumn.id,
    //   ) as TermTaxCell;
    //   if (termTaxCell) {
    //     const value = termTaxCell.value;
    //     // Calculate fee (take tax percentage value off (feeColumns * additionalMultiplierColumns * recuringMultiplierColumns - preTaxDiscountColumns))
    //     const fee = feeColumns
    //       .map((column) => {
    //         const cell = rowData.cells.find(
    //           (cell) => cell.columnID === column.id,
    //         ) as FeeCell;
    //         if (cell) {
    //           return cell.value;
    //         }
    //         return 0;
    //       })
    //       .reduce((acc, value) => acc + value, 0);

    //     // Calculate additionalMultiplier (take tax percentage value off (additionalMultiplierColumns * recuringMultiplierColumns - preTaxDiscountColumns))
    //     const additionalMultiplier = additionalMultiplierColumns
    //       .map((column) => {
    //         const cell = rowData.cells.find(
    //           (cell) => cell.columnID === column.id,
    //         ) as FeeCell;
    //         if (cell) {
    //           return cell.value;
    //         }
    //         return 0;
    //       })
    //       .reduce((acc, value) => acc + value, 0);

    //     // Calculate preTaxDiscount (take tax percentage value off (preTaxDiscountColumns))
    //     const preTaxDiscount = preTaxDiscountColumns
    //       .map((column) => {
    //         const cell = rowData.cells.find(
    //           (cell) => cell.columnID === column.id,
    //         ) as FeeCell;
    //         if (cell) {
    //           return cell.value;
    //         }
    //         return 0;
    //       })
    //       .reduce((acc, value) => acc + value, 0);

    //     const cost = fee * additionalMultiplier + preTaxDiscount;
    //     total = (value / 100) * cost;
    //   }
    // }
    else if (currentColumn.type === "total") {
      const feeColumns = columnList.filter((column) => column.type === "fee");
      const additionalMultiplierColumns = columnList.filter(
        (column) => column.type === "additionalMultiplier",
      );
      const recuringMultiplierColumns = columnList.filter(
        (column) => column.type === "recuringMultiplier",
      );
      const preTaxDiscountColumns = columnList.filter(
        (column) => column.type === "discount" && !column.postTaxDiscount,
      );
      const postTaxDiscountColumns = columnList.filter(
        (column) => column.type === "discount" && column.postTaxDiscount,
      );

      const taxColumns = columnList.filter((column) => column.type === "tax");

      const totalCell = rowData.cells.find(
        (cell) => cell.columnID === currentColumn.id,
      ) as TotalCell;
      if (totalCell) {
        // Calculate fee (take tax percentage value off (feeColumns * additionalMultiplierColumns * recuringMultiplierColumns - preTaxDiscountColumns))
        const fee = feeColumns
          .map((column) => {
            const cell = rowData.cells.find(
              (cell) => cell.columnID === column.id,
            ) as FeeCell;
            if (cell) {
              return cell.value;
            }
            return 0;
          })
          .reduce((acc, value) => acc + value, 0);

        // Calculate additionalMultiplier (take tax percentage value off (additionalMultiplierColumns * recuringMultiplierColumns - preTaxDiscountColumns))
        const additionalMultiplier = additionalMultiplierColumns
          .map((column) => {
            const cell = rowData.cells.find(
              (cell) => cell.columnID === column.id,
            ) as AdditionalMultiplierCell;
            if (cell) {
              return cell.value;
            }
            return 0;
          })
          .reduce((acc, value) => acc + value, 0);

        // Calculate recuringMultiplier (take tax percentage value off (recuringMultiplierColumns - preTaxDiscountColumns))
        const recuringMultiplier =
          recuringMultiplierColumns.length > 0
            ? recuringMultiplierColumns
                .map((column) => {
                  const cell = rowData.cells.find(
                    (cell) => cell.columnID === column.id,
                  ) as RecuringMultiplierCell;
                  if (cell) {
                    return cell.value;
                  }
                  return 0;
                })
                .reduce((acc, value) => acc + value, 0)
            : 1;

        // Calculate preTaxDiscount (take tax percentage value off (preTaxDiscountColumns))
        const preTaxDiscount = preTaxDiscountColumns
          .map((column) => {
            const cell = rowData.cells.find(
              (cell) => cell.columnID === column.id,
            ) as DiscountCell;
            if (cell) {
              if ((column as DiscountPricingTableColumn).termBasedDiscount) {
                return cell.value * recuringMultiplier;
              }
              return cell.value;
            }
            return 0;
          })
          .reduce((acc, value) => acc + value, 0);

        // Calculate preTaxDiscount (take tax percentage value off (preTaxDiscountColumns))
        const postTaxDiscount = postTaxDiscountColumns
          .map((column) => {
            const cell = rowData.cells.find(
              (cell) => cell.columnID === column.id,
            ) as DiscountCell;
            if (cell) {
              if ((column as DiscountPricingTableColumn).termBasedDiscount) {
                return cell.value * recuringMultiplier;
              }
              return cell.value;
            }
            return 0;
          })
          .reduce((acc, value) => acc + value, 0);

        // Calculate tax (take tax percentage value off (taxColumns))
        const tax = taxColumns
          .map((column) => {
            const cell = rowData.cells.find(
              (cell) => cell.columnID === column.id,
            ) as TaxCell;
            return (
              calculatePricingTotals({
                columnList: columnList,
                rowData,
                currentColumn: column,
                termTax: (column as TaxPricingTableColumn)?.isTermBased,
              }) ?? 0
            );
          })
          .reduce((acc, value) => acc + value, 0);

        const cost =
          fee * additionalMultiplier * recuringMultiplier + preTaxDiscount;
        total = cost + tax + postTaxDiscount;
      }
    } else if (currentColumn.type === "termTotal") {
      const feeColumns = columnList.filter((column) => column.type === "fee");
      const additionalMultiplierColumns = columnList.filter(
        (column) => column.type === "additionalMultiplier",
      );
      const preTaxDiscountColumns = columnList.filter(
        (column) => column.type === "discount" && !column.postTaxDiscount,
      );
      const postTaxDiscountColumns = columnList.filter(
        (column) => column.type === "discount" && column.postTaxDiscount,
      );

      const taxColumns = columnList.filter((column) => column.type === "tax");

      const termTotalCell = rowData.cells.find(
        (cell) => cell.columnID === currentColumn.id,
      ) as TermTotalCell;
      if (termTotalCell) {
        // Calculate fee (take tax percentage value off (feeColumns * additionalMultiplierColumns * recuringMultiplierColumns - preTaxDiscountColumns))
        const fee = feeColumns
          .map((column) => {
            const cell = rowData.cells.find(
              (cell) => cell.columnID === column.id,
            ) as FeeCell;
            if (cell) {
              return cell.value;
            }
            return 0;
          })
          .reduce((acc, value) => acc + value, 0);

        // Calculate additionalMultiplier (take tax percentage value off (additionalMultiplierColumns * recuringMultiplierColumns - preTaxDiscountColumns))
        const additionalMultiplier = additionalMultiplierColumns
          .map((column) => {
            const cell = rowData.cells.find(
              (cell) => cell.columnID === column.id,
            ) as AdditionalMultiplierCell;
            if (cell) {
              return cell.value;
            }
            return 0;
          })
          .reduce((acc, value) => acc + value, 0);

        // Calculate preTaxDiscount (take tax percentage value off (preTaxDiscountColumns))
        const preTaxDiscount = preTaxDiscountColumns
          .map((column) => {
            const cell = rowData.cells.find(
              (cell) => cell.columnID === column.id,
            ) as DiscountCell;
            if (cell) {
              return cell.value;
            }
            return 0;
          })
          .reduce((acc, value) => acc + value, 0);

        // Calculate preTaxDiscount (take tax percentage value off (preTaxDiscountColumns))
        const postTaxDiscount = postTaxDiscountColumns
          .map((column) => {
            const cell = rowData.cells.find(
              (cell) => cell.columnID === column.id,
            ) as DiscountCell;
            if (cell) {
              return cell.value;
            }
            return 0;
          })
          .reduce((acc, value) => acc + value, 0);

        // Calculate tax (take tax percentage value off (taxColumns))
        const tax = taxColumns
          .map((column) => {
            const cell = rowData.cells.find(
              (cell) => cell.columnID === column.id,
            ) as TaxCell;
            return (
              calculatePricingTotals({
                columnList: columnList,
                rowData,
                currentColumn: column,
                termTax: true,
              }) ?? 0
            );
          })
          .reduce((acc, value) => acc + value, 0);

        const cost = fee * additionalMultiplier + preTaxDiscount;
        total = cost + tax + postTaxDiscount;
      }
    } else if (currentColumn.type === "cost") {
      const feeColumns = columnList.filter((column) => column.type === "fee");
      const additionalMultiplierColumns = columnList.filter(
        (column) => column.type === "additionalMultiplier",
      );
      const recuringMultiplierColumns = columnList.filter(
        (column) => column.type === "recuringMultiplier",
      );
      const preTaxDiscountColumns = columnList.filter(
        (column) => column.type === "discount" && !column.postTaxDiscount,
      );

      const costCell = rowData.cells.find(
        (cell) => cell.columnID === currentColumn.id,
      ) as CostCell;
      if (costCell) {
        // Calculate fee (take tax percentage value off (feeColumns * additionalMultiplierColumns * recuringMultiplierColumns - preTaxDiscountColumns))
        const fee = feeColumns
          .map((column) => {
            const cell = rowData.cells.find(
              (cell) => cell.columnID === column.id,
            ) as FeeCell;
            if (cell) {
              return cell.value;
            }
            return 0;
          })
          .reduce((acc, value) => acc + value, 0);

        // Calculate additionalMultiplier (take tax percentage value off (additionalMultiplierColumns * recuringMultiplierColumns - preTaxDiscountColumns))
        const additionalMultiplier = additionalMultiplierColumns
          .map((column) => {
            const cell = rowData.cells.find(
              (cell) => cell.columnID === column.id,
            ) as AdditionalMultiplierCell;
            if (cell) {
              return cell.value;
            }
            return 0;
          })
          .reduce((acc, value) => acc + value, 0);

        // Calculate recuringMultiplier (take tax percentage value off (recuringMultiplierColumns - preTaxDiscountColumns))
        const recuringMultiplier =
          recuringMultiplierColumns.length > 0
            ? recuringMultiplierColumns
                .map((column) => {
                  const cell = rowData.cells.find(
                    (cell) => cell.columnID === column.id,
                  ) as RecuringMultiplierCell;
                  if (cell) {
                    return cell.value;
                  }
                  return 0;
                })
                .reduce((acc, value) => acc + value, 0)
            : 1;

        // Calculate preTaxDiscount (take tax percentage value off (preTaxDiscountColumns))
        const preTaxDiscount = preTaxDiscountColumns
          .map((column) => {
            const cell = rowData.cells.find(
              (cell) => cell.columnID === column.id,
            ) as DiscountCell;
            if (cell) {
              return cell.value;
            }
            return 0;
          })
          .reduce((acc, value) => acc + value, 0);

        const cost =
          fee * additionalMultiplier * recuringMultiplier + preTaxDiscount;
        total = cost;
      }
    }
  } catch (error) {
    console.error("Error calculating pricing totals", error);
  }
  return total;
};

export const calculatePricingTotalsForTotalsTable = ({
  columnType,
  rowList,
  columnList,
  oneOffRow,
}: {
  columnType:
    | "total"
    | "termTotal"
    | "termTax"
    | "termDiscount"
    | "cost"
    | "tax"
    | "discount";
  rowList: PricingTableRow[];
  columnList:
    | PricingTableColumn[]
    | TaxPricingTableColumn[]
    | TotalPricingTableColumn[];
  oneOffRow: boolean;
}) => {
  let total = 0;

  let currentColumns =
    columnList.filter((column) => {
      if (columnType === "termDiscount") {
        return column.type === "discount" && column.termBasedDiscount;
      }
      if (columnType === "termTax") {
        return column.type === "tax" && column.isTermBased;
      }
      if (columnType === "termTotal") {
        return column.type === "total";
      }
      return column.type === columnType;
    }) ?? [];

  if (columnType === "termTotal" && currentColumns.length < 1) {
    currentColumns =
      columnList.filter((column) => {
        return column.type === columnType;
      }) ?? [];
  }

  const termTable = columnList.some(
    (column) => column.type === "recuringMultiplier",
  );
  currentColumns.forEach((origColumn) => {
    const column = _.cloneDeep(origColumn);
    rowList.forEach((orgRow) => {
      const row = _.cloneDeep(orgRow);
      if (oneOffRow && termTable && !(row as ProductRow).oneOffRow) {
        return;
      }
      if (!oneOffRow && termTable && (row as ProductRow).oneOffRow) {
        return;
      }
      if (columnType === "termTotal") {
        column.type = "termTotal";
      }
      total += calculatePricingTotals({
        currentColumn: column,
        rowData: row as ProductRow,
        columnList,
        termTax: columnType !== "termTax",
      });
    });
  });

  return total;
};
