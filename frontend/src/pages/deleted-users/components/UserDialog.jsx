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

import { ScrollArea } from "@/components/ui/scroll-area";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { userSchema } from "@/utils/validation/user";
import { setIsUserDialogOpen, useUserStore } from "../store";

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

    mutate({
      url: CREATE_USER_URL,
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
      <DialogContent className="sm:max-w-[700px]">
        <ScrollArea className=" h-[500px] pr-4 w-full ">
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.id ? "Edit" : "Create"} User
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.id ? "Make changes to any" : "Create"} User here.
              Click save when you are done.
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
                      <span className="text-red-500 text-xl">*</span>Phone
                      Number
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
                      <span className="text-red-500 text-xl">*</span>First Name
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
                      <span className="text-red-500 text-xl">*</span>Last Name
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

              {/* Render the password field on user creation onyl. */}
              {!selectedUser && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 pt-0">
                      <FormLabel className="capitalize">
                        {" "}
                        <span className="text-red-500 text-xl">*</span>Password
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

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3 px-1">
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

              <div className="flex justify-end items-center w-full py-2 space-x-4">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button disabled={!isSubmit || isAction} type="submit">
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
      </DialogContent>
    </Dialog>
  );
}
