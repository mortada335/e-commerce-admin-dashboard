import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomsMultiCombobox from "@/components/ui/customs-multi-combobox";
import { ROLES_URL, ADD_ROLES_TO_USER } from "@/utils/constants/urls";
import useMutation from "@/hooks/useMutation";
import { setIsAssignRolesDialogOpen, useUserStore } from "../store";
import Can from "@/components/Can";

const defaultFormFields = { 
  username:""
  ,roles: [], 
};

export default function AssignRolesDialog() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isAssignRolesDialogOpen, selectedUser } = useUserStore();
  const [roles, setRoles] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false)
  const [formFields,setFormFields] = useState(defaultFormFields)

  const form = useForm({ defaultValues: defaultFormFields });
  const { mutate, isPending: isAction } = useMutation("Users");

  useEffect(()=>{
    if(isAssignRolesDialogOpen && selectedUser){

      setFormFields({
        username: selectedUser?.username,
        roles: selectedUser?.roles?.map((role)=>role.id)
      })
      form.setValue("username", selectedUser?.username)
      form.setValue("roles", selectedUser?.roles?.map((role)=>role.id))

      console.log(selectedUser)
    }
  },[selectedUser])

  const onClose = () => {
    setIsAssignRolesDialogOpen(false);
    setRoles([]);
    form.reset();
    setFormFields(defaultFormFields)
  };

  const onSubmit = async () => {
    const formData = {
      user_id: selectedUser?.id,
      username: selectedUser?.username,
      roles_ids: roles.map((r) => r.id),
    };

    mutate({
      url: ADD_ROLES_TO_USER,
      headers: { "Content-Type": "application/json" },
      onFinish: onClose,
      formData,
    });
  };

  return (
    <Can permissions={["app_api.change_ocuser"]}>
      <Dialog open={isAssignRolesDialogOpen} onOpenChange={setIsAssignRolesDialogOpen}>
        <DialogContent className="w-[95%] sm:max-w-[700px] px-4 ">
          <ScrollArea className=" w-[99%] md:w-full border-none">
            <ScrollArea className=" h-[300px] pr-4 w-full ">
              <DialogHeader className="rtl:items-end mb-3">
                <DialogTitle>{t("Assign Roles")}</DialogTitle>
                <DialogDescription>{t("Click save when you are done.")}</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 ">
                  <CustomsMultiCombobox
                    endpoint={ROLES_URL}
                    itemKey={"id"}
                    setItems={setRoles}
                    items={roles}
                    itemTitle={`name`}
                    searchQueryKey="model"
                    sortBy="-date_added"
                    queryKey="name"
                    className="border rounded-md px-1"
                    placeholder={t("Select Roles")}
                  />
                  <div className="flex justify-start items-center w-full py-2 space-x-4">
                    <Button disabled={roles.length === 0 || isAction} type="submit">
                      {isAction ? (
                        <p className="flex justify-center items-center space-x-2">
                          <Loader2 className=" h-5 w-5 animate-spin" />
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
                </form>
              </Form>
            </ScrollArea>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Can>
  );
}


