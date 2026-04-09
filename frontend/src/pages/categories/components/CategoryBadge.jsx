

import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';


const CategoryBadge = ({item,className}) => {

 
  return (
    <div className='flex justify-start items-center flex-wrap w-full gap-2'>
    {
      !!item?.parents?.length&&
      item?.parents?.map((parent)=>(

        <TooltipProvider key={parent?.category_id}>
          <Tooltip>
          <TooltipTrigger
  
            

    >
    <Badge
  
    className={cn(
      "  capitalize rounded-sm !text-xs whitespace-nowrap bg-blue-500 hover:bg-blue-400 text-white",
      className,
    
    )}
    variant={'secondary'}
  >
       {parent?.name[0]?.name}
  </Badge>
    </TooltipTrigger>

            <TooltipContent>
             English: {parent?.name[0]?.name}
             Arabic: {parent?.name[1]?.name}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>


      ))
    }

    </div>
  )
}

export default CategoryBadge
