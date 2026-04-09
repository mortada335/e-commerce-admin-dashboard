import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Rows2 } from "lucide-react";



export const DragHandle = (props) => {
  return (
    <Button size="icon" variant="ghost" className={cn("h-10 cursor-grabbing",props.isDragging&&"cursor-grab")} {...props}>
        <Rows2 />
    </Button>
   
  );
};
