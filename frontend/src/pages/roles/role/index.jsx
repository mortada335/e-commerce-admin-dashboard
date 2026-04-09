import Section from "@/components/layout/Section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ROLES_URL } from "@/utils/constants/urls";
import Can from "@/components/Can";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";
import AssignPermissionToRole from "../components/AssignPermissionToRole";
import { setIsAssignRoleDialogOpen, setSelectedRole } from "../store";
import { Button } from "@/components/ui/button";

const RoleDetails = () => {
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const { t } = useTranslation();

  const fetchRoleDetails = async (id) => {
    return axiosPrivate.get(`${ROLES_URL}/${id}/`);
  };

  const {
    data: roleData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["Roles", id],
    queryFn: () => fetchRoleDetails(id),
    enabled: !!id,
  });

  const role = roleData?.data;

  // Extract all unique actions from permissions
  const allActions = useMemo(() => {
    if (!role?.permissions) return [];
    return Array.from(new Set(role.permissions.map((p) => p.codename.split("_")[0]))) || [];
  }, [role?.permissions]);

  const actions = useMemo(() => 
    allActions.includes("view") ? ["view", ...allActions.filter((a) => a !== "view")] : allActions,
    [allActions]
  );

  const groupedPermissions = useMemo(() => {
    if (!role?.permissions) return [];
    return role.permissions.reduce((acc, permission) => {
      const { model, codename } = permission;
      const action = codename.split("_")[0];

      let modelEntry = acc.find((entry) => entry.model === model);
if (!modelEntry) {
  modelEntry = { 
    model, 
    display_name: permission.name || model 
  };
  actions.forEach((act) => (modelEntry[act] = null));
  acc.push(modelEntry);
}


      modelEntry[action] = permission;
      return acc;
    }, []);
  }, [role?.permissions, actions]);

  const tabs = [
    {
      title: t("Basic Information"),
      value: "basic_information",
      permissions: ["app_api.assign_ocorder"],
    },
    {
      title: t("Permissions"),
      value: "permissions",
      permissions: ["app_api.assign_ocorder"],
    },
  ];

  return (
    <Section className="space-y-8 h-fit items-start">
      <div className="flex justify-between items-center w-full">

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
              <Link to="/roles">{t("Roles")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("Role Details")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
        <div className="flex justify-end mt-2">
              <Button
                onClick={() => {
                  setSelectedRole(role);
                  setIsAssignRoleDialogOpen(true); 
                }}
              >
                {t("assign_permission")}
              </Button>
            </div>
      </div>

      <Tabs defaultValue="basic_information" className="w-full">
        <TabsList className="w-full h-fit flex rtl:flex-row-reverse gap-2">
          {tabs.map((tab) => (
            <Can key={tab.value} permissions={tab.permissions}>
              <TabsTrigger className="w-full" value={tab.value}>
                {tab.title}
              </TabsTrigger>
            </Can>
          ))}
        </TabsList>

        {/* Basic Info */}
        <TabsContent className="rtl:flex-row" value="basic_information">
          {isLoading && <p>{t("Loading role details...")}</p>}
          {isError && (
            <p className="text-red-500">
              {t("Failed to load role details.")} {error?.message}
            </p>
          )}
          {role && (
            <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
              <p dir="auto">
                <strong>{t("Role Name")}:</strong> {role.name}
              </p>
              <p dir="auto">
                <strong>{t("Total Permissions")}:</strong>{" "}
                {role.permissions?.length || 0}
              </p>
            </div>
          )}
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions">
          {isLoading && <p>{t("Loading permissions...")}</p>}
          {isError && (
            <p className="text-red-500">
              {t("Failed to load permissions.")} {error?.message}
            </p>
          )}
          {role?.permissions?.length > 0 ? (
            <ScrollArea className="h-[500px] border rounded-lg bg-muted/30">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px] font-semibold">{t("display_name")}</TableHead>
                    {actions.map((action) => (
                      <TableHead key={action} className="font-semibold text-center">
                        {t(action)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedPermissions.map((group) => (
                    <TableRow key={group.display_name}>
                      <TableCell className="font-medium">{group.display_name}</TableCell>
                      {actions.map((action) => (
                        <TableCell key={action} className="text-center">
                          {group[action] ? (
                            <div className="flex justify-center">
                              <Check className="h-5 w-5 text-green-600" />
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ) : (
            !isLoading && (
              <p className="italic text-gray-500">
                {t("No permissions assigned to this role.")}
              </p>
            )
          )}
        </TabsContent>
      </Tabs>
      <AssignPermissionToRole/>
    </Section>
  );
};

export default RoleDetails;