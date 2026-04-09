
import DataTable from "@/components/ui/DataTable";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";

import deliveryDataColumns from "./deliveryDataColumns";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { FCM_DELIVERY_DATA_URL } from "@/utils/constants/urls";
import WrapperComponent from "@/components/layout/WrapperComponent";

import {  formatStringToDate, formatText } from "@/utils/methods";

import CanSection from "@/components/CanSection";
import HeaderText from "@/components/layout/header-text";
import { useTranslation } from "react-i18next";

const NotificationDeliveryDataTab = ({currentTab}) => {
  const axiosPrivate = useAxiosPrivate();
  const { t } = useTranslation()

  const fetchNotifications = async () => {

    return axiosPrivate.get(
      `${FCM_DELIVERY_DATA_URL}`
    );
  };
  const {
    data: notifications,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["NotificationDeliveryData",currentTab,],
    queryFn: () => fetchNotifications(),
  });


  const deliveryData = Object.entries(notifications?.data||{}).map(([key, data]) => ({
  title: key,
  data,
}))|| []
 

  return (
    <CanSection permissions={["app_api.view_firebasenotification"]}>

        <WrapperComponent
          isEmpty={!deliveryData?.length}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={
           <div  className="flex flex-col justify-start items-start gap-8 mb-4">

          <DataTableSkeleton columnCount={5} />
          <DataTableSkeleton columnCount={5} />
           </div>
          }
          emptyStateMessage={
           t("You don't have any notifications delivery data get started by sending a new one.")
          }
        >
        {
          deliveryData?.map((section)=>(
            <div key={section.title} className="flex flex-col justify-start items-start gap-2 mb-4">

        <Card  className="flex justify-between items-center w-full px-4  py-2 flex-wrap gap-4">

                      <HeaderText className={"w-fit text-start text-base md:text-lg lg:text-xl "} text={formatText(section.title || '')} />


        </Card>
          <DataTable
            columns={deliveryDataColumns}
            data={section?.data?.map((notification,index) => ({
              id:index,
              event: notification.event,
              event_count: notification.event_count,
              date: notification.date
                ? formatStringToDate(notification.date)
                : "/",
            }))||[]}
            defaultPagination={true}
          />
            </div>

          ))
        }
       

         
        </WrapperComponent>
  
    </CanSection>
  );
};

export default NotificationDeliveryDataTab;
