import { useEffect, useState } from "react"

import { ChevronDown, ChevronUp } from "lucide-react"

import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import Icon from "@/components/ui/Icon"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useHomeStore } from "@/pages/home/store"
export const SideBarItemList = ({
  title,
  icon,
  to,
  items,
  isActive,
  shortcut,
}) => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const {isCollapsed}=useHomeStore()
  useEffect(() => {
    const down = (e) => {
  
      if (e.key === shortcut && e.shiftKey) {
        e.preventDefault()
        location(to)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-[350px] space-y-2"
    >
      <CollapsibleTrigger asChild>
        <Button
          className={cn(
            "w-full flex justify-start rounded-none space-x-2 hover:text-black dark:hover:text-white group",

            isActive && "text-white ",
            !isActive && "text-[#7b809a]"
          )}
          variant="ghost"
        >
          <Separator
            orientation="vertical"
            className={cn(
              "bg-[#1E293B]",
              isActive &&
                "bg-white w-[1.5px] group-hover:bg-[#1E293B] dark:group-hover:bg-white"
            )}
          />
          {/* <div style={{ height:'100%', width:'2px', backgroundColor:isActive?"white":'black',marginRight:'10px'}}/> */}

          <Icon name={icon} size={"20"} />
          {!isCollapsed&&
          
          <p className={cn("text-sm ml-4 text-start w-[35%]")}>{title}</p>
          }
          {isOpen ? <ChevronUp size={"15"} /> : <ChevronDown size={"15"} />}
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-2">
        {items.map((item) => (
          <Link key={item.to} to={item.to}>
            <Button
              className={cn(
                "w-full flex justify-start ",
                item.isActive && "text-white ",
                !item.isActive && "text-[#7b809a]"
              )}
              variant="ghost"
            >
              {/* {
                  item?.icon&& <Icon name={item?.icon} size={'20'}  className={item.isActive?'text-black':'text-[#7b809a]'}/>
                } */}
   {!isCollapsed&&
          
          <p className="text-sm ml-4 text-start w-[35%]">{item.title}</p>
          }
             
            </Button>
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
