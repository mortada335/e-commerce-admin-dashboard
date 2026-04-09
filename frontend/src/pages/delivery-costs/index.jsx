import Section from "@/components/layout/Section";
import DataTable from "@/components/ui/DataTable";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import WrapperComponent from "@/components/layout/WrapperComponent";
import HeaderText from "@/components/layout/header-text";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import Pagination from "@/components/layout/Pagination";

import columns from "./components/columns";
import { displayBasicDate } from "@/utils/methods";
import { DELIVERY_COSTS_ULR } from "@/utils/constants/urls";
import UpdateDeliveryCostDialog from "./components/UpdateDeliveryCostDialog";
import CanSection from "@/components/CanSection";
import Can from "@/components/Can";
import { Plus } from "lucide-react";
import { setIsUpdateDeliveryCostDialogOpen, useDeliveryCostStore } from "./store";
import { useTranslation } from "react-i18next";

const DeliveryCosts = () => {
  const axiosPrivate = useAxiosPrivate();
  const {isUpdateDeliveryCostDialogOpen}=useDeliveryCostStore()
  const [page, setPage] = useState(1);
  const {t}=useTranslation()


  const fetchDeliveryCosts = async (page) => {
    return axiosPrivate.get(`${DELIVERY_COSTS_ULR}?page=${page}`);
  };

  const {
    data: deliveryCosts,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["DeliveryCosts", page],
    queryFn: () => fetchDeliveryCosts(page),
  });
  const totalPages = Math.ceil(deliveryCosts?.data?.count / 25); // Assuming 25 items per page

  return (
    <CanSection permissions={["app_api.view_deliverycost","app_api.change_deliverycost"]}>
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
              <BreadcrumbPage>{t("Delivery Costs")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderText className={"w-full text-start "} text={t("Delivery Costs")} />
          {/* <Card className="flex justify-start items-center w-full px-2  py-2">
        <Can permissions={["app_api.change_deliverycost"]}>
            <Button
              onClick={() => setIsUpdateDeliveryCostDialogOpen(true)}
              className="flex items-center gap-1"
            >
             
              <span className="hidden md:block">
                <Plus size={18} />
              </span>
             
              <span className="md:hidden">
                <Plus size={14} />
              </span>
              Update Delivery Cost
            </Button>
        </Can>
          </Card> */}

        <WrapperComponent
          isEmpty={!deliveryCosts?.data?.results?.length > 0}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={<DataTableSkeleton columnCount={5} />}
        >
          {/* {banners?.data?.results?.length > 0 && (
          <> */}
          <DataTable
            columns={columns}
            data={deliveryCosts?.data?.results?.map((delivery_cost) => ({
              id: delivery_cost.id,
              zone: delivery_cost.zone,
              cost: delivery_cost.cost,
              special_cost: delivery_cost.special_cost,
              special_cost_total_order: delivery_cost.special_cost_total_order,
              start_date: delivery_cost.date_start
                ? displayBasicDate(delivery_cost.date_start)
                : null,
              end_date: delivery_cost.date_end
                ? displayBasicDate(delivery_cost.date_end)
                : null,
            }))}
          />
          <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
            <Pagination
              next={deliveryCosts?.data?.next}
              previous={deliveryCosts?.data?.previous}
              totalPages={totalPages}
              totalCount={deliveryCosts?.data?.count}
              page={page}
              setPage={setPage}
            />
          </Card>
        </WrapperComponent>
        <UpdateDeliveryCostDialog
          isDialogOpen={isUpdateDeliveryCostDialogOpen}
          setIsDialogOpen={setIsUpdateDeliveryCostDialogOpen}
        />
      </Section>
    </CanSection>
  );
};

export default DeliveryCosts;
