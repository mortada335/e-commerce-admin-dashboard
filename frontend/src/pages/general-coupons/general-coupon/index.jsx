import Section from "@/components/layout/Section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ModificationTab from "./components/ModificationTab";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CanSection from "@/components/CanSection";
import History from "./components/History";
import Can from "@/components/Can";
import { useTranslation } from "react-i18next";


const Coupon = () => {
const {t} = useTranslation()

  return (
    <CanSection permissions={["app_api.view_occouponhistory"]}>
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
                <Link to="/ecommerce/promo-codes">{t("Promo Codes")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("Promo Code")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="history">
              {t("History")}
            </TabsTrigger>
            <Can permissions={["app_api.view_occouponhistory"]}>

            <TabsTrigger className="w-full" value="modification">
              {t("Modification")}
            </TabsTrigger>
            </Can>
          </TabsList>
          <TabsContent value="history" className="mt-6">
            <History />
          </TabsContent>
          <Can permissions={["app_api.view_occouponhistory"]}>
          <TabsContent
            className="flex justify-start items-center w-full h-fit"
            value="modification"
          >
            <ModificationTab />
          </TabsContent>

          </Can>
        </Tabs>
      </Section>
    </CanSection>
  );
};

export default Coupon;
