// Layout and Permission Components

import CanSection from "@/components/CanSection";
import Section from "@/components/layout/Section";

import { Card } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {

    Building2,
  Download,
  Files,
  Layers,

} from "lucide-react";

// React Imports
import { useState,  } from "react";
import { Link } from "react-router-dom";



import { Button } from "@/components/ui/button";
import CustomRangeDatePicker from "@/components/ui/custom-range-date-picker";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import OrdersByCityReports from "./tabs/OrdersByCity";
import { useTranslation } from "react-i18next";
import i18n from "@/locales/i18n";


function Reports() {

  const [tab, setTab] = useState("orders_by_city");

  const {t} = useTranslation()

  const tabs = [
    {
      value: "orders_by_city",
      title: t("Orders By City"),
      icon: <Building2 size={16} />,
    },
   
  ];



  return (
    <CanSection permissions={["app_api.view_ocorder"]}>
      <Section className="gap-4 h-fit max-h-fit items-start py-0">

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsContent value="orders_by_city" className="py-0 flex flex-col justify-start items-start gap-4">
         <OrdersByCityReports>
                      <div className="flex flex-col md:flex-row justify-start rtl:flex-row-reverse items-center w-full md:w-fit h-fit gap-4 flex-wrap">
            <Breadcrumb dir={i18n.dir()}>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink>
                    <Link to="/">{t("home")}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink>
                    <BreadcrumbPage>{t("Reports")}</BreadcrumbPage>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Separator
              orientation={"vertical"}
              className="h-[30px] hidden md:block"
            />
            <Tabs value={tab} onValueChange={setTab} className="w-fit h-fit">
              <TabsList className="w-fit h-fit bg-inherit p-0 flex flex-col md:flex-row  gap-2 md:gap-0">
                {tabs.map((tabItem) => (
                  <TabsTrigger
                    key={tabItem.value}
                    className="w-fit flex justify-center capitalize items-center gap-2 data-[state=active]:border-b-2 rounded-none border-blue-500 data-[state=active]:bg-inherit data-[state=active]:shadow-none"
                    value={tabItem.value}
                  >
                    {tabItem.icon}
                    <span>{tabItem.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
         </OrdersByCityReports>
          </TabsContent>
        
        </Tabs>
      </Section>
    </CanSection>
  );
}

export default Reports;
