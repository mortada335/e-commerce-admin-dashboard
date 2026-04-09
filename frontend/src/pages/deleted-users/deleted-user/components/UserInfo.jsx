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
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { userSchema } from "@/utils/validation/user";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { setIsChangePasswordDialogOpen } from "../../store";
import WrapperComponent from "@/components/layout/WrapperComponent";
import UserAddresses from "./UserAddresses";
import ChangePasswordDialog from "./ChangePasswordDialog";
import Can from "@/components/Can";

const UserInfo = ({ id, userData, isUserDataLoading, isError, error }) => {
  const defaultFormFields = {
    username: "",
    first_name: "",
    last_name: "",
    status: "active",
  };
  //   const { } = useUserStore()
  const { toast } = useToast();
  const [formFields, setFormFields] = useState(defaultFormFields);

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
            <span>Please wait</span>
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
              Change Password
            </Button>
          </Card>
        </Can>

        <Card className="flex flex-col justify-start items-start w-full h-full px-4 py-4 space-y-4">
          <CardHeader className="py-2 ">
            <CardTitle>Update Info</CardTitle>
            <CardDescription>
              Make changes to Info here. Click save when you are done.
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
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            readOnly
                            placeholder="Enter your phone number"
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
                          <span className="text-red-500 text-xl">*</span>First
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="First Name"
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
                          <span className="text-red-500 text-xl">*</span>Last
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Last Name"
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

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="space-y-3 px-1 pt-0">
                        <FormLabel>Status</FormLabel>
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
                                active
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="inactive" />
                              </FormControl>
                              <FormLabel className="font-normal capitalize">
                                Inactive
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
                  <div className="flex justify-start items-center w-full py-2 space-x-4 px-1">
                    <Button disabled={!isSubmit || isAction} type="submit">
                      {isAction ? (
                        <p className="flex justify-center items-center space-x-2">
                          <Loader2 className=" h-5 w-5 animate-spin" />
                          <span>Please wait</span>
                        </p>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </Button>
                  </div>
                </Can>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* USER ADDRESSES SECTION */}
        {/* <UserAddresses id={id} /> */}
      </WrapperComponent>
      <ChangePasswordDialog id={id} />
    </div>
  );
};

export default UserInfo;
