import { RotateCcw, Search } from "lucide-react";
import { Button } from "../ui/button";


const FiltersFooter = ({ isLoading, onApply, onReset }) => {

    
    return(
  <div className="flex justify-end p-4 border-t gap-2">
    <Button disabled={isLoading} onClick={onApply}>
      <Search size={16} /> {"Apply"}
    </Button>
    <Button size="sm" variant="ghost" onClick={onReset}>
      <RotateCcw className="w-4 h-4 mr-1" /> {"Reset"}
    </Button>
  </div>
)};

export default FiltersFooter