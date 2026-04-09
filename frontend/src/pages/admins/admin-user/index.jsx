import Section from "@/components/layout/Section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";

import { USERS_URL } from "@/utils/constants/urls";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import LoginDetails from "./components/LoginDetails";
import UserInfo from "./components/UserInfo";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import PermissionDetails from "./components/PermissionDetails";
import { useEffect } from "react";
import { setSelectedUser } from "./store";

import CanSection from "@/components/CanSection";
import Can from "@/components/Can";
import { useTranslation } from "react-i18next";
const User = () => {
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const { t } = useTranslation();

  const fetchAdminUsersDetails = async (id) => {
    return axiosPrivate.get(`${USERS_URL}${id}/`);
  };
  const {
    data: user,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["UserDetails", id],
    queryFn: () => fetchAdminUsersDetails(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (!user || user === undefined || user === null) return;
    setSelectedUser(user.data);
  }, [user]);

  return (
    <CanSection permissions={["app_api.view_currencyexchange"]}>
      <Section className="space-y-8 h-fit items-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/">{t("Home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <Can permissions={["app_api.view_currencyexchange"]}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <Link to="/settings/admins">{t("Admins List")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Can>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("Admin Details")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Tabs defaultValue="basic_information" className="w-full">
          <TabsList className="w-full h-fit flex justify-between">
            <TabsTrigger value="basic_information" className="w-full">
              {t("Basic Information")}
            </TabsTrigger>
            {/* <Can permissions={["app_api.view_currencyexchange"]}>

          <TabsTrigger value="permissions_details" className="w-full">
            {t("Permissions Details")}
          </TabsTrigger>
          </Can> */}
            <TabsTrigger value="login_details" className="w-full">
              {t("Login Details")}
            </TabsTrigger>
          </TabsList>
          <TabsContent
            className="flex justify-start items-center w-full h-fit"
            value="basic_information"
          >
            <UserInfo
              id={id}
              userData={user?.data}
              isUserDataLoading={isLoading}
              isError={isError}
              error={error}
            />
          </TabsContent>

          <Can permissions={["app_api.view_currencyexchange"]}>
            <TabsContent value="permissions_details">
              <PermissionDetails initUserData={user?.data} />
            </TabsContent>
          </Can>

          <TabsContent value="login_details">
            <LoginDetails userLoginDetails={user?.data?.user_login_details} />
          </TabsContent>
        </Tabs>
      </Section>
    </CanSection>
  );
};

export default User;
