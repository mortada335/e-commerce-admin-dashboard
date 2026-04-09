
import DataTable from "@/components/ui/DataTable";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";

import columns from "../components/columns";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { NOTIFICATION_URL } from "@/utils/constants/urls";
import WrapperComponent from "@/components/layout/WrapperComponent";

import { formatFullDate } from "@/utils/methods";

import Pagination from "@/components/layout/Pagination";
import CanSection from "@/components/CanSection";
import { useTranslation } from "react-i18next";

const SentNotificationTab = ({page,setPage,itemPerPage="25",selectedTopic="taawin_admin",currentTab}) => {
  const axiosPrivate = useAxiosPrivate();
  const {t} = useTranslation()

  const fetchNotifications = async (page) => {

    return axiosPrivate.get(
      `${NOTIFICATION_URL}?page=${page}&page_size=${itemPerPage}&topic=${selectedTopic}`
    );
  };
  const {
    data: notifications,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["SentNotification",currentTab, page, itemPerPage,selectedTopic],
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
            columns={columns}
            data={notifications?.data?.results?.map((notification) => ({
              id: notification.id,
              title: notification.title,
              body: notification.body,
              sentAt: notification.sent_at
                ? formatFullDate(notification.sent_at)
                : "/",
            }))}
          />
          <Card className="flex items-center justify-center space-x-2 py-2 my-2 px-0 w-full">
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
        </WrapperComponent>
  
    </CanSection>
  );
};

export default SentNotificationTab;
