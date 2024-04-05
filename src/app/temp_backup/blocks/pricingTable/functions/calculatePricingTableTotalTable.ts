import type {
  AdditionalMultiplierCell,
  DiscountCell,
  DiscountPricingTableColumn,
  FeeCell,
  PricingTableColumn,
  PricingTableTotals,
  ProductRow,
  RecuringMultiplierCell,
  TaxCell,
  TaxPricingTableColumn,
  TotalPricingTableColumn,
} from "@/types/blocks/pricingTable";

export type PricingTotalTypes =
  | "minTermCost"
  | "minTermTotal"
  | "minTermTax"
  | "minTermDiscount"
  | "fullTermCost"
  | "fullTermDiscount"
  | "fullTermTax"
  | "fullTermTotal"
  | "oneOffCost"
  | "oneOffTax"
  | "oneOffTotal"
  | "total"
  | "overalTotal";

const calculateMinTermCost = ({
  columnList,
  rowList,
}: {
  columnList: PricingTableColumn[];
  rowList: ProductRow[];
}) => {
  let total = 0;
  const feeColumns = columnList.filter((column) => column.type === "fee");
  const additionalMultiplierColumns = columnList.filter(
    (column) => column.type === "additionalMultiplier",
  );
  rowList
    .filter((rowData) => {
      if (rowData.enableSelection) return rowData.selected;
      return !rowData.oneOffRow;
    })
    .forEach((rowData) => {
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

      total += fee * additionalMultiplier;
    });

  return total;
};

const calculateFullTermCost = ({
  columnList,
  rowList,
}: {
  columnList: PricingTableColumn[];
  rowList: ProductRow[];
}) => {
  let total = 0;
  const feeColumns = columnList.filter((column) => column.type === "fee");
  const additionalMultiplierColumns = columnList.filter(
    (column) => column.type === "additionalMultiplier",
  );
  const recuringMultiplierColumns = columnList.filter(
    (column) => column.type === "recuringMultiplier",
  );
  rowList
    .filter((rowData) => {
      if (rowData.enableSelection) return rowData.selected;
      return !rowData.oneOffRow;
    })
    .forEach((rowData) => {
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

      const recuringMultiplier = recuringMultiplierColumns
        .map((column) => {
          const cell = rowData.cells.find(
            (cell) => cell.columnID === column.id,
          ) as RecuringMultiplierCell;
          if (cell) {
            return cell.value;
          }
          return 0;
        })
        .reduce((acc, value) => acc + value, 0);

      total += fee * additionalMultiplier * recuringMultiplier;
    });

  return total;
};

const calculateOneOffCost = ({
  columnList,
  rowList,
}: {
  columnList: PricingTableColumn[];
  rowList: ProductRow[];
}) => {
  let total = 0;
  const feeColumns = columnList.filter((column) => column.type === "fee");
  const additionalMultiplierColumns = columnList.filter(
    (column) => column.type === "additionalMultiplier",
  );
  const recuringMultiplierColumns = columnList.some(
    (column) => column.type === "recuringMultiplier",
  );
  rowList
    .filter((rowData) => {
      if (rowData.enableSelection) return rowData.selected;
      return recuringMultiplierColumns ? rowData.oneOffRow : true;
    })
    .forEach((rowData) => {
      const fee = feeColumns
        .map((column) => {
          const cell = rowData.cells.find(
            (cell) => cell.columnID === column.id,
          ) as FeeCell;
          if (cell) {
            return cell.value > 0 ? cell.value : 0;
          }
          return 0;
        })
        .reduce((acc, value) => acc + value, 0);

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

      total += fee * additionalMultiplier;
    });

  return total;
};

const calculateMinTermTax = ({
  columnList,
  rowList,
}: {
  columnList: PricingTableColumn[];
  rowList: ProductRow[];
}) => {
  let total = 0;
  const feeColumns = columnList.filter((column) => column.type === "fee");
  const additionalMultiplierColumns = columnList.filter(
    (column) => column.type === "additionalMultiplier",
  );
  const preTaxDiscountColumns = columnList.filter(
    (column) => column.type === "discount" && !column.postTaxDiscount,
  );
  const taxColumns = columnList.filter((column) => column.type === "tax");

  rowList.forEach((rowData) => {
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

    const tax = taxColumns
      .map((column) => {
        const cell = rowData.cells.find(
          (cell) => cell.columnID === column.id,
        ) as TaxCell;
        if (cell) {
          return cell.value;
        }
        return 0;
      })
      .reduce((acc, value) => acc + value, 0);

    total += (tax / 100) * (fee * additionalMultiplier - preTaxDiscount);
  });

  return total;
};

