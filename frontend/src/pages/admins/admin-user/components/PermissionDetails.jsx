import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import useMutation from "@/hooks/useMutation";
import { ADD_PERMISSIONS_TO_USER } from "@/utils/constants/urls";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useModels } from "../hooks/usePermissionModels";

import { memo } from "react";

import Can from "@/components/Can";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import Pagination from "@/components/layout/Pagination";

const AddPermission = ({ initUserData }) => {
  const navigate = useNavigate();

  const permissionsFormData = useForm();
  const { id } = useParams();
  const {t} = useTranslation()
  const [userData, setUserData] = useState({ username: "", permissions: [] });
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const { mutate: savePermissions, isPending: isSavingPermissions } =
    useMutation("UserDetails");

  useEffect(() => {
    if (initUserData) {
      const formattedPermissions = initUserData.permissions?.map((item) =>
        item.replace(/^[^.]+\./, "")
      );

      setUserData({
        username: initUserData.username,
        permissions: formattedPermissions || [],
      });
    }
  }, [initUserData, id]);

  useEffect(() => {
    Object.entries(permissionsFormData.formState.errors).forEach(
      ([, value]) => {
        if (value.message) {
          toast({
            variant: "destructive",
            title: "Failed!!!",
            description: value.message,
          });
        }
      }
    );
  }, [permissionsFormData.formState.errors]);

  const onPermissionClose = () => {
    // setUserData({ username: "", permissions: [] });
    // navigate("/settings/admins");
  };

  const userPermissionSubmit = async () => {
    const modifiedData = userData.permissions.map((permission_codename) => ({
      username: userData.username,
      permission_codename,
    }));
    const formdata = {
      username: userData.username,
      permission_codename: userData.permissions.map((permission_codename) => ({
        permission_codename,
      })),
    };
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
          description: error.response.data.message,
        });
      },
      formData: formdata,
    });
  };

  // const { data: models, isLoading } = useModels();
  const [page,setPage] = useState(1)
  const [itemPerPage, setItemPerPage] = useState("20")
const { data: models, isLoading } = useModels(page, itemPerPage, debouncedSearch);
const totalPages = Math.ceil(models?.count / itemPerPage);

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
      // let modelEntry = acc.find((entry) => entry.model === model);
      // if (!modelEntry) {
      //   modelEntry = { model };
      //   actions.forEach((action) => (modelEntry[action] = null)); // Initialize actions as null
      //   acc.push(modelEntry);
      // }
