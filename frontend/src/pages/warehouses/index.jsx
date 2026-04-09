
import Section from "@/components/layout/Section";
import WrapperComponent from "@/components/layout/WrapperComponent";

import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";

import { useQuery } from "@tanstack/react-query";


import { useEffect, useState } from "react";


import { Card } from "@/components/ui/card";

import {

  setIsDeleteWarehouseDialogOpen,
  setIsFilterMenu,
  setIsWarehouseDialogOpen,
  setSelectedWarehouse,
  useWarehousesStore,
} from "./store";
import columns from "./components/columns";



import { Button } from "@/components/ui/button";
import { Layers, List, Plus } from "lucide-react";



// import FilterMenu from "./components/FilterMenu";
import CustomsItemsPerPage from "@/components/ui/customs-items-per-page";
import OnDeleteDialog from "@/components/Dialogs/OnDelete";
import Pagination from "@/components/layout/Pagination";


import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { WAREHOUSES_URL } from "@/utils/constants/urls";
import WarehouseDialog from "./components/WarehouseDialog";
import CanSection from "@/components/CanSection";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import DataTable from "@/components/ui/DataTable";
import ColumnsMenu from "@/components/data-table/ColumnsMenu";
import Can from "@/components/Can";
import WarehouseCard from "./components/WarehouseCard";
import FiltersMenu from "@/components/filters-ui/FiltersMenu";
import FiltersSection from "@/components/filters-ui/FiltersSection";
import { useTranslation } from "react-i18next";
import i18n from "@/locales/i18n";



