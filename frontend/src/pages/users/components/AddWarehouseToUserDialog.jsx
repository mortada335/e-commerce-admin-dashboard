import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomsMultiCombobox from "@/components/ui/customs-multi-combobox";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

import { ADD_PERMISSION_TO_USER, WAREHOUSES_URL } from "@/utils/constants/urls";
import useMutation from "@/hooks/useMutation";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { userAdminSchemaEdit } from "@/utils/validation/user";
import { setIsWarhouseDialogOpen, useUserStore } from "../store";
import WarehouseAutoComplete from "./WarehouseAutoComplete";

const defaultFormFields = {
  username: "",
  warehouse_ids: [],
};

export default function UserDialog() {
  const { isWarhouseDialogOpen, selectedUser } = useUserStore();
  const { toast } = useToast();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [warehouse, setWarehouse] = useState([]);

  const form = useForm({
    defaultValues: defaultFormFields,
  });

  const { mutate, isPending: isAction } = useMutation("Admins");

  const onClose = () => {
    setIsWarhouseDialogOpen(false);
    form.reset();
    setFormFields(defaultFormFields);
  };

  const onSubmit = async () => {
    const formData = {
      username: selectedUser?.username,
      warehouse_ids: warehouse.map((e) => e.id),
    };

    mutate({
      url: ADD_PERMISSION_TO_USER,
      headers: {
        "Content-Type": "application/json",
      },
      onFinish: onClose,
      formData,
    });
  };

  return (
    <Dialog open={isWarhouseDialogOpen} onOpenChange={setIsWarhouseDialogOpen}>
      <DialogContent className="w-[95%] sm:max-w-[700px] px-4 ">
        <ScrollArea className=" w-[99%] md:w-full border-none">
          <ScrollArea className=" h-[200px] sm:h-[300px] pr-4 w-full ">
            <DialogHeader>
              <DialogTitle>Add Warehouse</DialogTitle>
              <DialogDescription>
                Click save when you are done.
              </DialogDescription>
            </DialogHeader>

            <Form {...form} className="h-full bg-black">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" w-full mt-8"
              >
                <CustomsMultiCombobox
                  endpoint={WAREHOUSES_URL}
                  itemKey={"id"}
                  setItems={setWarehouse}
                  items={warehouse}
                  itemTitle="name"
                  searchQueryKey="model"
                  sortBy="-date_added"
                  queryKey="warehouses"
                  className="border rounded-md px-1"
                  placeholder={"Select warehouse"}
                />
                <div className="flex justify-end items-center w-full py-2 space-x-4 pt-20">
                  <Button variant="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={warehouse.length == 0}>
                    {isAction ? (
                      <p className="flex justify-center items-center space-x-2">
                        <Loader2 className=" h-5 w-5 animate-spin" />
                        <span>Please wait</span>
                      </p>
                    ) : (
                      <span>Save</span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </ScrollArea>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
