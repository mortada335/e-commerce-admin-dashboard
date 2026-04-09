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

import { Loader2, ShieldBan, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { userEditSchema } from "@/utils/validation/user";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { setIsChangePasswordDialogOpen, setIsChangeStatusDialogOpen, useUserStore } from "../../store";
import WrapperComponent from "@/components/layout/WrapperComponent";
// import UserAddresses from "./UserAddresses";
import ChangePasswordDialog from "./ChangePasswordDialog";
import Can from "@/components/Can";
import useCan from "@/hooks/useCan";
import OnChangeStatus from "@/components/Dialogs/OnChangeStatus";
import { useTranslation } from "react-i18next";

const UserInfo = ({ id, userData, isUserDataLoading, isError, error }) => {
  const defaultFormFields = {
    username: "",
    first_name: "",
    last_name: "",
    status: "active",
  };
  //   const { } = useUserStore()
  const { toast } = useToast();
  const {t} = useTranslation()
  const [formFields, setFormFields] = useState(defaultFormFields);
const canUpdateAction = useCan(["app_api.change_ocuser"]);
  const form = useForm({
    resolver: yupResolver(userEditSchema),
    defaultValues: defaultFormFields,
  });
  const {
    isChangeStatusDialogOpen,
   
  } = useUserStore();

  const [isSubmit, setIsSubmit] = useState(false);

    const handleStatus = async () => {
      setIsChangeStatusDialogOpen(true);
    };

  const {
    mutate,

    isPending: isAction,
  } = useMutation("UserDetails");

  useEffect(() => {
    const userNewStatus = formFields.status === "active" ? true : false;

    const isUpdated =
      formFields.username !== userData?.username ||
      formFields.first_name !== userData?.first_name ||
      formFields.last_name !== userData?.last_name ||
      userNewStatus !== userData.is_active
        ? true
        : false;
    if (
      formFields.username &&
      formFields.first_name &&
      formFields.last_name &&
      isUpdated
    ) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [formFields]);

  useEffect(() => {
    if (userData !== null && userData !== undefined) {
      setFormFields({
        username: userData?.username,
        first_name: userData?.first_name,
        last_name: userData?.last_name,

        status: userData?.is_active ? "active" : "inactive",
      });
      form.setValue("username", userData?.username);
      form.setValue("first_name", userData?.first_name);
      form.setValue("last_name", userData?.last_name);

      form.setValue("status", userData?.is_active ? "active" : "inactive");
    } else {
      // this is server error or other erro that could happen
      setFormFields(defaultFormFields);
      form.reset();
    }
  }, [userData]);

  const onSubmit = async () => {
    // Validate currency Change
    if (
      !formFields.username ||
      !formFields.first_name ||
      !formFields.last_name
    ) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }

    const formData = {
      // username: formFields.username,
      first_name: formFields.first_name,
      last_name: formFields.last_name,
      is_active: formFields.status === "active" ? true : false,
    };

    formData.username=userData?.username

    mutate({
      url: USERS_URL,
      id: id,
      headers: {
        "Content-Type": "application/json",
      },
      onFinish: () => {},

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
        emptyStateMessage={t("There is no user data")}
      >
          <Can permissions={["app_api.change_ocuser"]}>
           <Card className="flex justify-start rtl:flex-row-reverse items-center w-full px-2  py-2 gap-2">
            <Button
              variant={"default"}
              onClick={() => {
                setIsChangePasswordDialogOpen(true);
              }}
            >
              {t("Change Password")}
            </Button>
            <Button
              variant={"default"}
              onClick={handleStatus}
            >
              {userData?.is_active ? (
                <ShieldBan size={16} />
              ) : (
                <ShieldCheck size={16} />
              )}
              <span>{userData?.is_active ? t("Enabled") : t("Disable")}</span>
            </Button>
          </Card>
        </Can>

        <Card className="flex flex-col justify-start items-start rtl:items-end w-full h-full px-4 py-4 space-y-4">
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
                <div className=" w-full grid sm:grid-cols-2 md:grid-cols-3 place-content-start place-items-start gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="w-full px-1 pt-0">
                        <FormLabel className="capitalize">
                          {" "}
                          <span className="text-red-500 text-xl">*</span>
                          {t("Phone Number")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={!canUpdateAction}
                            type="text"
                            readOnly
                            placeholder={t("Enter your phone number")}
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
                          disabled={!canUpdateAction}
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
                          disabled={!canUpdateAction}
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

                  {/* <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="space-y-3 px-1 pt-0">
                        <FormLabel>{t("Status")}</FormLabel>
                        <FormControl>
                          <RadioGroup

                          disabled={true}
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
                  /> */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="space-y-3 px-1 pt-0">
                        <FormLabel>{t("Status")}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            disabled={true}
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              setFormFields((prev) => ({ ...prev, status: value }));
                            }}
                            className="flex space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="active" />
                              </FormControl>
                              <FormLabel className="font-normal capitalize">
                                {t("Active")}
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
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
                </div>

                <Can permissions={["app_api.change_ocuser"]}>
                  <div className="flex justify-start items-center rtl:flex-row-reverse w-full py-2 space-x-4 px-1">
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
              <OnChangeStatus
          name={"Users"}
          heading={t("Are you absolutely sure?")}
          description={`This action will ${
            userData?.is_active ? "Disable" : "Enabled"
          }  "${userData?.first_name} ${userData?.last_name}".`}
          url={`change-user-status/`}
          id={``}
          isDialogOpen={isChangeStatusDialogOpen}
          setIsDialogOpen={setIsChangeStatusDialogOpen}
          headers={{
            "Content-Type": "multipart/form-data",
          }}
          data={{
            user_id: userData?.id,
            is_active: userData?.is_active ? false : true,
          }}
          requestType="post"
        />
    </div>
  );
};

export default UserInfo;
