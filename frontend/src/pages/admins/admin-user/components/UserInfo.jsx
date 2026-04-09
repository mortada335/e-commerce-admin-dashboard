import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { USERS_URL } from "@/utils/constants/urls";
import useMutation from "@/hooks/useMutation";

import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { userAdminSchemaEdit } from "@/utils/validation/user";
import { useToast } from "@/components/ui/use-toast";
import { setIsChangePasswordDialogOpen } from "../../store";
import WrapperComponent from "@/components/layout/WrapperComponent";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { useQueryClient } from "@tanstack/react-query";
import Can from "@/components/Can";
import useCan from "@/hooks/useCan";
import { useTranslation } from "react-i18next";

const UserInfo = ({ id, userData, isUserDataLoading, isError, error }) => {
  const defaultFormFields = useMemo(
    () => ({
      username: "",
      email: "",
      status: "active",
    }),
    []
  );
  //   const { } = useUserStore()
  const { toast } = useToast();
  const {t} = useTranslation()
  const [formFields, setFormFields] = useState(defaultFormFields);
  const canUpdateAction = useCan(["app_api.change_ocuser"]);
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: yupResolver(userAdminSchemaEdit),
    defaultValues: defaultFormFields,
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const {
    mutate,

    isPending: isAction,
  } = useMutation("UserDetails");

  useEffect(() => {
    const userNewStatus = formFields.status === "active" ? true : false;

    const isUpdated =
      formFields.username !== userData?.username ||
      formFields.email !== userData?.email ||
      userNewStatus !== userData.is_active
        ? true
        : false;
    if (formFields.username && isUpdated) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [formFields]);

  useEffect(() => {
    if (userData !== null && userData !== undefined) {
      setFormFields({
        username: userData?.username,
        email: userData?.email,

        status: userData?.is_active ? "active" : "inactive",
      });
      form.setValue("username", userData?.username);
      form.setValue("email", userData?.email);

      form.setValue("status", userData?.is_active ? "active" : "inactive");
    } else {
      // this is server error or other erro that could happen
      setFormFields(defaultFormFields);
      form.reset();
    }
  }, [userData]);

  const onSubmit = async () => {
    // Validate currency Change
    if (!formFields.username || !formFields.status) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }

    const formData = {
      username: formFields.username,
      // email: formFields.email,
      // is_active: formFields.status === "active" ? true : false,
    };

    mutate({
      url: USERS_URL,
      id: id,
      headers: {
        "Content-Type": "application/json",
      },
      onFinish: () => {},
      onSuccess: () => {
        queryClient.invalidateQueries(["UserDetails"]);
      },

      formData,
    });
  };
  return (
    <div className="flex flex-col justify-start items-start w-full h-full space-y-4">
      <WrapperComponent
        isEmpty={!userData?.id}
        isError={isError}
        error={error}
        isLoading={isUserDataLoading}
        loadingUI={
          <div className="flex justify-center items-center space-x-2 h-[450px] w-full">
            <Loader2 className=" h-5 w-5 animate-spin" />
            <span>{t("Please wait")}</span>
          </div>
        }
        emptyStateMessage={"There is no user data"}
      >
         <Can permissions={["app_api.change_passwordresets"]}>

        <Card className="flex justify-start items-center w-full px-2  py-2">
          <Button
            variant={"default"}
            onClick={() => {
              setIsChangePasswordDialogOpen(true);
            }}
          >
            {t("Change Password")}
          </Button>
        </Card>
         </Can>
        <Card className="flex flex-col justify-start items-start w-full h-full px-4 py-4 space-y-4">
          <CardHeader className="py-2 ">
            <CardTitle>{t("Update Info")}</CardTitle>
            <CardDescription>
              {t("Make changes to Info here. Click save when you are done.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <Form {...form} className="h-full ">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" w-full space-y-4"
              >
                <div className=" w-full grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 place-content-start place-items-start gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="w-full px-1 pt-0">
                        <FormLabel className="capitalize">
                          {" "}
                          <span className="text-red-500 text-xl">*</span>
                          {t("Username")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={!canUpdateAction}
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
                        <FormLabel className="capitalize">
                          {" "}
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="test@gmail.com"
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
                </div>
                <Can permissions={["app_api.change_ocuser"]}>

                <div className="flex justify-start items-center w-full py-2 space-x-4 px-1">
                  <Button disabled={!isSubmit || isAction} type="submit">
                    {isAction ? (
                      <p className="flex justify-center items-center space-x-2">
                        <Loader2 className=" h-5 w-5 animate-spin" />
                        <span>{t("Please wait")}</span>
                      </p>
                    ) : (
                      <span>{t("Save Changes")}</span>
                    )}
                  </Button>
                </div>
                </Can>
              </form>
            </Form>
          </CardContent>
        </Card>
      </WrapperComponent>
      <ChangePasswordDialog id={id} />
    </div>
  );
};

export default UserInfo;
