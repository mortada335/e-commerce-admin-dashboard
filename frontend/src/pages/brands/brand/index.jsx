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
const Brand = () => {
  const { id } = useParams()

  return (
    <CanSection permissions={[ "app_api.view_ocmanufacturer"]}>

    <Section className="space-y-8 h-fit items-start">
       <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/catalog/brands">Brands</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
         
          <BreadcrumbItem>
            <BreadcrumbPage>Brand</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Tabs defaultValue="basic_information" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger className="w-full" value="basic_information">
            Basic Information
          </TabsTrigger>
          <TabsTrigger className="w-full" value="products">
            Products
          </TabsTrigger>
        </TabsList>
        <TabsContent
          className="flex justify-start items-center w-full h-fit"
          value="basic_information"
        >
          <BasicInfoTab />
        </TabsContent>
        <TabsContent value="products">
          <Products manufacturerId={id} />
        </TabsContent>
      </Tabs>
    </Section>
    </CanSection>
  )
}

export default Brand
