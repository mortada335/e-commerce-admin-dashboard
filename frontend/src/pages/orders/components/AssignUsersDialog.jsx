import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import CustomsMultiCombobox from "@/components/ui/customs-multi-combobox";
import { useTranslation } from "react-i18next";
import { setIsAssignUsersDialog, useOrderStore } from "../store";
import usePatch from "@/hooks/usePatch";
import { USERS_URL } from "@/utils/constants/urls";
import Can from "@/components/Can";
import { toast } from "sonner";

export default function AssignUsersDialog(queryKey) {
  const { t } = useTranslation();
  const { isAssignUsers, selectedOrder } = useOrderStore();

  const [users, setUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const { mutate: patchMutate, isPending: isAction } = usePatch({
    queryKey: "Orders",
    onSuccess: () => {
      toast.success(t("Users assigned successfully."));
      onClose();
    },
    onError: (error) => {
      toast.error(error?.message || t("Something went wrong."));
    },
  });

  const onClose = () => {
    setIsAssignUsersDialog(false);
    setUsers([]);
    setFilteredUsers([]);
    setIsSubmitting(false);
  };

  // Reset when dialog closes
  useEffect(() => {
    if (!isAssignUsers) {
      setUsers([]);
      setFilteredUsers([]);
      setIsSubmitting(false);
    }
  }, [isAssignUsers]);

  // Filter users by warehouse_id when data changes
  // useEffect(() => {
  //   if (users?.length > 0 && selectedOrder?.warehouse?.id) {
  //     const warehouseId = selectedOrder.warehouse.id;
  //     const filtered = users.filter((u) =>
  //       Array.isArray(u.warehouse_ids)
  //         ? u.warehouse_ids.includes(warehouseId)
  //         : false
  //     );
  //     setFilteredUsers(filtered);
  //   } else {
  //     setFilteredUsers([]);
  //   }
  // }, [users, selectedOrder]);

  const handleAssignUsers = async () => {
    if (!selectedOrder?.id) {
      toast.error(t("No order selected."));
      return;
    }

    // if (filteredUsers.length === 0) {
    if (users.length === 0) {
      toast.error(t("Please select at least one user to assign."));
      return;
    }

    try {
      setIsSubmitting(true);
      const body = {
        // assignee_ids: filteredUsers.map((user) => user.id),
        assignee_ids: users?.map((user) => user.id),
      };

      patchMutate({
        endpoint: "v2/orders_admin/",
        id: selectedOrder.id,
        headers: { "Content-Type": "application/json" },
        body,
        onFinish: onClose,
      });
    } catch (error) {
      toast.error(error?.message || t("Failed to assign users."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Can permissions={["app_api.assign_ocorder"]}>
      <Dialog open={isAssignUsers} onOpenChange={setIsAssignUsersDialog}>
        <DialogContent className="w-[95%] sm:max-w-[700px] px-4">
          <ScrollArea className="h-fit pr-4 w-full">
            <DialogHeader className="rtl:items-end mb-3">
              <DialogTitle>{t("Assign Users")}</DialogTitle>
              <DialogDescription>
                {t("Click save when you are done.")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <CustomsMultiCombobox
                endpoint={USERS_URL}
                itemKey="id"
                itemTitle="first_name"
                placeholder={t("Select Users")}
                sortBy="-date_added"
                queryKey="users-list"
                items={users}
                setItems={setUsers}
                filters={[
                  { key: "is_picker", value: true },
                  // The API doesn't filter warehouse_ids, so we handle it manually above
                ]}
              />

              {/* {users.length > 0 && filteredUsers.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  {t("No users found in this warehouse.")}
                </p>
              )} */}

              <div className="flex justify-start items-center w-full py-2 space-x-4">
                <Button
                  onClick={handleAssignUsers}
                  disabled={isSubmitting || users?.length === 0}
                >
                  {isSubmitting || isAction ? (
                    <p className="flex justify-center items-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>{t("Please wait")}</span>
                    </p>
                  ) : (
                    <span>{t("Save")}</span>
                  )}
                </Button>

                <Button variant="secondary" onClick={onClose}>
                  {t("Cancel")}
                </Button>
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Can>
  );
}
