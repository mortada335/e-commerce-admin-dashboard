import Section from "@/components/layout/Section";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
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
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { userAdminSchema } from "@/utils/validation/user";
import { useEffect, useMemo, useState } from "react";
import useMutation from "@/hooks/useMutation";
import { toast } from "@/components/ui/use-toast";
import {
  ADD_PERMISSIONS_TO_USER,
  ADMIN_USERS_URL,
  ROLES_URL,
} from "@/utils/constants/urls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { axiosPrivate } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { useModels } from "../admin-user/hooks/usePermissionModels";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Can from "@/components/Can";
import CanSection from "@/components/CanSection";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PermissionCheckbox } from "../admin-user/components/PermissionDetails";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import CustomsMultiCombobox from "@/components/ui/customs-multi-combobox";

// Default form fields.
const DEFAULT_FORM_FIELDS = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  roles: [],
};

// Main component.
const AddPermission = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // React hook form.
  const form = useForm({
    resolver: yupResolver(userAdminSchema),
    defaultValues: DEFAULT_FORM_FIELDS,
  });
  const [selectedRoles, setSelectedRoles] = useState([]);
  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await axiosPrivate.get(ROLES_URL);
      return res.data;
    },
  });

  const permissionsFormData = useForm();

  // Current tab state.
  const [currentTab, setCurrentTab] = useState("user_info");

  // Is user info active state.
  const [isUserInfo, setIsUserInfo] = useState(false);

  // Is user permission.
  const [isUserPermissionInfo, setIsUserPermissionInfo] = useState(false);

  // User info state.
  const [userInfoFields, setUserInfoFields] = useState(DEFAULT_FORM_FIELDS);

  const [permissionsFeilds, setPermissionFields] = useState([]);

  // State to track checked items.
  const [checkedItems, setCheckedItems] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // User permissions state.
  const [isPermissionTab, setIsPermissionTab] = useState(null);

  const [loadingSearch, setLoadingSearch] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // Mutate function for saving admin user.
  const { mutate, isPending: isAction } = useMutation("UserDetails");

  // Mutate function for saving permissions.
  const { mutate: savePermissions, isPending: isSavingPermissions } =
    useMutation("UserDetails");

  // Effect for userInfoFields.
  useEffect(() => {
    if (
      userInfoFields.username &&
      userInfoFields.first_name &&
      userInfoFields.last_name &&
      userInfoFields.email &&
      userInfoFields.password
    ) {
      setIsUserInfo(true);
    } else {
      setIsUserInfo(false);
    }
  }, [userInfoFields]);

  // Effect for checking errors.
  useEffect(() => {
    Object.entries(form.formState.errors).forEach(([, value]) => {
      if (value.message) {
        return toast({
          variant: "destructive",
          title: "Failed!!!",
          description: value.message,
        });
      } else return;
    });
  }, [form.formState.errors]);

  // Reset current tab on close.
  const onClose = () => {
    // Set current tab to user info.
    // setCurrentTab("user_permission");
    setIsUserPermissionInfo(true);
  };

  const onCreatedUser = () => {
    navigate("/settings/admins");
    // setIsPermissionTab(true);
    // setCurrentTab("user_permission");
  };

  // Form submission
  const onSubmit = async () => {
    if (!userInfoFields.username || !userInfoFields.password) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all fields",
      });
    }

    const formData = {
      username: userInfoFields?.username,
      first_name: userInfoFields?.first_name,
      last_name: userInfoFields?.last_name,
      email: userInfoFields?.email,
      password: userInfoFields?.password,
      is_staff: true,
      roles: selectedRoles?.map((role) => role.name) || [],
    };

    // Mutate function.
    mutate({
      url: ADMIN_USERS_URL,
      headers: {
        "Content-Type": "application/json",
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: error.response.data.message, // Display the error message from the server response
        });
      },
      onFinish: onCreatedUser,

      formData,
    });
  };

  // Form submission
  // const onSubmit = async () => {
  //   // Required fields check
  //   if (!userInfoFields.username || !userInfoFields.password) {
  //     return toast({
  //       variant: "destructive",
  //       title: "Failed!!!",
  //       description: "Please fill username and password",
  //     });
  //   }

  //   // Prepare form data: include optional fields only if filled
  //   const formData = {
  //     username: userInfoFields.username,
  //     password: userInfoFields.password,
  //     is_staff: true,
  //   };
  //   if (userInfoFields.first_name) formData.first_name = userInfoFields.first_name;
  //   if (userInfoFields.last_name) formData.last_name = userInfoFields.last_name;
  //   if (userInfoFields.email) formData.email = userInfoFields.email;

  //   mutate({
  //     url: ADMIN_USERS_URL,
  //     headers: { "Content-Type": "application/json" },
  //     formData,
  //     onError: (error) => {
  //       toast({
  //         variant: "destructive",
  //         title: "Failed!!!",
  //         description:
  //           error?.response?.data?.message || "Failed to create admin user",
  //       });
  //     },
  //     onSuccess: async (res) => {
  //       const newUser = res?.data;
  //       if (!newUser?.username) return;

  //       // Assign roles if selected
  //       if (selectedRoles.length > 0) {
  //         try {
  //           await axiosPrivate.post("/add_roles_to_user/", {
  //             username: newUser.username,
  //             roles: selectedRoles.map((r) => r.name),
  //           });
  //           toast({
  //             title: "Success",
  //             description: "Roles assigned successfully",
  //           });
  //         } catch (err) {
  //           toast({
  //             variant: "destructive",
  //             title: "Failed to assign roles",
  //             description:
  //               err?.response?.data?.message || "Error assigning roles",
  //           });
  //           return; // Stop navigation if roles fail
  //         }
  //       }

  //       toast({
  //         title: "Success",
  //         description: "Admin created successfully",
  //       });

  //       // Navigate after successful creation
  //       navigate("/settings/admins");
  //     },
  //   });
  // };

  // After close permissions.
  const onPermissionClose = () => {
    setPermissionFields([]);
    // setIsPermissionTab(false);
    setUserInfoFields(DEFAULT_FORM_FIELDS);
    // setCurrentTab("user_info");
    navigate("/settings/admins");
  };

  // Submit user permissions.
  const userPermissionSubmit = async () => {
    // Extract code names from state.
    // const codeNames = checkedItems.map((code) => code.modelCodename);

    // Check if it's empty.
    if (permissionsFeilds.length <= 0) return;

    const modifiedData = permissionsFeilds.map(
      ({ username, permission_codename }) => ({
        username,
        permission_codename,
      })
    );

    savePermissions({
      url: ADD_PERMISSIONS_TO_USER,
      headers: {
        "Content-Type": "application/json",
      },
      onFinish: onPermissionClose,
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: error.response.data.message, // Display the error message from the server response
        });
      },
      formData: modifiedData,
    });
  };

  // Get user permission models.
  const { data: models, isLoading } = useModels();

  // Extract all unique actions from the permissions data
  const allActions = useMemo(() => {
    return Array.from(
      new Set(models?.results?.map((p) => p.codename.split("_")[0])) || []
    );
  }, [models]);

  // Check if "view" action exists and make it the first column if it does
  const actions = useMemo(
    () =>
      allActions.includes("view")
        ? ["view", ...allActions.filter((action) => action !== "view")]
        : allActions,
    [models]
  );

  // Group permissions by model
  const groupedPermissions = useMemo(() => {
    return models?.results?.reduce((acc, permission) => {
      const { model, codename } = permission;
      const action = codename.split("_")[0];

      // Find or initialize the model entry in acc
      let modelEntry = acc.find((entry) => entry.model === model);
      if (!modelEntry) {
        modelEntry = { model };
        actions.forEach((action) => (modelEntry[action] = null)); // Initialize actions as null
        acc.push(modelEntry);
      }

      // Assign the permission object to the corresponding action
      modelEntry[action] = permission;

      return acc;
    }, []);
  }, [models, actions]);

  const filteredModels = useMemo(() => {
    if (!debouncedSearch) return groupedPermissions;
    return groupedPermissions?.filter((permission) => {
      const lowerCaseSearch = debouncedSearch.toLowerCase();
      const lowerCaseModelName = permission?.model?.toLowerCase();
      return lowerCaseModelName.includes(lowerCaseSearch);
    });
  }, [debouncedSearch, groupedPermissions]);

  // Handle checkbox change.
  const handleCheckboxChange = (model) => {
    setPermissionFields((prevItems) => {
      // Check if the modelId already exists in checkedItems
      const isModelChecked = prevItems.some(
        (item) => item.modelId === model.id
      );

      // If the modelId already exists, remove it from checkedItems
      if (isModelChecked) {
        return prevItems.filter((item) => item.modelId !== model.id);
      } else {
        // Otherwise, add it to checkedItems
        return [
          ...prevItems,
          {
            modelId: model.id,
            permission_codename: model.codename,
            username: userInfoFields?.username,
          },
        ];
      }
    });
  };

  useEffect(() => {
    setLoadingSearch(true);

    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setLoadingSearch(false);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  return (
    <CanSection permissions={["app_api.view_currencyexchange"]}>
      <Section className="space-y-6 h-fit items-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/">{t("Home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/settings/admins">{t("Admins List")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>{t("Add Admin")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="h-fit pr-4 w-full flex flex-col justify-start items-start pb-6">
          <CardHeader>
            <CardTitle>{t("Create Admin")}</CardTitle>
            <CardDescription>
              {t("Create Admin here, and click save when you are done.")}
            </CardDescription>
          </CardHeader>

          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            defaultValue="user_info"
            className="w-full h-full px-6"
          >
            <TabsList className="w-full">
              <TabsTrigger
                className="w-full"
                value="user_info"
                disabled={isPermissionTab}
              >
                {t("User Info")}
              </TabsTrigger>
            </TabsList>

            <Form {...form} className="h-fit w-full ">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 pt-4 flex flex-col justify-between h-fit items-center w-full "
              >
                <TabsContent value="user_info" className="w-full ">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem className="w-full px-1 pt-2">
                          <FormLabel>{t("First Name")}</FormLabel>

                          <FormControl>
                            <Input
                              type="text"
                              placeholder={t("Enter first name")}
                              value={userInfoFields.first_name}
                              onChange={(e) => {
                                field.onChange(e.target.value);

                                setUserInfoFields({
                                  ...userInfoFields,
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
                        <FormItem className="w-full px-1 pt-2">
                          <FormLabel>{t("Last Name")}</FormLabel>

                          <FormControl>
                            <Input
                              type="text"
                              placeholder={t("Enter last name")}
                              value={userInfoFields.last_name}
                              onChange={(e) => {
                                field.onChange(e.target.value);

                                setUserInfoFields({
                                  ...userInfoFields,
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
                  </div>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="w-full px-1 pt-2">
                        <FormLabel>
                          {" "}
                          <span className="text-red-500 text-xl">*</span>
                          {t("Username")}
                        </FormLabel>

                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t("Enter username")}
                            value={userInfoFields.username}
                            onChange={(e) => {
                              field.onChange(e.target.value);

                              setUserInfoFields({
                                ...userInfoFields,
                                username: e.target.value,
                              });
                            }}
                            autoComplete="username"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full px-1 pt-2">
                        <FormLabel>{t("Email")}</FormLabel>

                        <FormControl>
                          <Input
                            type="email"
                            placeholder={t("Enter email")}
                            value={userInfoFields.email}
                            onChange={(e) => {
                              field.onChange(e.target.value);

                              setUserInfoFields({
                                ...userInfoFields,
                                email: e.target.value,
                              });
                            }}
                            autoComplete="email"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="w-full px-1 pt-2">
                        <FormLabel>
                          <span className="text-red-500 text-xl">*</span>
                          {t("Password")}
                        </FormLabel>

                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={userInfoFields.password}
                              onChange={(e) => {
                                field.onChange(e.target.value);

                                setUserInfoFields({
                                  ...userInfoFields,
                                  password: e.target.value,
                                });
                              }}
                              autoComplete="current-password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent  hover:text-slate-900 text-slate-700 dark:text-slate-400 dark:hover:text-slate-100"
                              onClick={handleClickShowPassword}
                            >
                              {showPassword ? (
                                <EyeOff size="16" aria-hidden="true" />
                              ) : (
                                <Eye size="16" aria-hidden="true" />
                              )}
                              <span className="sr-only">
                                {showPassword
                                  ? "Hide password"
                                  : "Show password"}
                              </span>
                            </Button>
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={form.control}
                    name="roles"
                    render={() => (
                      <FormItem className="w-full px-1 pt-2">
                        <FormLabel>{t("Assign Roles")}</FormLabel>
                        <FormControl>
                          <div className="border rounded-md px-1 py-1">
                            {isLoadingRoles ? (
                              <div className="flex items-center gap-2 p-2">
                                <Loader2 className="animate-spin" />{" "}
                                {t("Loading roles...")}
                              </div>
                            ) : (
                              <CustomsMultiCombobox
                                endpoint={ROLES_URL}
                                itemKey="id"
                                setItems={setSelectedRoles}
                                items={selectedRoles}
                                itemTitle="name"
                                searchQueryKey="model"
                                sortBy="-date_added"
                                queryKey="name"
                                className="border-none"
                                placeholder={t("Select Roles")}
                              />
                            )}
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  /> */}

                  <div className="flex justify-end w-full mt-6">
                    <Button
                      type="submit"
                      disabled={
                        isAction ||
                        !userInfoFields.username ||
                        !userInfoFields.password
                      }
                      className="w-fit"
                    >
                      {isAction ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="animate-spin" />
                          <span>{t("Please wait")}</span>
                        </div>
                      ) : (
                        t("Save")
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </Card>
      </Section>
    </CanSection>
  );
};

export default AddPermission;
