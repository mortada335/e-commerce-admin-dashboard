import Section from "@/components/layout/Section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicInfoTab from "./components/BasicInfoTab";
import ModificationTab from "./components/ModificationTab";
import Orders from "@/pages/orders";
import { Link, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProductOrders from "./components/orders-tab";
import CanSection from "@/components/CanSection";
import Can from "@/components/Can";
import OptionsTab from "./components/option-tab";
import OldModificationTab from "./components/old-modification-tab";
import { useTranslation } from "react-i18next";
import WarehouseTab from "./components/warehouse-tab";

const Product = () => {
  const { id } = useParams();
  const {t} =useTranslation()
  return (
    <CanSection permissions={[ "app_api.view_ocproduct"]}>

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
              <Link to="/catalog/products">{t("Products")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("Product")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Tabs defaultValue="basic_information" className="w-full">
        <TabsList className="w-full h-fit grid-cols-1 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          <TabsTrigger className="w-full" value="basic_information">
            {t("Basic Information")}
          </TabsTrigger>
          <Can permissions={[ "app_api.view_orderproduct"]}>

          <TabsTrigger className="w-full" value="orders">
            {t("Orders")}
          </TabsTrigger>
          </Can>
          <Can permissions={[ "app_api.view_ocoptionvalue"]}>

          <TabsTrigger className="w-full" value="options">
            {t("Options")}
          </TabsTrigger>
          </Can>
          <Can permissions={[ "app_api.change_ocproduct"]}>
          <TabsTrigger className="w-full" value="modification">
            {t("Modifications")}
          </TabsTrigger>

          </Can>
        </TabsList>
        <TabsContent
          className="flex justify-start items-center w-full h-fit"
          value="basic_information"
        >
          <BasicInfoTab />
        </TabsContent>

          <Can permissions={["app_api.view_orderproduct"]}>
            <TabsContent value="orders">
              <ProductOrders byProduct={id} />
            </TabsContent>
          </Can>
          <Can permissions={["app_api.view_ocoptionvalue"]}>
            <TabsContent value="options">
              <OptionsTab productId={id} />
            </TabsContent>
          </Can>
          <Can permissions={["app_api.change_ocproduct"]}>
            <TabsContent value="modification">
              <ModificationTab />
            </TabsContent>
            <TabsContent value="warehouses">
              <WarehouseTab productId={id} />
            </TabsContent>
          </Can>
        </Tabs>
      </Section>
    </CanSection>
  );
};

export default Product;
