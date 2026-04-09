import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import CustomsMultiCombobox from "@/components/ui/customs-multi-combobox";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { setIsWarhouseDialogOpen, useUserStore } from "../store";
import useMutation from "@/hooks/useMutation";
import { ADD_WAREHOUSES_TO_USER, WAREHOUSES_URL } from "@/utils/constants/urls";

export default function AddWarehouseToUserDialog() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isWarhouseDialogOpen, selectedUser } = useUserStore();

  const [warehouses, setWarehouses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate, isPending } = useMutation("Admins");

  const onClose = () => {
    setIsWarhouseDialogOpen(false);
    setWarehouses([]);
    setIsSubmitting(false);
  };
    useEffect(()=>{
      if(isWarhouseDialogOpen && selectedUser){
        console.log(selectedUser)
        // setWarehouses(selectedUser?.warehouse_ids || [])
      }
    },[isWarhouseDialogOpen])

  const handleSave = () => {
    if (!selectedUser?.username) return;

    if (warehouses.length === 0) {
      toast({
        title: t("Error"),
        description: t("Please select at least one warehouse."),
      });
      return;
    }

    setIsSubmitting(true);
console.log(selectedUser)
    const formData = {
      username: selectedUser.username,
      warehouse_ids: warehouses.map((w) => w.id),
    };

    mutate({
      url: ADD_WAREHOUSES_TO_USER,
      headers: { "Content-Type": "application/json" },
      formData,
      onFinish: () => {
        onClose();
        toast({
          title: t("Success"),
          description: t("Warehouses added successfully."),
        });
      },
      onError: (error) => {
        toast({
          title: t("Error"),
          description: error?.message || t("Something went wrong."),
        });
      },
    });
  };

  return (
    <Dialog open={isWarhouseDialogOpen} onOpenChange={setIsWarhouseDialogOpen}>
      <DialogContent className="w-[95%] sm:max-w-[700px] px-4">
        <ScrollArea className="w-full">
          <ScrollArea className="h-[200px] sm:h-[300px] pr-4 w-full">
            <DialogHeader className="rtl:items-end">
              <DialogTitle>{t("Add Warehouse")}</DialogTitle>
              <DialogDescription>{t("Click save when you are done.")}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-6">
              <CustomsMultiCombobox
                endpoint={WAREHOUSES_URL}
                itemKey="id"
                itemTitle="name"
                items={warehouses}
                setItems={setWarehouses}
                placeholder={t("Select Warehouses")}
                queryKey="warehouses"
                sortBy="-date_added"
                className="border rounded-md px-1"
              />

              <div className="flex justify-end items-center w-full py-2 space-x-4">
                <Button variant="secondary" onClick={onClose}>
                  {t("Cancel")}
                </Button>
                <Button onClick={handleSave} disabled={isSubmitting || isPending || warehouses.length === 0}>
                  {isSubmitting || isPending ? (
                    <p className="flex justify-center items-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>{t("Please wait")}</span>
                    </p>
                  ) : (
                    <span>{t("Save")}</span>
                  )}
                </Button>
              </div>
            </div>
          </ScrollArea>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
