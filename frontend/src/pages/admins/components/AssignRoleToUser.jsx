import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import CustomsMultiCombobox from "@/components/ui/customs-multi-combobox";
import { useTranslation } from "react-i18next";
import { axiosPrivate } from "@/api/axios";
import { ADD_ROLES_TO_USER, ROLES_URL } from "@/utils/constants/urls";
import { setIsAssignRoleToUserDialogOpen, useUserStore } from "../store";

export default function AssignRoleToUser() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isAssignRoleToUserDialogOpen, selectedUser } = useUserStore();
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAssignRoleToUserDialogOpen) {
      setSelectedRoles([]);
      setIsSubmitting(false);
    }
  }, [isAssignRoleToUserDialogOpen]);

  const handleAssignRoles = async () => {
    if (!selectedUser?.id) {
      toast({
        variant: "destructive",
        title: t("Failed!!!"),
        description: t("No user selected."),
      });
      return;
    }
    if (selectedRoles.length === 0) {
      toast({
        variant: "destructive",
        title: t("No roles selected"),
        description: t("Please select at least one role to assign."),
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await axiosPrivate.post(ADD_ROLES_TO_USER, {
        user_id: selectedUser.id,
        username: selectedUser?.username,
        roles: selectedRoles.map((r) => r.name),
      });

      toast({
        title: t("Success"),
        description: t("Roles assigned successfully"),
      });

      setIsAssignRoleToUserDialogOpen(false);
      // await axiosPrivate.get(ADD_ROLES_TO_USER, {
      //   user_id: selectedUser.id,
      //   username: selectedUser?.username,
      //   roles: selectedRoles.map((r) => r.name),
      // });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("Failed!!!"),
        description: error?.message || t("Failed to assign roles."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isAssignRoleToUserDialogOpen}
      onOpenChange={setIsAssignRoleToUserDialogOpen}
    >
      <DialogContent className="w-[95%] sm:max-w-[600px] px-4">
        <ScrollArea className="w-full h-fit border-none">
          <DialogHeader className="rtl:items-end">
            <DialogTitle>{t("Assign Roles")}</DialogTitle>
            <DialogDescription>
              {t("Click save when you are done.")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <div className="text-sm mb-1 font-medium">{t("Roles")}</div>
              <CustomsMultiCombobox
                endpoint={ROLES_URL}
                itemKey="id"
                setItems={setSelectedRoles}
                items={selectedRoles}
                itemTitle="name"
                searchQueryKey="model"
                sortBy="-date_added"
                queryKey="name"
                className="border rounded-md px-1"
                placeholder={t("Select Roles")}
              />
            </div>

            <div className="flex justify-end items-center gap-2 pt-4">
              <Button
                variant="secondary"
                onClick={() => setIsAssignRoleToUserDialogOpen(false)}
              >
                {t("Cancel")}
              </Button>
              <Button disabled={isSubmitting} onClick={handleAssignRoles}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" />{" "}
                    {t("Please Wait")}
                  </span>
                ) : (
                  t("Save")
                )}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