const calculateMinTermTotal = ({
  columnList,
  rowList,
}: {
  columnList: PricingTableColumn[];
  rowList: ProductRow[];
}) => {
  let total = 0;
  const feeColumns = columnList.filter((column) => column.type === "fee");
  const additionalMultiplierColumns = columnList.filter(
    (column) => column.type === "additionalMultiplier",
  );
  const preTaxDiscountColumns = columnList.filter(
    (column) => column.type === "discount" && !column.postTaxDiscount,
  );
  const taxColumns = columnList.filter((column) => column.type === "tax");

  const postTaxDiscountColumns = columnList.filter(
    (column) => column.type === "discount" && column.postTaxDiscount,
  );

  rowList.forEach((rowData) => {
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

    const tax = taxColumns
      .map((column) => {
        const cell = rowData.cells.find(
          (cell) => cell.columnID === column.id,
        ) as TaxCell;
        if (cell) {
          return cell.value;
        }
        return 0;
      })
      .reduce((acc, value) => acc + value, 0);

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

    total +=
      (tax / 100) * (fee * additionalMultiplier - preTaxDiscount) +
      (fee * additionalMultiplier - postTaxDiscount);
  });

  return total;
};

const calculateFullTermTotal = ({
  columnList,
  rowList,
}: {
  columnList: PricingTableColumn[];
  rowList: ProductRow[];
}) => {
  let total = 0;
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
  const taxColumns = columnList.filter((column) => column.type === "tax");

  const postTaxDiscountColumns = columnList.filter(
    (column) => column.type === "discount" && column.postTaxDiscount,
  );

  rowList.forEach((rowData) => {
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

    const recuringMultiplier = recuringMultiplierColumns
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

    const tax = taxColumns
      .map((column) => {
        const cell = rowData.cells.find(
          (cell) => cell.columnID === column.id,
        ) as TaxCell;
        if (cell) {
          return cell.value;
        }
        return 0;
      })
      .reduce((acc, value) => acc + value, 0);

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

    total +=
      (tax / 100) *
        (fee * additionalMultiplier * recuringMultiplier - preTaxDiscount) +
      (fee * additionalMultiplier * recuringMultiplier - postTaxDiscount);
  });

  return total;
};

const calculateOneOffTotal = ({
  columnList,
  rowList,
}: {
  columnList: PricingTableColumn[];
  rowList: ProductRow[];
}) => {
  let total = 0;
  const feeColumns = columnList.filter((column) => column.type === "fee");
  const additionalMultiplierColumns = columnList.filter(
    (column) => column.type === "additionalMultiplier",
  );
  const preTaxDiscountColumns = columnList.filter(
    (column) => column.type === "discount" && !column.postTaxDiscount,
  );
  const taxColumns = columnList.filter((column) => column.type === "tax");

  const postTaxDiscountColumns = columnList.filter(
    (column) => column.type === "discount" && column.postTaxDiscount,
  );

  const recuringMultiplierColumns = columnList.some(
    (column) => column.type === "recuringMultiplier",
  );

  rowList
    .filter((rowData) => {
      if (rowData.enableSelection) return rowData.selected;
      return recuringMultiplierColumns ? rowData.oneOffRow : true;
    })
    .forEach((rowData) => {
      const fee = feeColumns
        .map((column) => {
          const cell = rowData.cells.find(
            (cell) => cell.columnID === column.id,
          ) as FeeCell;
          if (cell) {
            return cell.value > 0 ? cell.value : 0;
          }
          return 0;
        })
        .reduce((acc, value) => acc + value, 0);

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

      const tax = taxColumns
        .map((column) => {
          const cell = rowData.cells.find(
            (cell) => cell.columnID === column.id,
          ) as TaxCell;
          if (cell) {
            return cell.value;
          }
          return 0;
        })
        .reduce((acc, value) => acc + value, 0);

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

      total +=
        (tax / 100) * (fee * additionalMultiplier - preTaxDiscount) +
        (fee * additionalMultiplier - postTaxDiscount);
    });

  return total;
};

