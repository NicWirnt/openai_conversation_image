import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEditor } from "@/providers/stores/editor.provider";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useShallow } from "zustand/react/shallow";

const TotalColumnAddDropdown = ({ blockId }: { blockId: string }) => {
  const editorStore = useEditor();
  const addColumn = editorStore(useShallow((state) => state.addColumn));

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="">
          <div className="shadow ml-0 h-fit w-fit rounded-sm border bg-white px-[0.5px] py-[2px] hover:bg-neutral-100">
            <FontAwesomeIcon
              icon={faPlus}
              size={"sm"}
              className={"z-10 text-zinc-700"}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="-mr-2 w-fit" side="left">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Add Custom Total Column</DropdownMenuLabel>

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                // addColumn({
                //   blockId: blockId,
                //   columnType: "custom",
                // });
              }}
            >
              <span className="">Fee</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                // addColumn({
                //   blockId: blockId,
                //   columnType: "custom",
                // });
              }}
            >
              <span className="">Tax</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                // addColumn({
                //   blockId: blockId,
                //   columnType: "additionalMultiplier",
                // });
              }}
            >
              <span className="">Discount</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Add Product Fields Total</DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer">
              <span className="">Product field 1</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default TotalColumnAddDropdown;
