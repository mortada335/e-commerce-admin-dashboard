import Section from "@/components/layout/Section";

import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";

import SendNotificationDialog from "./components/SendNotificationDialog";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

import CanSection from "@/components/CanSection";
import Can from "@/components/Can";
import { BellPlus, List, MailCheckIcon, SendHorizontal } from "lucide-react";
import CustomsItemsPerPage from "@/components/ui/customs-items-per-page";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SentNotificationTab from "./components/SentNotificationTab";
import ScheduledNotificationTab from "./components/ScheduledNotificationTab";
import ScheduledNotificationDialog from "./components/ScheduledNotificationDialog";
import NotificationDeliveryDataTab from "./components/NotificationDeliveryDataTab";
import { useTranslation } from "react-i18next";
import i18n from "@/locales/i18n";

const Notifications = () => {
  const [isSendNotificationDialogOpen, setIsSendNotificationDialogOpen] =
    useState(false);

    const { t } = useTranslation()
    const [page, setPage] = useState(1);
    const [itemPerPage, setItemPerPage] = useState("25");
    const [selectedTopic, setSelectedTopic] = useState("taawin_admin");
  const tabs = [
    {
      title: t("Sent Notifications"),
      value: "sent_notifications",
      permissions: ["app_api.view_firebasenotification"],
      icon: <List size={16} />,
    },
    {
      title: t("Scheduled Notifications"),
      value: "scheduled_notifications",
      permissions: ["app_api.view_schedulednotifications"],
      icon: <SendHorizontal size={16} />,
    },
    {
      title: t("Notifications Delivery Data"),
      value: "notifications_delivery_data",
      permissions: ["app_api.view_firebasenotification"],
      icon: <MailCheckIcon size={16} />,
    },
  ];

  return (
    <CanSection
      permissions={[
        "app_api.view_firebasenotification",
        "app_api.view_schedulednotifications",
      ]}
    >
      <Section className="space-y-4 h-fit items-start py-0">
        <Tabs
          defaultValue="sent_notifications"
          className="flex flex-col justify-start items-start gap-2  w-full h-fit max-h-fit pb-5"
        >
          <Card className="flex justify-between items-center rtl:flex-row-reverse w-full px-4  py-2 flex-wrap gap-4">
            <div className="flex justify-start rtl:flex-row-reverse items-center w-fit gap-2">
              <Breadcrumb dir={i18n.dir()}>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink>
                      <Link to="/">{t("Home")}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{t("Notifications")}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <Separator orientation={"vertical"} className="h-[30px]" />
              <TabsList className="w-fit rtl:flex-row-reverse bg-inherit p-0">
                {tabs.map((tab) => (
                  <Can key={tab.value} permissions={tab.permissions}>
                    <TabsTrigger
                      className="w-full flex justify-center capitalize  items-center gap-2 data-[state=active]:border-b-2 rounded-none border-blue-500 data-[state=active]:bg-inherit data-[state=active]:shadow-none"
                      value={tab.value}
                    >
                      {tab.icon}
                      <span className="">{tab.title}</span>
                    </TabsTrigger>
                  </Can>
                ))}
              </TabsList>
            </div>

          <div className="flex justify-start rtl:flex-row-reverse items-center w-fit gap-2">
          <Can permissions={["app_api.add_firebasenotification"]}>
            <Button
              onClick={() => setIsSendNotificationDialogOpen(true)}
              className="flex items-center gap-1"
            >
              {/* Medium screen and above. */}
              <span className="hidden md:block">
                <BellPlus size={18} />
              </span>
              {/* Small screen. */}
              <span className="md:hidden">
                <BellPlus size={14} />
              </span>
              {t("Send Notification")}
            </Button>
          </Can>
          {/* <Select onValueChange={(val)=>{
            setSelectedTopic(val)
            setPage(1)
            }} defaultValue={selectedTopic}>
              <SelectTrigger className="w-fit">
                <SelectValue placeholder={t("Select Topic")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("Topics")}</SelectLabel>
                  <SelectItem value="taawin_admin">{t("Sent Notifications")}</SelectItem>
                  <SelectItem value="admin_topic">{t("New Order Notifications")}</SelectItem>
                  <SelectItem value="token_based">{t("Changes Notifications")}</SelectItem>
                
                </SelectGroup>
              </SelectContent>
            </Select> */}
            <CustomsItemsPerPage setItemPerPage={setItemPerPage} itemPerPage={itemPerPage}/>
          </div>
        </Card>
        <Can permissions={["app_api.view_firebasenotification"]}>
        <TabsContent  className="w-full h-full max-h-fit" value="sent_notifications">
            <SentNotificationTab page={page} setPage={setPage} itemPerPage={itemPerPage} selectedTopic={selectedTopic}/>
        </TabsContent>

        </Can>
        <Can permissions={["app_api.view_schedulednotifications"]}>
        <TabsContent  className="w-full h-full max-h-fit" value="scheduled_notifications">
            <ScheduledNotificationTab page={page} setPage={setPage} itemPerPage={itemPerPage} selectedTopic={selectedTopic}/>
        </TabsContent>

        </Can>
        <Can permissions={["app_api.view_firebasenotification"]}>

        <TabsContent  className="w-full h-full max-h-fit" value="notifications_delivery_data">
            <NotificationDeliveryDataTab />
        </TabsContent>
        </Can>

        </Tabs>
        <Can permissions={["app_api.add_firebasenotification"]}>
          <SendNotificationDialog
            isDialogOpen={isSendNotificationDialogOpen}
            setIsDialogOpen={setIsSendNotificationDialogOpen}
          />
        </Can>
        <Can permissions={["app_api.add_schedulednotifications"]}>
          <ScheduledNotificationDialog />
        </Can>
      </Section>
    </CanSection>
  );
};

export default Notifications;
