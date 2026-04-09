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

import { CREATE_USER_URL } from "@/utils/constants/urls";
import useMutation from "@/hooks/useMutation";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import CustomsMultiCombobox from "@/components/ui/customs-multi-combobox";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { userSchema } from "@/utils/validation/user";
import { setIsUserDialogOpen, useUserStore } from "../store";
import Can from "@/components/Can";
import { useTranslation } from "react-i18next";
import { ADD_ROLES_TO_USER, ROLES_URL } from "@/utils/constants/urls";
import { axiosPrivate } from "@/api/axios";

const defaultFormFields = {
  username: "",
  first_name: "",
  last_name: "",
  password: "",
  status: "active",
};

export default function UserDialog() {
  const { isUserDialogOpen, selectedUser } = useUserStore();
  const { toast } = useToast();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [createdUserRes, setCreatedUserRes] = useState(null);
  const {t} = useTranslation()

  const form = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: defaultFormFields,
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const {
    mutate,

    isPending: isAction,
  } = useMutation("Users");

  useEffect(() => {
    if (
      selectedUser &&
      formFields.username &&
      formFields.first_name &&
      formFields.last_name
    ) {
      setIsSubmit(true);
    } else if (
      !selectedUser &&
      formFields.username &&
      formFields.first_name &&
      formFields.last_name &&
      formFields.password
    ) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [formFields]);

  useEffect(() => {
    if (
      selectedUser !== null &&
      selectedUser !== undefined &&
      isUserDialogOpen
    ) {
      setFormFields({
        username: selectedUser.username,
        first_name: selectedUser.first_name,
        last_name: selectedUser.last_name,

        status: selectedUser.status ? "active" : "inactive",
      });
      form.setValue("username", selectedUser.username);
      form.setValue("first_name", selectedUser.first_name);
      form.setValue("last_name", selectedUser.last_name);

      form.setValue("status", selectedUser.status ? "active" : "inactive");
    } else {
      // this is server error or other erro that could happen
      setFormFields(defaultFormFields);
      form.reset();
    }
  }, [selectedUser]);

  const onClose = () => {
    setIsUserDialogOpen(false);
    form.reset();

    setFormFields(defaultFormFields);
  };

  const onSubmit = async () => {
    // Validate currency Change
    if (
      !selectedUser &&
      (!formFields.username ||
        !formFields.first_name ||
        !formFields.last_name ||
        !formFields.password)
    ) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    } else if (
      selectedUser &&
      (!formFields.username || !formFields.first_name || !formFields.last_name)
    ) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }

    const formData = {
      first_name: formFields.first_name,
      last_name: formFields.last_name,
      is_active: formFields.status === "active" ? true : false,
    };

    if (selectedUser?.id) {
      formData.username = selectedUser.username;
    } else {
      formData.username = formFields.username;
      formData.password = formFields.password;
      formData.is_staff = false;
      // formData.email = ""; *Opitional
    }

    if (selectedUser?.id) {
      mutate({
        url: CREATE_USER_URL,
        id: selectedUser?.id,
        headers: { "Content-Type": "application/json" },
        onFinish: onClose,
        formData,
      });
    } else {
      // Create user then optionally assign roles
      mutate({
        url: CREATE_USER_URL,
        headers: { "Content-Type": "application/json" },
        isAddProduct: true,
        setRes: setCreatedUserRes,
        onFinish: () => onClose(),
        formData,
      });
    }
  };

  useEffect(() => {
    const assign = async () => {
      const newId = createdUserRes?.data?.id;
      if (!newId) return;
      if (selectedRoles.length > 0) {
        try {
          await axiosPrivate.post(ADD_ROLES_TO_USER, {
            user_id: newId,
            roles_ids: selectedRoles.map((r) => r.id),
          });
        } catch (e) {
          // notify but continue closing
          toast({
            variant: "destructive",
            title: t("Failed!!!"),
            description: e?.message || t("Failed to assign roles"),
          });
        }
      }
      onClose();
      setCreatedUserRes(null);
    };
    if (createdUserRes) assign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdUserRes]);

  return (
    <Can permissions={["app_api.view_currencyexchange"]}>

    <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
    <DialogContent className="w-[95%] sm:max-w-[700px] px-4 ">
      <ScrollArea className=" w-[99%] md:w-full border-none">

        <ScrollArea className=" h-fit pr-4 w-full ">
          <DialogHeader className={"rtl:items-end"}>
            <DialogTitle>
              {selectedUser?.id ? t("Edit") : t("Create")} {t("User")}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.id ? t("Make changes to any User here.") : t("Create User here.")}
              {t("Click save when you are done.")}
            </DialogDescription>
          </DialogHeader>

          <Form {...form} className="h-full bg-black">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 ">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="relative w-full px-1 pt-0">
                    <FormLabel className="capitalize">
                      {" "}
                      <span className="text-red-500 text-xl">*</span>{t("Phone Number")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        readOnly={selectedUser?.id}
                        placeholder="e.g 7712885482" // Example
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);

                              setFormFields({
                                ...formFields,
                                username: `+964${e.target.value}`,
                              });
                            }}
                            autoComplete="NewUsername"
                          />
                        </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="w-full px-1 pt-0">
                    <FormLabel className="capitalize">
                      {" "}
                      <span className="text-red-500 text-xl">*</span>{t("First Name")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("First Name")}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);

                              setFormFields({
                                ...formFields,
                                first_name: e.target.value,
                              });
                            }}
                            autoComplete="first_name"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem className="w-full px-1 pt-0">
                    <FormLabel className="capitalize">
                      {" "}
                      <span className="text-red-500 text-xl">*</span>{t("Last Name")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("Last Name")}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);

                              setFormFields({
                                ...formFields,
                                last_name: e.target.value,
                              });
                            }}
                            autoComplete="last_name"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

              {/* Render the password field on user creation onyl. */}
              {!selectedUser && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 pt-0">
                      <FormLabel className="capitalize">
                        {" "}
                        <span className="text-red-500 text-xl">*</span>{t("Password")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                                setFormFields({
                                  ...formFields,
                                  password: e.target.value,
                                });
                              }}
                              autoComplete="password"
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

              {/* role selection (optional). if empty stays unassigned */}
              {!selectedUser && (
                <div className="px-1">
                  <div className="text-sm mb-1 font-medium">{t("Assign Roles")}</div>
                  <CustomsMultiCombobox
                    endpoint={ROLES_URL}
                    itemKey={"id"}
                    setItems={setSelectedRoles}
                    items={selectedRoles}
                    itemTitle={`name`}
                    searchQueryKey="model"
                    sortBy="-date_added"
                    queryKey="name"
                    className="border rounded-md px-1"
                    placeholder={t("Select Roles")}
                  />
                  {selectedRoles.length === 0 && (
                    <div className="text-muted-foreground text-xs mt-1">{t("Unassigned")}</div>
                  )}
                </div>
              )}

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3 px-1">
                    <FormLabel>{t("Status")}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);

                          setFormFields({
                            ...formFields,
                            status: value,
                          });
                        }}
                        autoComplete="status"
                        defaultValue={field.value}
                        className="flex space-x-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="active" />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {t("active")}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="inactive" />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {t("Inactive")}
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-start items-center w-full py-2 space-x-4">
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
