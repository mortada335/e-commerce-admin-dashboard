import Section from "@/components/layout/Section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";

import Orders from "@/pages/orders";
import { USERS_URL } from "@/utils/constants/urls";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import InfluencerInfo from "./components/InfluencerInfo";
import LoginDetails from "./components/LoginDetails";
import UserCoupons from "./components/UserCoupons";
import RewardPoints from "./components/RewardPoints";
import UserInfo from "./components/UserInfo";
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
import UserSearchHistory from "@/pages/user-search-history";
import UserRecentProducts from "@/pages/user-recent-products";
import UsersCart from "@/pages/users-cart";
import UserAddresses from "./components/UserAddresses";
import Can from "@/components/Can";
import WalletTransactionData from "@/pages/wallet-transactions/components/WalletTransactionData";
import { useTranslation } from "react-i18next";

const User = () => {
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const {t} = useTranslation()

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

  const tabs = [
    {
      title: t("Basic Information"),
      value: "basic_information",
      permissions: ["app_api.view_currencyexchange"]

    },
    {
      title: t("Orders"),
      value: "orders",
      permissions: ["app_api.view_currencyexchange"]
    },
    {
      title: t("Influencer Information"),
      value: "influencer_info",
      permissions: ["app_api.view_currencyexchange"]
    },
    {
      title: t("Reward Points"),
      value: "reward_points",
      permissions: ["app_api.view_currencyexchange"]
    },
    {
      title: t("Promo Codes"),
      value: "coupons",
      permissions: ["app_api.view_currencyexchange"]
    },
    {
      title: t("Modification"),
      value: "modification",
      permissions: ["app_api.view_currencyexchange"]
    },
    {
      title: t("Recent Products"),
      value: "user_recent_products",
      permissions: ["app_api.view_currencyexchange"]
    },
    {
      title: t("User Addresses"),
      value: "user_addresses",
      permissions: ["app_api.view_currencyexchange"]
    },
    // {
    //   title: t("Wallet Transaction"),
    //   value: "wallet_transaction",
    //   permissions: ["app_api.view_currencyexchange"]
    // },
    {
      title: t("User Carts"),
      value: "user_carts",
      permissions: ["app_api.view_currencyexchange"]
    },
    {
      title: t("Search History"),
      value: "user_search_history",
      permissions: ["app_api.view_currencyexchange"]
    },
    {
      title: t("Login Details"),
      value: "login_details",
      permissions: ["app_api.view_currencyexchange"]
    },
  ];

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
            <Can permissions={[ "app_api.view_currencyexchange"]}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/users">{t("Users")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            </Can>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{ user ? (user?.data?.first_name + " " + user?.data?.last_name) : t("User")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Tabs defaultValue="basic_information" className="w-full">
          <TabsList className="w-full h-fit grid-cols-1 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-2 ">
            {tabs.map((tab) => (

                  <Can key={tab.value} permissions={tab.permissions}>
                  <TabsTrigger  className="w-full" value={tab.value}>
                {tab.title}
              </TabsTrigger>
                  </Can>
                  
               
            ))}
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
          <TabsContent value="orders">
            <Orders customer_id={id} isUserPage={true} />
          </TabsContent>

          </Can>
          <TabsContent value="influencer_info">
            <InfluencerInfo
              referralCode={user?.data?.referral_code}
              refferalsMade={user?.data?.refferals_made}
              refferalsReceived={user?.data?.refferals_received}
            />
          </TabsContent>
          <TabsContent value="reward_points">
            <RewardPoints
              id={id}
              userPoints={user?.data?.user_points}
              userRank={user?.data?.user_rank}
            />
          </TabsContent>
          <TabsContent value="coupons">
            <UserCoupons coupons={user?.data?.coupons || []} />
          </TabsContent>
          <Can permissions={[ "app_api.view_currencyexchange"]}>
          <TabsContent value="modification">
            <ModificationTab userData={user?.data} />
          </TabsContent>

          </Can>

          <TabsContent value="user_addresses">
                   {/* USER ADDRESSES SECTION */}
        <UserAddresses id={id} />
          </TabsContent>
          <TabsContent value="user_carts">
            <UsersCart userId={id} />
          </TabsContent>
                    {/* <Can permissions={[ "app_api.view_giftwallettransaction"]}>

          <TabsContent value="wallet_transaction">
            <WalletTransactionData userId={id} />
          </TabsContent>
                    </Can> */}
          <TabsContent value="user_recent_products">
            <UserRecentProducts userId={id} />
          </TabsContent>
          <TabsContent value="user_search_history">
            <UserSearchHistory userId={id} />
          </TabsContent>
          <TabsContent value="login_details">
            <LoginDetails userLoginDetails={user?.data?.user_login_details} />
          </TabsContent>
        </Tabs>
      </Section>
    </CanSection>
  );
};

export default User;
