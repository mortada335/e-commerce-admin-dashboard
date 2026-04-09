import { MoreHorizontal, SquarePen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  setIsSMSLogDialogOpen,
  
  setSelectedSMSLog,
} from "../store";
import Can from "@/components/Can";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

const ActionsCell = ({ item }) => {
  // Toast for notificaiton.
  const { toast } = useToast();
  const {t} = useTranslation()
  // Edit SMSLog Action
  const handleEditSMSLog = () => {
    setSelectedSMSLog(item);
    setIsSMSLogDialogOpen(true);
  };


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">{t("Open menu")}</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(item.SMSLog_image_id);
              toast({
                title: t("Copied"),
                description: `${item.SMSLog_image_id} ${t("copied to clipboard successfully.")}`,
              });
            }}
          >
            {t("Copy Id")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2 cursor-pointer"
              onClick={handleEditSMSLog}
            >
              <SquarePen size={16} /> <span>{t("Edit")}</span>{" "}
            </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ActionsCell;
