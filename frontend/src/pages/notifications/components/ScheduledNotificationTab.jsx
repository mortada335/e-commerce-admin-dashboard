
import DataTable from "@/components/ui/DataTable";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";

import scheduledColumns from "./scheduledColumns";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import {  SCHEDULED_NOTIFICATION_URL } from "@/utils/constants/urls";
import WrapperComponent from "@/components/layout/WrapperComponent";

import { formatFullDate } from "@/utils/methods";

import Pagination from "@/components/layout/Pagination";
import CanSection from "@/components/CanSection";
import OnDeleteDialog from "@/components/Dialogs/OnDelete";
import { setIsChangeStatusDialogOpen, setIsDeleteNotificationDialogOpen, useNotificationStore } from "../store";
import OnChangeStatus from "@/components/Dialogs/OnChangeStatus";
import { useTranslation } from "react-i18next";

const ScheduledNotificationTab = ({page,setPage,itemPerPage="25",selectedTopic="taawin_admin",currentTab}) => {
  const axiosPrivate = useAxiosPrivate();
  const { t } = useTranslation() 
    const {isChangeStatusDialogOpen, isDeleteNotificationDialogOpen, selectedNotification } =
      useNotificationStore();

  const fetchNotifications = async (page) => {

    return axiosPrivate.get(
      `${SCHEDULED_NOTIFICATION_URL}?page=${page}&page_size=${itemPerPage}`
    );
  };
  const {
    data: notifications,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ScheduledNotification",currentTab, page, itemPerPage,selectedTopic],
    queryFn: () => fetchNotifications(page),
  });

  // const currentPage = notifications?.data?.next
  //   ? parseInt(notifications?.data?.next.split("page=")[1]) - 1
  //   : null
  const totalPages = Math.ceil(notifications?.data?.count / itemPerPage); // Assuming 25 items per page

  return (
    <CanSection permissions={["app_api.view_firebasenotification"]}>


        <WrapperComponent
          isEmpty={!notifications?.data?.results?.length}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={<DataTableSkeleton columnCount={5} />}
          emptyStateMessage={
           t("You don't have any notifications get started by sending a new one.")
          }
        >
          <DataTable
            columns={scheduledColumns}
            data={notifications?.data?.results?.map((notification) => ({
              ...notification
            }))||[]}
          />
          <Card className="flex items-center justify-center space-x-2 py-2 px-0 mt-4 w-full">
            <Pagination
              itemPerPage={itemPerPage}
              next={notifications?.data?.next}
              previous={notifications?.data?.previous}
              totalPages={totalPages}
              totalCount={notifications?.data?.count}
              page={page}
              setPage={setPage}
            />
          </Card>

                  <OnChangeStatus
                    name={"ScheduledNotification"}
                    heading={t("Are you absolutely sure?")}
                    description={`${t("This action will")} ${!selectedNotification?.is_approved_by_admin? t('Approve'): t('Rejected') } ${" "} (${selectedNotification?.title}).`}
                    url={SCHEDULED_NOTIFICATION_URL}
                    id={`${selectedNotification?.id}/approve/`}
                    isDialogOpen={isChangeStatusDialogOpen}
                    setIsDialogOpen={setIsChangeStatusDialogOpen}
                    requestType="post"
                    data={{
           
                        is_approved_by_admin:  !selectedNotification?.is_approved_by_admin,
                    }}
                  />
          
        <OnDeleteDialog
          name={"ScheduledNotification"}
          heading={t("Are you absolutely sure?")}
          description={`${t("This action cannot be undone. This will permanently delete this")}  "${selectedNotification?.title}".`}
          url={SCHEDULED_NOTIFICATION_URL}
          id={selectedNotification?.id}
          isDialogOpen={isDeleteNotificationDialogOpen}
          setIsDialogOpen={setIsDeleteNotificationDialogOpen}
        />
        </WrapperComponent>
  
    </CanSection>
  );
};

export default ScheduledNotificationTab;
