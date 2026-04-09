

import { ChevronLeft, ChevronRight } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router-dom"
import Can from "../Can"
import { cn } from "@/lib/utils"

export function NavMain({
  title,
  items=[],
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl"; // Check if the current language is RTL
  const location = useLocation();
  const permissions =
    (items || []).reduce((acc, item) => acc.concat(item?.permissions || []), []);

  return (
      <Can key={title}
        permissions={permissions}
        requireAll={false}>
    <SidebarGroup>
      <SidebarGroupLabel className="h-4 mb-2 capitalize font-bold text-sm text-[#333333] dark:text-gray-300 ">{t(title||"pages")}</SidebarGroupLabel>
  
      <SidebarMenu>
        {items?.map((item) => (
            
          !!item?.items?.length?
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
              <SidebarMenuItem>
                <Can key={item.title} permissions={item?.permissions}  requireAll={false}>
                <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon/>}
                  <span>{t(item.title)}</span>
                  {isRTL? <ChevronLeft className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />: <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>} 
                </SidebarMenuButton>
              </CollapsibleTrigger>
                </Can>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <Can key={subItem.title} permissions={subItem?.permissions}  requireAll={false}>
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                      <Link
                        to={subItem.url}
                        className={cn(
                          "",
                          location.pathname === subItem.url &&
                            "bg-primary  text-slate-50 hover:!bg-primary  hover:text-slate-50"
                        )}
                      >
                         {subItem.icon && <subItem.icon className={cn("",location.pathname === subItem.url &&'!text-slate-50  hover:text-slate-50')}/>}
                        <span>{t(subItem.title)}</span>
                      </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    </Can>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
                :
                    <Can key={item.title} permissions={item?.permissions} requireAll={false}>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={cn(
                          "",
                          location.pathname === item.url &&
                            "bg-primary  text-slate-50 hover:!bg-primary  hover:text-slate-50"
                        )}
                      >
                         {item.icon && <item.icon/>}
                        <span>{t(item.title)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Can>
             
                
            
            
        ))}
      </SidebarMenu>
    </SidebarGroup>
        </Can>
  )
}
