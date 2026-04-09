import Section from "@/components/layout/Section";
import DataTable from "@/components/ui/DataTable";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import WrapperComponent from "@/components/layout/WrapperComponent";
import HeaderText from "@/components/layout/header-text";

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
import { APP_ICON_URL } from "@/utils/constants/urls";

import {  Loader2, Plus, RotateCcw, Search, Upload } from "lucide-react";

import {
  setIsAppIconDialogOpen,
  setIsChangeStatusAppIconDialogOpen,
  setIsDeleteDialogOpen,
  setIsFilterMenu,
  setSearchBy,
  setSelectedAppIcon,
  useAppIconStore,
} from "./store";
import qs from "qs";
import AppIconDialog from "./components/AppIconDialog";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OnChangeStatus from "@/components/Dialogs/OnChangeStatus";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tooltip } from "@radix-ui/react-tooltip";
import {  useState } from "react";

import { toast } from "@/components/ui/use-toast";
import { resolveAppIconPlatform } from "@/utils/methods"
import Can from "@/components/Can";
import CanSection from "@/components/CanSection";
import OnDeleteDialog from "@/components/Dialogs/OnDelete";
import CustomsItemsPerPage from "@/components/ui/customs-items-per-page";
import { appIconPlatforms, exportToExcel } from "@/utils/methods";
import { useTranslation } from "react-i18next";
import FiltersSection from "@/components/filters-ui/FiltersSection";
import FiltersMenu from "@/components/filters-ui/FiltersMenu";
const AppIcons = () => {
  // AppIcon Store.
  const { isDeleteAppIconDialogOpen } = useAppIconStore();

  const axiosPrivate = useAxiosPrivate();
  const {t} = useTranslation()
  const {
    isChangeStatusAppIconDialogOpen,
    selectedAppIcon,
    sortBy,
    sortType,
    searchBy,

    isFilterMenu,
  } = useAppIconStore();

  const [search, setSearch] = useState(null);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(null);
  const [filters,setFilters] = useState([])


  const [enabled, setEnabled] = useState(null);
  const [platform, setPlatform] = useState();

  const [itemPerPage, setItemPerPage] = useState("25");
  const [page, setPage] = useState(1);

  const [csvDownload, setCsvDownload] = useState(false);

  const clearFilters = () => {
    setEnabled(null);
    setPlatform();

    setIsFilterMenu(false);
    setPage(1);
    setItemPerPage("25");

    setDebouncedSearchValue(null);
    setSearch(null);
    setSearchBy("name");
  };


//   const defaultsFilters = [
//     {
//       title: t("Platform"),
//       key: "platform",
//       type: "select",
//       options: [
//         {
//           label: 'Android',
//           value: '1',
//         },
//         {
//           label: 'IOS',
//           value: '2',
//         },
//         {
//           label: 'Both',
//           value: '3',
//         },
//       ],
//       value: null
//     },
//   {
//     title: t("Status"),
//     key: "is_active",
//     type: "select",
//     options: [
//       { label: t("All Status"), value: null },
//       { label: t("Enabled"), value: "1" },
//       { label: t("Disable"), value: "0" },
//     ],
//     value:null
//   },
// ];


const GetAndSearchAdminAppIcons = async (page) => {
  const params = new URLSearchParams();

  // Basic pagination and ordering
  params.append("page", page);
  params.append("page_size", itemPerPage);
  params.append(
    "ordering",
    sortBy ? `${sortType === "asc" ? "" : "-"}${sortBy}` : "sort_order"
  );

  // Apply dynamic filters from FiltersMenu
  if (filters?.length) {
    filters.forEach((filter) => {
      if (filter?.value === null || filter?.value === undefined) return;

      let valueToSend = filter.value;

      // Date filters
      if (filter.type === "date" && valueToSend) {
        valueToSend = valueToSend; // Or format if needed
      }

      // Search filter
      if (filter.type === "text" || filter.type === "search") {
        params.append(searchBy || "name", valueToSend);
        return;
      }

      // Handle object-type values (combobox, select objects)
      if (typeof valueToSend === "object") {
        valueToSend =
          valueToSend?.id ?? valueToSend?.value ?? null;
      }

      if (valueToSend === null || valueToSend === undefined) return;

      params.append(filter.key, valueToSend);
    });
  }

  return axiosPrivate.get(`${APP_ICON_URL}?${params.toString()}`);
};




  const {
    data: AppIcons,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "AppIcons",
      page,
      filters,
      debouncedSearchValue,
      enabled,
      platform,
      itemPerPage,
      sortBy,
      sortType,
    ],
    queryFn: () => GetAndSearchAdminAppIcons(page),
  });
  const totalPages = Math.ceil(AppIcons?.data?.count / itemPerPage); // Assuming 25 items per page

  const handleAddAppIcon = () => {
    setSelectedAppIcon(null);
    setIsAppIconDialogOpen(true);
  };


  const isFilter = debouncedSearchValue || enabled !==null ? true : false;

  // Handler for exporting the users as a CSV file.
  const exportCsvHandler = async () => {
    // Set the state to indicate loading and disable the button.
    setCsvDownload(true);


    // Try to fetch and handle the response data.
    try {


      if (AppIcons.data?.results?.length) {

        const currentData = AppIcons.data?.results?.map((AppIcon)=> { 

          return {
            

            id: AppIcon.id,
            name: AppIcon.name,
            platform: resolveAppIconPlatform(AppIcon.platform),
            is_active: AppIcon.is_active ? "Enabled" : "Disable",
        

            
           
          }
        })

        // Reset the state and initiate the CSV file download.
        setCsvDownload(false);
        exportToExcel(currentData, "AppIcons.xlsx");
        
      }
    } catch (error) {
      // Reset the state and notify the user about the error.
      setCsvDownload(false);
      toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <CanSection permissions={["app_api.view_appicon"]}>
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
              <BreadcrumbPage>{t("AppIcons")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderText className={"w-full text-start "} text={t("AppIcons")} />
        {/* {isFilterMenu && (
          <Card className="w-full">
            <CardHeader>
              <CardDescription>{t("Filter By")}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-start flex-wrap w-full gap-4">
              <Select
                onValueChange={(val)=>{
                  setPlatform(val)
                  setPage(1)

                }}
                defaultValue={platform}
                value={platform}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder={t("Select Platform")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("App Icon Platform")}</SelectLabel>
                    {
                                      appIconPlatforms.map((item)=>(
                    
                                      <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                                      ))
                                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                onValueChange={(val)=>{
                  setEnabled(val)
                  setPage(1)

                }}
                defaultValue={enabled}
                value={enabled}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder={t("Select User Status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("App Icon Status")}</SelectLabel>
                    <SelectItem value={null}>{t("All Status")}</SelectItem>
                    <SelectItem value={true}>{t("Enabled")}</SelectItem>
                    <SelectItem value={false}>{t("Disable")}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setDebouncedSearchValue(search);
                    setPage(1)
                  }}
                  className="relative"
                >
                  <Input
                    onChange={(e) => setSearch(e.target.value)}
                    type={searchBy === "id" ? "number" : "text"}
                    placeholder={`${t("Search by")} ${searchBy?.replace(
                      /[_\s]/g,
                      " "
                    )}...`}
                    disabled={isLoading}
                    className={"w-[200px]"}
                  />
                  <Button
                    className="absolute right-0 top-0 rounded-l-none rounded-r-md"
                    variant="secondary"
                    size={"icon"}
                    type="submit"
                  >
                    <Search size={16} />
                  </Button>
                </form>
                <Select onValueChange={setSearchBy} defaultValue={searchBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Search By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("AppIcon Fields")}</SelectLabel>
                      <SelectItem value={"name"} className="capitalize">
                        {t("name")}
                      </SelectItem>
                      <SelectItem value={"id"} className="capitalize">
                        {t("id")}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )} */}
        <Card className="flex justify-between items-center w-full px-2  py-2 flex-wrap gap-4">
        {/* <FiltersSection
          setPage={setPage}
          value={filters}
          // searchQueryKey="title"
          onChange={setFilters}
          isLoading={isLoading}
          isMenuOpen={isFilterMenu}
          setIsMenuOpen={setIsFilterMenu}
        /> */}
          <div className="flex items-center gap-2 justify-start flex-wrap">
            <Can permissions={["app_api.add_appicon"]}>
              <Button
                onClick={handleAddAppIcon}
                className="flex items-center gap-1"
              >
                {/* Medium screen */}
                <span className="hidden md:block">
                  <Plus size={18} />
                </span>
                {/* Small screen */}
                <span className="md:hidden">
                  <Plus size={14} />
                </span>
                {t("Add New Icon")}
              </Button>
            </Can>
           
            <Button
              // variant="outline"
              onClick={exportCsvHandler}
              disabled={csvDownload}
              // className="text-slate-900 dark:text-slate-200"
            >
              {csvDownload ? (
                <p className="flex justify-center items-center space-x-2">
                  <Loader2 className=" h-5 w-5 animate-spin" />
                  <span>{t("Please wait")}</span>
                </p>
              ) : (
                <p className="flex items-center gap-2">
                  {/* Large screen and above */}
                  <span className="hidden md:block">
                    <Upload size={16} />
                  </span>
                  {/* Small screen */}
                  <span className="md:hidden">
                    <Upload size={12} />
                  </span>
                  {t("Export")}
                </p>
              )}
            </Button>
          </div>
          <div className="flex justify-end items-center space-x-2">
          <CustomsItemsPerPage setItemPerPage={setItemPerPage} itemPerPage={itemPerPage}/>

            {/* <Button
              variant={isFilterMenu ? "default" : "outline"}
              onClick={() => {
                setIsFilterMenu(!isFilterMenu);
              }}
            >
              {t("Filter Menu")}
            </Button>

            {isFilter && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={clearFilters}
                      size="icon"
                      variant={"outline"}
                    >
                      <RotateCcw size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{t("Clear Filters")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )} */}
          </div>
        </Card>
          {/* <FiltersMenu
            isLoading={isLoading}
            values={filters}
            onChange={setFilters}
            defaultsFilters={defaultsFilters}
            isMenuOpen={isFilterMenu}
            setIsMenuOpen={setIsFilterMenu}
            setPage={setPage} 
          /> */}
        <WrapperComponent
          isEmpty={!AppIcons?.data?.results?.length > 0}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={<DataTableSkeleton columnCount={5} />}
          emptyStateMessage={
            isFilter
              ? t("You don't have any icons by this filter")
              : t("You don't have any icons get started by creating a new one.")
          }
        >
          {/* {AppIcons?.data?.results?.length > 0 && (
          <> */}
          <DataTable
            name="AppIcons"
            canView={true}
            columns={columns}
            data={AppIcons?.data?.results?.map((AppIcon) => ({
              ...AppIcon
             
            }))}
          />
          <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full min-h-fit">
            <Pagination
              itemPerPage={itemPerPage}
              next={AppIcons?.data?.next}
              previous={AppIcons?.data?.previous}
              totalPages={totalPages}
              totalCount={AppIcons?.data?.count}
              page={page}
              setPage={setPage}
            />
          </Card>
        </WrapperComponent>
        <AppIconDialog />
       
        <OnDeleteDialog
          name={"AppIcons"}
          heading={t("Are you absolutely sure?")}
          description={`${t("This action cannot be undone. This will permanently delete this")}  "${selectedAppIcon?.name}".`}
          url={APP_ICON_URL}
          id={selectedAppIcon?.id}
          isDialogOpen={isDeleteAppIconDialogOpen}
          setIsDialogOpen={setIsDeleteDialogOpen}
        />

        <OnChangeStatus
          name={"AppIcons"}
          heading={t("Are you absolutely sure?")}
          description={`${t("This action will")} ${
            selectedAppIcon?.is_active ? "Disable" : "Enabled"
          }  "${selectedAppIcon?.name}".`}
          url={APP_ICON_URL}
          id={`${selectedAppIcon?.id}/`}
          isDialogOpen={isChangeStatusAppIconDialogOpen}
          setIsDialogOpen={setIsChangeStatusAppIconDialogOpen}
         
          data={{
            name: selectedAppIcon?.name,
            is_active: selectedAppIcon?.is_active ? false : true,
          }}
        />
      </Section>
    </CanSection>
  );
};

export default AppIcons;