let modelEntry = acc.find((entry) => entry.model === model);
if (!modelEntry) {
  modelEntry = { model, display_name: permission.name || model }; // Use name as display_name
  actions.forEach((action) => (modelEntry[action] = null));
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

  const handleCheckboxChange = useCallback((model) => {
    setUserData((prevUserData) => {
      const updatedPermissions = prevUserData.permissions.includes(
        model.codename
      )
        ? prevUserData.permissions.filter((perm) => perm !== model.codename)
        : [...prevUserData.permissions, model.codename];

      return {
        ...prevUserData,
        permissions: updatedPermissions,
      };
    });
  }, []);

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
    <Section className="space-y-6 h-fit items-start">
      <Form {...permissionsFormData} className="h-fit w-full">
        <form
          onSubmit={permissionsFormData.handleSubmit(userPermissionSubmit)}
          className="space-y-2 flex flex-col justify-between h-fit items-center w-full px-1"
        >
          <FormField
            control={permissionsFormData.control}
            className="w-full"
            name="permissions"
            render={() => (
              <div className="space-y-2 relative w-full">
                <div className="flex items-center justify-between w-full gap-24 pb-2">
                  <div className="w-3/4 relative">
                    <Input
                      type="text"
                      placeholder={t("Search...")}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="w-full"
                    />
                    {loadingSearch && (
                      <Loader2 className="animate-spin absolute top-2 right-2 text-blue-500 " />
                    )}
                  </div>
                  <Can permissions={["app_api.view_currencyexchange"]}>
                    <Button
                      type="submit"
                      disabled={
                        isSavingPermissions ||
                        !userData.permissions.length ||
                        userData.permissions.some((item) => item === "")
                      }
                      className="w-fit"
                    >
                      {isSavingPermissions ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="animate-spin" />
                          <span>{t("Please wait...")}</span>
                        </div>
                      ) : (
                        t("Save Changes")
                      )}
                    </Button>
                  </Can>
                </div>

                {isLoading ? (
                  <div className="h-[350px] grid place-items-center">
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin mx-auto" />
                      <span>{t("Please wait")}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <ScrollArea className="h-full pb-4 min-w-[250px] w-full ">
                      <Table className="w-full">
                        <TableHeader className=" w-full">
                          <TableRow className="divide-x-2 w-full">
                            <TableHead className="w-[100px] !font-semibold">
                              {t("display_name")}
                            </TableHead>
                            {actions.map((action) => (
                              <TableHead
                                className="!font-semibold"
                                key={action}
                              >
                                {action.charAt(0).toUpperCase() +
                                  action.slice(1)}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredModels?.map((perm, index) => (
                            <TableRow key={index}>
                              <TableCell>{perm.display_name}</TableCell>

                              {actions?.map((action) => (
                                <TableCell className="!pr-4" key={action}>
                                  {perm[action] ? (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div className="w-full">
                                            <PermissionCheckbox
                                              className="w-fit bg-inherit dark:bg-inherit p-2"
                                              showLabel={true}
                                              model={perm[action]}
                                              isChecked={userData.permissions.includes(
                                                perm[action]?.codename
                                              )}
                                              onCheckboxChange={
                                                handleCheckboxChange
                                              }
                                            />
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{(perm[action]?.name)}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  ) : (
                                    "-"
                                  )}
                                </TableCell>
                              ))}
                              {/* <TableCell><PermissionCheckbox
                              model={model}
                              isChecked={userData.permissions.includes(
                                model.codename
                              )}
                              onCheckboxChange={handleCheckboxChange}
                            /> {perm.view || '-'}</TableCell>
            <TableCell>{perm.add || '-'}</TableCell>
            <TableCell>{perm.change || '-'}</TableCell>
            <TableCell>{perm.delete || '-'}</TableCell> */}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                        <div className="flex items-center justify-between py-2 px-4 w-full">
                          <Pagination
                            itemPerPage={itemPerPage}
                            next={models?.next}
                            previous={models?.previous}
                            totalPages={totalPages}
                            totalCount={models?.count}
                            page={page}
                            setPage={setPage}
                          />
                        </div>

                      {!filteredModels ||
                        (filteredModels?.length <= 0 && (
                          <p className="col-span-4 text-sm text-center mx-auto w-full">
                            {t("No user permissions.")}
                          </p>
                        ))}
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>

                    {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md gap-4 w-full">
                  {filteredModels?.map((model) => (
                    <TooltipProvider key={model.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-full">
                            <PermissionCheckbox
                              model={model}
                              isChecked={userData.permissions.includes(
                                model.codename
                              )}
                              onCheckboxChange={handleCheckboxChange}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{model.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  
                </div> */}
                  </>
                )}
              </div>
            )}
          />
        </form>
      </Form>
    </Section>
  );
};

export const PermissionCheckbox = memo(
  ({ model, isChecked, onCheckboxChange, showLabel = true, className }) => {
    return (
      <label
        key={model.id}
        className={cn(
          "flex items-center gap-2 w-full bg-slate-100 p-3 rounded-md text-sm dark:bg-slate-800",
          className
        )}
        htmlFor={model.id}
      >
        <Checkbox
          id={model.id}
          checked={isChecked}
          onCheckedChange={() => onCheckboxChange(model)}
        />
        {showLabel && <div className="truncate">{model.name}</div>}
      </label>
    );
  }
);

PermissionCheckbox.displayName = "PermissionCheckbox";

export default AddPermission;
