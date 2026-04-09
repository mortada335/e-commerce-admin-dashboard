import Section from "@/components/layout/Section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";

import Orders from "@/pages/orders";
import { DELETED_USERS_URL } from "@/utils/constants/urls";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import RewardPoints from "./components/RewardPoints";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import CanSection from "@/components/CanSection";
import ModificationTab from "./components/ModificationTab";
import UserCoupons from "./components/UserCoupons";
import { useTranslation } from "react-i18next";
const DeletedUserDetails = () => {
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const {t} = useTranslation()

  const fetchAdminUsersDetails = async (id) => {
    return axiosPrivate.get(`${DELETED_USERS_URL}${id}/`);
  };
  const { data: deletedUser } = useQuery({
    queryKey: ["DeletedUserDetails", id],
    queryFn: () => fetchAdminUsersDetails(id),
    enabled: !!id,
  });

  const tabs = [
    {
      title: t("Orders"),
      value: "orders",
    },

    {
      title: t("Reward Points"),
      value: "reward_points",
    },
    {
      title: t("Promo Codes"),
      value: "promo_codes",
    },
    {
      title: t("Modification"),
      value: "modification",
    },
  ];

  return (
    <CanSection permissions={["app_api.view_deleteduser"]}>
      <Section className="space-y-8 h-fit items-start">
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
                <Link to="/deleted-users">{t("Deleted Users")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("Deleted User")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="w-full h-fit">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} className="w-full" value={tab.value}>
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="orders">
            <Orders
              customer_id={deletedUser?.data?.original_user_id}
              isUserPage={true}
            />
          </TabsContent>

          <TabsContent value="reward_points">
            <RewardPoints
              id={deletedUser?.data?.original_user_id}
              userPoints={deletedUser?.data?.user_points}
              userRank={deletedUser?.data?.user_rank}
            />
          </TabsContent>
          <TabsContent value="promo_codes">
            <UserCoupons originalUserId={deletedUser?.data?.original_user_id} />
          </TabsContent>

          <TabsContent value="modification">
            <ModificationTab userData={deletedUser?.data} />
          </TabsContent>
        </Tabs>
      </Section>
    </CanSection>
  );
};

export default DeletedUserDetails;
