import {
  PricingTableCalculatedCellTypes,
  ProductRow,
} from "@/types/blocks/pricingTable";

type ColumnReference = {
  type: "column";
  columnId: string; // Unique identifier for the column to reference
};

type ConstantValue = {
  type: "constant";
  value: number;
};

type CellValue = {
  type: "cell";
};

export type OperationType = "add" | "subtract" | "multiply" | "divide";

type OperationNode = {
  type: "operation";
  operation: OperationType;
  args: ExpressionNode[]; // Using a recursive type definition for nested expressions
};

export type ExpressionNode =
  | ColumnReference
  | ConstantValue
  | CellValue
  | OperationNode;

export type RuleModel = {
  expression: ExpressionNode; // The root of the expression tree
};

export const removeColumnFromExpression = ({
  columnId,
  rule,
}: {
  columnId: string;
  rule: RuleModel;
}): RuleModel => {
  const removeColumnFromNode = (node: ExpressionNode): ExpressionNode => {
    switch (node.type) {
      case "column":
        return node.columnId === columnId
          ? { type: "constant", value: 1 }
          : node;
      case "operation":
        return {
          ...node,
          args: node.args.map((arg) => removeColumnFromNode(arg)),
        };
      default:
        return node;
    }
  };

  return {
    expression: removeColumnFromNode(rule.expression),
  };
};

const operate = ({ op, a, b }: { op: string; a: number; b: number }) => {
  switch (op) {
    case "add":
      return a + b;
    case "subtract":
      return a - b;
    case "multiply":
      return a * b;
    case "divide":
      return a / b;
    default:
      throw new Error("Unsupported operation");
  }
};

export const evaluateRule = (
  node: ExpressionNode,
  rowData: ProductRow,
): number => {
  try {
    switch (node.type) {
      case "column":
        const cellData = rowData.cells.find(
          (cell) => cell.columnID === node.columnId,
        ) as PricingTableCalculatedCellTypes;
        console.log(cellData);
        return cellData?.value;
      case "constant":
        return node.value;
      case "operation": {
        const argsValues = node.args.map((arg) => {
          console.log("arg", arg);
          console.log("rowData", rowData);
          return evaluateRule(arg, rowData);
        });
        const operate = (op: OperationType, a: number, b: number): number => {
          switch (op) {
            case "add":
              return a + b;
            case "subtract":
              return a - b;
            case "multiply":
              return a * b;
            case "divide":
              return a / b; // Consider checking for division by zero
            default:
              throw new Error(`Unsupported operation: ${String(op)}`);
          }
        };
        return argsValues.reduce((acc, value) =>
          operate(node.operation, acc, value),
        );
      }
      default:
        throw new Error(`Invalid node type: ${(node as any).type}`);
    }
  } catch (error) {
    console.error("Error evaluating rule", error);
    return 0;
  }
};
