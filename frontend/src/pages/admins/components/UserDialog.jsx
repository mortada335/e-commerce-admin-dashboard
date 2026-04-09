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

import { USERS_URL } from "@/utils/constants/urls";
import useMutation from "@/hooks/useMutation";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { userAdminSchemaEdit } from "@/utils/validation/user";
import { setIsUserDialogOpen, useUserStore } from "../store";
import { useTranslation } from "react-i18next";

const defaultFormFields = {
  username: "",
  email: "",
  status: "active",
};

export default function UserDialog() {
  const { isUserDialogOpen, selectedUser } = useUserStore();
  const { toast } = useToast();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [isSubmit, setIsSubmit] = useState(false);
  const {t} = useTranslation()

  const form = useForm({
    resolver: yupResolver(userAdminSchemaEdit),
    defaultValues: defaultFormFields,
  });

  const {
    mutate,

    isPending: isAction,
  } = useMutation("Admins");

  useEffect(() => {
    setIsSubmit(formFields?.username !== selectedUser?.username);
  }, [selectedUser?.username, formFields?.username]);

  useEffect(() => {
    if (
      selectedUser !== null &&
      selectedUser !== undefined &&
      isUserDialogOpen
    ) {
      setFormFields({
        username: selectedUser.username,
        email: selectedUser.first_name,

        status: selectedUser.status ? "active" : "inactive",
      });
      form.setValue("username", selectedUser.username);
      form.setValue("email", selectedUser.email);

      form.setValue("status", selectedUser.status ? "active" : "inactive");
    } else {
      // this is server error or other erro that could happen
      setFormFields(defaultFormFields);
      form.reset();
    }
  }, [selectedUser, isUserDialogOpen, form]);

  const onClose = () => {
    setIsUserDialogOpen(false);
    form.reset();

    setFormFields(defaultFormFields);
  };

  const onSubmit = async () => {
    // Validate currency Change
    if (!formFields.username) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }

    const formData = {
      username: formFields.username,
      // email: formFields.email || null,
      // is_superuser: 1,
    };

    mutate({
      url: USERS_URL,
      id: selectedUser?.id,
      headers: {
        "Content-Type": "application/json",
      },
      onFinish: onClose,

      formData,
    });
  };

  return (
    <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
       <DialogContent className="w-[95%] sm:max-w-[700px] px-4 ">
      <ScrollArea className=" w-[99%] md:w-full border-none">

        <ScrollArea className=" h-fit pr-4 w-full ">
          <DialogHeader className={"rtl:items-end"}>
            <DialogTitle>
              {selectedUser?.id ? t("Edit") : t("Create")} {t("User")}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.id ? "Make changes to any" : t("Create")} User here.
              {t("Click save when you are done.")}
            </DialogDescription>
          </DialogHeader>

          <Form {...form} className="h-full bg-black">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2 w-full mt-8"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="w-full px-1 pt-0">
                    <FormLabel className="capitalize">
                      {" "}
                      <span className="text-red-500 text-xl">*</span>{t("Username")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("Enter your Username")}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setFormFields({
                            ...formFields,
                            username: e.target.value,
                          });
                        }}
                        autoComplete="NewUsername"
                      />
                    </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full px-1 pt-0">
                    <FormLabel className="capitalize">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter an email"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);

                          setFormFields({
                            ...formFields,
                            email: e.target.value,
                          });
                        }}
                        autoComplete="email"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <div className="flex justify-end items-center w-full py-2 space-x-4 pt-20">
                <Button variant="secondary" onClick={onClose}>
                  {t("Cancel")}
                </Button>
                <Button disabled={!isSubmit || isAction} type="submit">
                  {isAction ? (
                    <p className="flex justify-center items-center space-x-2">
                      <Loader2 className=" h-5 w-5 animate-spin" />
                      <span>{t("Please wait")}</span>
                    </p>
                  ) : (
                    <span>{t("Save")}</span>
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
