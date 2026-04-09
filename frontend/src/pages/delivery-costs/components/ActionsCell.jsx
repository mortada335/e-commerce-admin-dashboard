import {
  Eye,
  MoreHorizontal,
  ShieldBan,
  ShieldCheck,
  SquarePen,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import Can from "@/components/Can";
import { setIsUpdateDeliveryCostDialogOpen, setSelectedDeliveryCost } from "../store";
import { useTranslation } from "react-i18next";


const ActionsCell = ({ item }) => {
  // Toast for notification.

  const {t} = useTranslation()

  // Edit Action
  const handleEdit = () => {
    setSelectedDeliveryCost(item);
    setIsUpdateDeliveryCostDialogOpen(true);
  };



  return (
    <>
<Can permissions={["app_api.change_deliverycost"]}>
            <Button
              variant="ghost"
              className="flex justify-start items-center space-x-2 cursor-pointer"
              onClick={handleEdit}
            >
              <SquarePen size={16} /> <span>{t("Update")}</span>{" "}
            </Button>
          </Can>
    </>
  );
};

export default ActionsCell;
