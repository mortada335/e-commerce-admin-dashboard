import WrapperComponent from "@/components/layout/WrapperComponent";
import { Card } from "@/components/ui/card";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "@/components/ui/DataTable";
import Pagination from "@/components/layout/Pagination";
import { formatDate, exportToExcel } from "@/utils/methods";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ZonesDialog from "../zones/ZonesDialog";
import { setIsDeleteZoneDialogOpen, setIsZoneDialogOpen, setSelectedWarehouse, setSelectedZone, useWarehousesStore } from "../../store";
import { Button } from "@/components/ui/button";
import columns from "../zones/columns";
import OnDeleteDialog from "@/components/Dialogs/OnDelete";
const ZonesTab = ({ warehouseId }) => {
  const { t } = useTranslation();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { selectedZone, isDeleteZoneDialogOpen, isZoneDialogOpen } = useWarehousesStore()

  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  const getZones = async () => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("page_size", itemPerPage);
    if (warehouseId) params.append("warehouse", warehouseId);
    return axiosPrivate.get(`/warehouse_zones_admin/?${params.toString()}`);
  };

  const {
    data: zones,
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["WarehouseZones", warehouseId, page, itemPerPage],
    queryFn: getZones,
    enabled: !!warehouseId,
  });

  const totalPages = Math.ceil(zones?.data?.count / itemPerPage);

  // 🔄 Toggle Active/Inactive Mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }) => {
      return axiosPrivate.patch(`/warehouse_zones_admin/${id}/`, { active });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["WarehouseZones"]);
    },
  });

  const handleToggle = (zone) => {
    toggleActiveMutation.mutate({ id: zone.id, active: !zone.active });
  };

  // 📤 CSV Export
  const exportCsvHandler = () => {
    if (!zones?.data?.results?.length) return;
    const csvData = zones.data.results.map((z) => ({
      ID: z.id,
      Name: z.name,
      Warehouse: z.warehouse,
      Active: z.active ? t("Enabled") : t("Disabled"),
      Distance: z.distance,
      Threshold: z.threshold,
      Fees_Above_Threshold: z.fees_above_threshold,
      Fees_Below_Threshold: z.fees_below_threshold,
      Service_Fee: z.service_fee,
      MOV: z.mov,
      Created_At: formatDate(z.created_at),
      Updated_At: formatDate(z.updated_at),
    }));
    exportToExcel(csvData, "Warehouse_Zones.xlsx");
  };

  const addNewZone = () => {
    setIsZoneDialogOpen(true)
    setSelectedZone(null);
  }
  return (
    <Card className="flex flex-col justify-start items-center w-full h-full space-y-4">
      <div className="flex justify-between items-center rtl:flex-row-reverse w-full px-4 pt-4">
        <h2 className="text-xl font-semibold">{t("Warehouse Zones")}</h2>
        <div className="flex gap-3 justify-center items-center rtl:flex-row-reverse">
          <Button
            onClick={exportCsvHandler}
            className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-md hover:opacity-90"
          >
            {t("Export")}
          </Button>
          <Button variant="default" onClick={addNewZone}>{t("add_new_zone")}</Button>
        </div>
      </div>

      <WrapperComponent
        isEmpty={zones?.data?.results?.length === 0}
        isError={isError}
        error={error}
        isLoading={isLoading}
        loadingUI={<DataTableSkeleton columnCount={8} />}
        emptyStateMessage={t("Zones not found")}
      >
        <DataTable
          columns={columns}
          data={zones?.data?.results?.map((z) => ({
            id: z.id,
            name: z.name,
            active: z.active,
            distance: z.distance,
            threshold: z.threshold,
            fees_above_threshold: z.fees_above_threshold,
            fees_below_threshold: z.fees_below_threshold,
            service_fee: z.service_fee,
            mov: z.mov,
            created_at: formatDate(z.created_at),
            updated_at: formatDate(z.updated_at),
          }))}
        />
        <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
          <Pagination
            itemPerPage={itemPerPage}
            next={zones?.data?.next}
            previous={zones?.data?.previous}
            totalPages={totalPages}
            totalCount={zones?.data?.count}
            page={page}
            setPage={setPage}
          />
        </Card>
      </WrapperComponent>
      <OnDeleteDialog
        name={"Zone"}
        heading={t("Are you absolutely sure?")}
        description={`${t("This action cannot be undone. This will permanently delete this")} 
         "${selectedZone?.name}".`}
        url={`/warehouse_zones_admin/`}
        id={selectedZone?.id + "/"}
        isDialogOpen={isDeleteZoneDialogOpen}
        setIsDialogOpen={setIsDeleteZoneDialogOpen}
      />
      <ZonesDialog warehouseId={warehouseId} />
    </Card>
  );
};

export default ZonesTab;