const Warehouses = () => {

  const axiosPrivate = useAxiosPrivate();
  const {t} = useTranslation()

  const {
    sortBy,
    selectedWarehouse,
    sortType,
    isDeleteWarehouseDialogOpen,
    isFilterMenu,
  } = useWarehousesStore();
  const [filters, setFilters] = useState([]);

  const [itemPerPage, setItemPerPage] = useState("25");
  const [page, setPage] = useState(1);

  const tabs = [
    {
      title: t('card'),
      value: "card",
      icon: <Layers size={16} />,
    },
    {
      title: t('list'),
      value: "list",
      icon: <List size={16} />,
    },
  ];


    const defaultsFilters = [
    {
    title:t("code"),
    type:"text",
    key:"code",
    value:null
    },
   
    ];


  const [isFilter, setIsFilter] = useState(null);
  useEffect(() => {
    if (filters?.length > 0) {
      setIsFilter(true);
    } else {
      setIsFilter(false);
    }
  }, [filters]);

  const handleAddNew = () => {
    setIsWarehouseDialogOpen(true);
    setSelectedWarehouse(null);
  };

  // Set initial visibility: true for visible columns, false for hidden ones
  const [columnVisibility, setColumnVisibility] = useState({
    code: true,
    amount_iqd: JSON.parse(localStorage.getItem("amount_iqd")) ?? true,
    redeemed_at: JSON.parse(localStorage.getItem("redeemed_at")) ?? true,
    created_at: JSON.parse(localStorage.getItem("created_at")) ?? true,
    updated_at: JSON.parse(localStorage.getItem("updated_at")) ?? true,
    actions: true,
  });

  const getWarehouses = async () => {
    // Create a new URLSearchParams object
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", itemPerPage);

    params.append(
      "ordering",
      sortBy ? `${sortType === "asc" ? "" : "-"}${sortBy}` : "-created_at"
    );

    if (filters?.length) {
      filters?.forEach((filter) => {
        if (filter?.value) {
          params.append(filter?.key, filter?.value);
        }
      });
    }


    return axiosPrivate.get(`${WAREHOUSES_URL}?${params.toString()}`);
  };

  const {
    isLoading,
    isError,
    data: Warehouses,
    error,
  } = useQuery({
    queryKey: ["warehouses", sortBy, sortType, page, itemPerPage, filters],
    queryFn: () => getWarehouses(),
  });
  const totalPages = Math.ceil(Warehouses?.data?.count/ itemPerPage); // Assuming 25 items per page

    const disabledColumnVisibility = (column) =>{

    if (column) {
      
      return  column?.accessorKey!=='code' 
    }else{
      return true
    }


  }

  return (
    <CanSection permissions={["app_api.view_ocwarehouse"]}>
      <Section className="gap-8  h-full max-h-fit items-start ">
        
        <Tabs
          defaultValue="card"
          className="flex flex-col justify-start items-start gap-4  w-full h-fit max-h-fit pb-5"
        >
          {/* {isFilterMenu && (
            <FilterMenu
              isLoading={isLoading}
              filters={filters}
              setFilters={setFilters}
              setPage={setPage}
            />
          )} */}
          <Card className=" flex flex-col md:flex-row   rtl:flex-row-reverse flex-wrap justify-between  items-center w-full h-fit px-4 py-3 md:py-2 gap-4 ">
            <div className="flex justify-start items-center rtl:flex-row-reverse w-fit gap-4">
            <Breadcrumb dir={i18n.dir()}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/">{t("Home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>
                <BreadcrumbPage>{t("Warehouses")}</BreadcrumbPage>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
              <Separator orientation={"vertical"} className="h-[30px]" />
              <TabsList className="w-fit rtl:flex-row-reverse bg-inherit p-0">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    className="w-full flex justify-center capitalize  items-center gap-2 data-[state=active]:border-b-2 rounded-none border-blue-500 data-[state=active]:bg-inherit data-[state=active]:shadow-none"
                    value={tab.value}
                  >
                    {tab.icon}
                    <span className="">{tab.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
                        <FiltersSection
            setPage={setPage} 
            value={filters} 
            onChange={setFilters}  
            isLoading={isLoading}
              isMenuOpen={isFilterMenu}
              searchQueryKey="name"
            setIsMenuOpen={setIsFilterMenu}
         />
            <div className="flex flex-wrap flex-row  justify-end items-center gap-2">
              {/* <Can permissions={["app_api.add_ocwarehouse"]}>
                <Button
                  onClick={handleAddNew}
                  className="flex items-center gap-1 text-xs md:text-sm"
                >
                
                  <span className="hidden md:block">
                    <Plus size={18} />
                  </span>
        
                  <span className="md:hidden">
                    <Plus size={14} />
                  </span>
                  Add Warehouse
                </Button>
              </Can> */}
            

              <ColumnsMenu
                columns={columns}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                disabledColumnVisibility={disabledColumnVisibility}
              />
              <CustomsItemsPerPage
                itemPerPage={itemPerPage}
                setItemPerPage={setItemPerPage}
              />

            </div>
          </Card>
                    <FiltersMenu
            isLoading={isLoading}
            values={filters}
            onChange={setFilters}
            defaultsFilters={defaultsFilters}
            isMenuOpen={isFilterMenu}
            setIsMenuOpen={setIsFilterMenu}
            setPage={setPage} 
          />
          <WrapperComponent
            isEmpty={Warehouses?.data?.results?.length  === 0}
            isError={isError}
            error={error}
            isLoading={isLoading}
            loadingUI={<DataTableSkeleton columnCount={5} />}
                      emptyStateMessage={
            isFilter
              ? "You don't have any warehouses by this filter"
              : "You don't have any warehouses get started by creating a new one."
          }
          >
            <TabsContent className="w-full h-full max-h-fit" value="list">
              <DataTable
                name="warehouses"
                columns={columns}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                data={Warehouses?.data?.results?.map((Warehouse) => ({
                  ...Warehouse,
                }))||[]}
              />
            </TabsContent>

            <TabsContent className="w-full h-full max-h-fit " value="card">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 border py-4 px-4 rounded-md w-full h-full max-h-fit">
                {Warehouses?.data?.results?.map((item) => (
                  <WarehouseCard
                    key={item?.id}
                    data={item}
                  />
                ))||[]}
              </div>
            </TabsContent>
            <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full ">
              <Pagination
                itemPerPage={itemPerPage}
                next={Warehouses?.data?.next}
                previous={Warehouses?.data?.previous}
                totalPages={totalPages}
                totalCount={Warehouses?.data?.count}
                page={page}
                setPage={setPage}
              />
            </Card>
            <Can permissions={["app_api.delete_ocwarehouse"]}>
              <OnDeleteDialog
                name={"warehouses"}
                heading={t("Are you absolutely sure?")}
                description={`
                  ${t("This action cannot be undone. This will permanently delete")}
                ${selectedWarehouse?.code}.`}
                url={WAREHOUSES_URL}
                id={selectedWarehouse?.id}
                isDialogOpen={isDeleteWarehouseDialogOpen}
                setIsDialogOpen={setIsDeleteWarehouseDialogOpen}
              />
            </Can>
          </WrapperComponent>
        </Tabs>
        <WarehouseDialog />
      </Section>
    </CanSection>
  );
};


export default Warehouses;

