import { useEffect, useState } from "react"

import { ArrowBigUp, ChevronDown, ChevronUp } from "lucide-react"

import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import Icon from "@/components/ui/Icon"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { setIsSideBarDrawerOpen, useHomeStore } from "@/pages/home/store"
import Can from "@/components/Can"
export const SideBarItem = ({
  title,
  icon,
  to,
  items = [],
  isActive,
  shortcut,
  permissions,
  isPublic,
}) => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const {isCollapsed}=useHomeStore()

  const handleCloseSideBar=() =>{ setIsSideBarDrawerOpen(false) }

  useEffect(() => {
    const down = (e) => {
      const itemIndex = items.findIndex((item) => item.shortcut === e.key)
 
      if (itemIndex !== -1 && e.shiftKey && e?.target?.localName!=="input") {
        e.preventDefault()
        navigate(items[itemIndex].to)
      } else if (shortcut === e.key && e.shiftKey&& e?.target?.localName!=="input") {
        e.preventDefault()
        navigate(to)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      {items?.length ? (
        <>
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
              
        
          <p className={cn("text-sm ml-4 text-start w-[35%]" ,isCollapsed?'hidden group-hover:block':'block')}>{title}</p>
          
       
                {isOpen ? (
                  <ChevronUp size={"15"} />
                ) : (
                  <ChevronDown size={"15"} />
                )}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-2 w-full">
              {items.map((item) => (
                <Can isPublic={isPublic}  key={item.to} permissions={item?.permissions}>

                <Link  to={item.to} className="w-full">
                  <Button
                    className={cn(
                      "w-[59%]  flex justify-between gap-2 pl-[27px]",
                      item.isActive && "text-white ",
                      !item.isActive && "text-[#7b809a] ",
                      isCollapsed?'w-[10%] group-hover:w-[59%] ':'w-[59%]'
                    )}
                    variant="ghost"
                    onClick={handleCloseSideBar}
                  >
                    <div className="flex items-center justify-between gap-2 ">

                    {
                  item?.icon&& <Icon name={item.icon} size={"15"} />
                }

                    <p className={cn("text-sm  text-start ",isCollapsed?'hidden group-hover:block':'block')}>
                      {item.title}
                    </p>
                    </div>
                    {item.shortcut && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="text-xs space-x-0.5 flex">
                              <ArrowBigUp size={14} />{" "}
                              <span>{item.shortcut}</span>
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs space-x-0.5 flex">
                              <ArrowBigUp size={14} />{" "}
                              <span>Shift+{item.shortcut}</span>
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </Button>
                </Link>
                </Can>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </>
      ) : (
        <Can isPublic={isPublic}  key={to} permissions={permissions}>

        <Link   to={to} className="w-full">
          <Button
           onClick={handleCloseSideBar}
            className={cn(
              "w-full flex justify-start  rounded-none space-x-2 hover:text-black dark:hover:text-white  group",
              isActive ? "text-white " : "text-[#7b809a] "
            )}
            variant="ghost"
          >
            <Separator
              orientation="vertical"
              className={cn(
                "bg-[#1E293B] group-hover:bg-[#1E293B] dark:group-hover:bg-white",
                isActive && "bg-white w-[1.5px] "
              )}
            />
            <Icon name={icon} size={"20"} />
           
             <p className={cn("text-sm ml-4 text-start w-[110px]",isCollapsed?'hidden group-hover:block':'block')}>{title}</p>
          
         

            {shortcut && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-xs space-x-0.5 flex">
                      <ArrowBigUp size={14} /> <span>{shortcut}</span>
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs space-x-0.5 flex">
                      <ArrowBigUp size={14} /> <span>Shift+{shortcut}</span>
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </Button>
        </Link>
        </Can>
      )}
    </>
  )
}
