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
import { useTranslation } from "react-i18next"
const Category = () => {
  const { id } = useParams()
  const {t} = useTranslation()

  return (
    <CanSection permissions={[ "app_api.view_occategory"]}>

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
                <Link to="/catalog/categories">{t("Categories")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("Category")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      <Tabs defaultValue="basic_information" className="w-full">
        <TabsList className="w-full rtl:flex-row-reverse">
          <TabsTrigger className="w-full" value="basic_information">
            {t("Basic Information")}
          </TabsTrigger>
          <TabsTrigger className="w-full" value="products">
            {t("Products")}
          </TabsTrigger>
        </TabsList>
        <TabsContent
          className="flex justify-start items-center w-full h-fit"
          value="basic_information"
        >
          <BasicInfoTab />
        </TabsContent>
        <TabsContent value="products">
          <Products categoryId={id} />
        </TabsContent>
      </Tabs>
    </Section>
    </CanSection>
  )
}

export default Category
