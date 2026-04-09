
import Section from "@/components/layout/Section";
import WrapperComponent from "@/components/layout/WrapperComponent";

import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";

import { useQuery } from "@tanstack/react-query";


import { useEffect, useState } from "react";


import { Card } from "@/components/ui/card";

import {
  setIsBulkGiftCardDialogOpen,
  setIsDeleteGiftCardDialogOpen,
  setIsFilterMenu,
  setIsGiftCardDialogOpen,
  setSelectedGiftCard,
  useGiftCardsStore,
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
import { ADMIN_GIFT_CARDS_URL } from "@/utils/constants/urls";
import GiftCardDialog from "./components/GiftCardDialog";
import CanSection from "@/components/CanSection";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import DataTable from "@/components/ui/DataTable";
import ColumnsMenu from "@/components/data-table/ColumnsMenu";
import Can from "@/components/Can";
import GiftCard from "./components/GiftCard";
import FiltersMenu from "@/components/filters-ui/FiltersMenu";
import FiltersSection from "@/components/filters-ui/FiltersSection";
import BulkGiftCardDialog from "./components/BulkGiftCardDialog";
import { useTranslation } from "react-i18next";
import i18n from "@/locales/i18n";


const GiftCards = () => {

  const axiosPrivate = useAxiosPrivate();
  const {t} = useTranslation()

  const {
    sortBy,
    selectedGiftCard,
    sortType,
    isDeleteGiftCardDialogOpen,
    isFilterMenu,
  } = useGiftCardsStore();
  const [filters, setFilters] = useState([]);

  const [itemPerPage, setItemPerPage] = useState("25");
  const [page, setPage] = useState(1);

  const tabs = [
    {
      title: t('List'),
      value: "list",
      icon: <List size={16} />,
    },
    {
      title: t('Card'),
      value: "card",
      icon: <Layers size={16} />,
    },
  ];


    const defaultsFilters = [
    {
    title:"amount",
    type:"text",
    key:"amount_iqd",
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
    setIsGiftCardDialogOpen(true);
    setSelectedGiftCard(null);
  };
  const handleBulkAddNew = () => {
    setIsBulkGiftCardDialogOpen(true);
    setSelectedGiftCard(null);
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

  const getGiftCards = async () => {
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


    return axiosPrivate.get(`${ADMIN_GIFT_CARDS_URL}?${params.toString()}`);
  };

  const {
    isLoading,
    isError,
    data: GiftCards,
    error,
  } = useQuery({
    queryKey: ["gift-cards", sortBy, sortType, page, itemPerPage, filters],
    queryFn: () => getGiftCards(),
  });
  const totalPages = Math.ceil(GiftCards?.data?.count/ itemPerPage); // Assuming 25 items per page

    const disabledColumnVisibility = (column) =>{

    if (column) {
      
      return  column?.accessorKey!=='code' 
    }else{
      return true
    }


  }

  return (
    <CanSection permissions={["app_api.view_currencyexchange"]}>
      <Section className="gap-8  h-full max-h-fit items-start ">
        
        <Tabs
          defaultValue="list"
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
          <Card className=" flex flex-col md:flex-row rtl:flex-row-reverse flex-wrap justify-between  items-center w-full h-fit px-4 py-3 md:py-2 gap-4 ">
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
                <BreadcrumbPage>{t("Gift Cards")}</BreadcrumbPage>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
              <Separator orientation={"vertical"} className="h-[30px]" />
              <TabsList className="w-fit  bg-inherit rtl:flex-row-reverse p-0">
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
              searchQueryKey="code"
            setIsMenuOpen={setIsFilterMenu}
         />
            <div className="flex flex-wrap flex-row  justify-end items-center gap-2">
              <Can permissions={["app_api.add_giftcard"]}>
                <Button
                  onClick={handleAddNew}
                  className="flex items-center gap-1 text-xs md:text-sm"
                >
                  {/* Medium screen and above. */}
                  <span className="hidden md:block">
                    <Plus size={18} />
                  </span>
                  {/* Small screen. */}
                  <span className="md:hidden">
                    <Plus size={14} />
                  </span>
                  {t("Add Gift Card")}
                </Button>
              </Can>
              <Can permissions={["app_api.add_giftcard"]}>
                <Button
                  onClick={handleBulkAddNew}
                  className="flex items-center gap-1 text-xs md:text-sm"
                >
                  {/* Medium screen and above. */}
                  <span className="hidden md:block">
                    <Plus size={18} />
                  </span>
                  {/* Small screen. */}
                  <span className="md:hidden">
                    <Plus size={14} />
                  </span>
                   {t("Bulk Create Gift Card")}
                </Button>
              </Can>

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
            isEmpty={GiftCards?.data?.results?.length  === 0}
            isError={isError}
            error={error}
            isLoading={isLoading}
            loadingUI={<DataTableSkeleton columnCount={5} />}
                      emptyStateMessage={
            isFilter
              ? t("You don't have any gift cards by this filter")
              : t("You don't have any gift cards get started by creating a new one.")
          }
          >
            <TabsContent className="w-full h-full max-h-fit" value="list">
              <DataTable
                name="gift-cards"
                columns={columns}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                data={GiftCards?.data?.results?.map((GiftCard) => ({
                  ...GiftCard,
                }))||[]}
              />
            </TabsContent>

            <TabsContent className="w-full h-full max-h-fit " value="card">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 border py-4 px-4 rounded-md w-full h-full max-h-fit">
                {GiftCards?.data?.results?.map((item) => (
                  <GiftCard
                    key={item?.id}
                    data={item}
                  />
                ))||[]}
              </div>
            </TabsContent>
            <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full ">
              <Pagination
                itemPerPage={itemPerPage}
                next={GiftCards?.data?.next}
                previous={GiftCards?.data?.previous}
                totalPages={totalPages}
                totalCount={GiftCards?.data?.count}
                page={page}
                setPage={setPage}
              />
            </Card>
            <Can permissions={["app_api.delete_giftcard"]}>
              <OnDeleteDialog
                name={"gift-cards"}
                heading={t("Are you absolutely sure?")}
                description={`
                  ${t("This action cannot be undone. This will permanently delete")}
                ${selectedGiftCard?.code}.`}
                url={ADMIN_GIFT_CARDS_URL}
                id={selectedGiftCard?.id}
                isDialogOpen={isDeleteGiftCardDialogOpen}
                setIsDialogOpen={setIsDeleteGiftCardDialogOpen}
              />
            </Can>
          </WrapperComponent>
        </Tabs>
        <GiftCardDialog />
        <BulkGiftCardDialog />
      </Section>
    </CanSection>
  );
};


export default GiftCards;

