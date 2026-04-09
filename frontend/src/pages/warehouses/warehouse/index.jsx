import Section from "@/components/layout/Section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Link, useParams } from "react-router-dom"

import Products from "@/pages/products"
import BasicInfoTab from "./components/BasicInfoTab"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import CanSection from "@/components/CanSection"
import { Card } from "@/components/ui/card"
import { useTranslation } from "react-i18next"
import ZonesTab from "./components/ZonesTab"
const Warehouse = () => {
  const { id } = useParams()
  const {t} = useTranslation()

  return (
    <CanSection permissions={[ "app_api.view_ocwarehouse"]}>
    <Section className="space-y-4 h-fit items-start">

       <Card className=" flex flex-col md:flex-row   flex-wrap justify-between  items-center w-full h-fit px-4 py-3 md:py-2 gap-4 ">
            <div className="flex justify-start items-center w-fit gap-4">

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
                <Link to="/catalog/warehouses">{t("Warehouses")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("warehouse")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
            </div>
            </Card>
      <Tabs defaultValue="basic_information" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger className="w-full" value="basic_information">
            {t("Basic Information")}
          </TabsTrigger>
          <TabsTrigger className="w-full" value="zones">
            {t("zones")}
          </TabsTrigger>
        </TabsList>
        <TabsContent
          className="flex justify-start items-center w-full h-fit"
          value="basic_information"
        >
          <BasicInfoTab />
        </TabsContent>
        <TabsContent
        className="flex justify-start items-center w-full h-fit"
        value="zones">
          <ZonesTab warehouseId={id} />
          {/* <Products warehouseId={id} /> */}
        </TabsContent>
      </Tabs>
    </Section>
    </CanSection>
  )
}

export default Warehouse