const calculateFullTermTax = ({
  columnList,
  rowList,
}: {
  columnList: PricingTableColumn[];
  rowList: ProductRow[];
}) => {
  let total = 0;
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
  const taxColumns = columnList.filter((column) => column.type === "tax");

  rowList.forEach((rowData) => {
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

    const recuringMultiplier = recuringMultiplierColumns
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

    const tax = taxColumns
      .map((column) => {
        const cell = rowData.cells.find(
          (cell) => cell.columnID === column.id,
        ) as TaxCell;
        if (cell) {
          return cell.value;
        }
        return 0;
      })
      .reduce((acc, value) => acc + value, 0);

    total +=
      (tax / 100) *
      (fee * additionalMultiplier * recuringMultiplier - preTaxDiscount);
  });

  return total;
};

const calculateOneOffTax = ({
  columnList,
  rowList,
}: {
  columnList: PricingTableColumn[];
  rowList: ProductRow[];
}) => {
  let total = 0;
  const feeColumns = columnList.filter((column) => column.type === "fee");
  const additionalMultiplierColumns = columnList.filter(
    (column) => column.type === "additionalMultiplier",
  );
  const preTaxDiscountColumns = columnList.filter(
    (column) => column.type === "discount" && !column.postTaxDiscount,
  );
  const taxColumns = columnList.filter((column) => column.type === "tax");
  const recuringMultiplierColumns = columnList.some(
    (column) => column.type === "recuringMultiplier",
  );

  rowList
    .filter((rowData) => {
      if (rowData.enableSelection) return rowData.selected;
      return recuringMultiplierColumns ? rowData.oneOffRow : true;
    })
    .forEach((rowData) => {
      const fee = feeColumns
        .map((column) => {
          const cell = rowData.cells.find(
            (cell) => cell.columnID === column.id,
          ) as FeeCell;
          if (cell) {
            return cell.value > 0 ? cell.value : 0;
          }
          return 0;
        })
        .reduce((acc, value) => acc + value, 0);

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

      const tax = taxColumns
        .map((column) => {
          const cell = rowData.cells.find(
            (cell) => cell.columnID === column.id,
          ) as TaxCell;
          if (cell) {
            return cell.value;
          }
          return 0;
        })
        .reduce((acc, value) => acc + value, 0);

      total += (tax / 100) * (fee * additionalMultiplier - preTaxDiscount);
    });

  return total;
};

export const calculateTotalForType = ({
  type,
  columnList,
  rowList,
  totalsList,
}: {
  type: PricingTotalTypes;
  columnList:
    | PricingTableColumn[]
    | TaxPricingTableColumn[]
    | TotalPricingTableColumn[];
  rowList: ProductRow[];
  totalsList: PricingTableTotals[];
}) => {
  let total = 0;

  switch (type) {
    case "minTermCost":
      total += calculateMinTermCost({ columnList, rowList });
      break;
    case "minTermTax":
      total += calculateMinTermTax({ columnList, rowList });
      break;
    case "minTermTotal":
      total += calculateMinTermTotal({ columnList, rowList });
      break;
    case "minTermDiscount":
      break;
    case "fullTermCost":
      total += calculateFullTermCost({ columnList, rowList });
      break;
    case "fullTermDiscount":
      break;
    case "fullTermTax":
      total += calculateFullTermTax({ columnList, rowList });
      break;
    case "fullTermTotal":
      total += calculateFullTermTotal({ columnList, rowList });
      break;
    case "oneOffCost":
      total += calculateOneOffCost({ columnList, rowList });
      break;
    case "oneOffTax":
      total += calculateOneOffTax({ columnList, rowList });
      break;
    case "oneOffTotal":
      total += calculateOneOffTotal({ columnList, rowList });
      break;
    case "total":
      break;
    case "overalTotal":
      break;

    default:
      break;
  }

  return total;
};
