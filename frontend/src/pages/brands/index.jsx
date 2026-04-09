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
import { BRAND_URL } from "@/utils/constants/urls";

import { Link2, Loader2, Plus, RotateCcw, Search, Upload } from "lucide-react";

import {
  setIsBrandDialogOpen,
  setIsChangeStatusBrandDialogOpen,
  setIsDeleteDialogOpen,
  setIsFilterMenu,
  setSearchBy,
  setSelectedBrand,
  useBrandStore,
} from "./store";
import qs from "qs";
import BrandDialog from "./components/BrandDialog";

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

import Can from "@/components/Can";
import CanSection from "@/components/CanSection";
import OnDeleteDialog from "@/components/Dialogs/OnDelete";
import AssignBrand from "./components/AssignBrand";
import CustomsItemsPerPage from "@/components/ui/customs-items-per-page";
import { exportToExcel } from "@/utils/methods";
import { useTranslation } from "react-i18next";
const Brands = () => {
  // Brand Store.
  const { isDeleteBrandDialogOpen } = useBrandStore();

  const axiosPrivate = useAxiosPrivate();
  const {
    isChangeStatusBrandDialogOpen,
    selectedBrand,
    sortBy,
    sortType,
    searchBy,

    isFilterMenu,
  } = useBrandStore();

  const [search, setSearch] = useState(null);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(null);
  const [isAssignBrand, setIsAssignBrand] = useState(false);
  const {t} = useTranslation()

  const [enabled, setEnabled] = useState(null);

  const [itemPerPage, setItemPerPage] = useState("25");
  const [page, setPage] = useState(1);

  const [csvDownload, setCsvDownload] = useState(false);

  const clearFilters = () => {
    setEnabled(null);

    setIsFilterMenu(false);
    setPage(1);
    setItemPerPage("25");

    setDebouncedSearchValue(null);
    setSearch(null);
    setSearchBy("name");
  };

  const GetAndSearchAdminBrands = async (page) => {
    let searchKeyObject = {};

    searchKeyObject = Object.fromEntries(
      Object.entries({
        [searchBy]: debouncedSearchValue,
        enabled: enabled,
        ordering: sortBy
          ? `${sortType === "asc" ? "" : "-"}${sortBy}`
          : "sort_order",
        // eslint-disable-next-line no-unused-vars
      }).filter(([_, value]) => value !== undefined && value !== null)
    );
    return axiosPrivate.get(
      `${BRAND_URL}?page=${page}&page_size=${itemPerPage}`,
      {
        params: { ...searchKeyObject },
        paramsSerializer: (params) => qs.stringify(params, { encode: false }),
      }
    );
  };



  const {
    data: brands,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "Brands",
      page,
      debouncedSearchValue,
      enabled,
      itemPerPage,
      sortBy,
      sortType,
    ],
    queryFn: () => GetAndSearchAdminBrands(page),
  });
  const totalPages = Math.ceil(brands?.data?.count / itemPerPage); // Assuming 25 items per page

  const handleAddBrand = () => {
    setSelectedBrand(null);
    setIsBrandDialogOpen(true);
  };
  const handleAssignBrand = () => {
    setIsAssignBrand(true);
  };

  const isFilter = debouncedSearchValue || enabled !==null ? true : false;

  // Handler for exporting the users as a CSV file.
  const exportCsvHandler = async () => {
    // Set the state to indicate loading and disable the button.
    setCsvDownload(true);

    // Initialize an object to store search params fro API request..
    // let searchKeyObject = {};

    // // Convert an object into an array of [key, value] pairs, filter it, then convert it back to an object.
    // searchKeyObject = Object.fromEntries(
    //   Object.entries({
    //     [searchBy]: debouncedSearchValue ? debouncedSearchValue : null,
    //     enabled: enabled,
    //     ordering: sortBy
    //       ? `${sortType === "asc" ? "" : "-"}${sortBy}`
    //       : "sort_order",
    //     columns: "manufacturer_id,name,sort_order,enabled",
    //     // eslint-disable-next-line no-unused-vars
    //   }).filter(([_, value]) => value !== undefined && value !== null)
    // );

    // Try to fetch and handle the response data.
    try {
      // const response = await getExportedCsv(searchKeyObject, itemPerPage, page);

      // // Handle cases where the response status is not 200.
      // if (response.status !== 200) {
      //   // Reset the state and notify the user about the export failure.
      //   setCsvDownload(false);
      //   toast({
      //     variant: "destructive",
      //     title: "Failed!!!",
      //     description: `Failed to export due, ${response.message}`,
      //   });
      // }

      // // Succesfull request and handle the data.
      // if (response.data) {
      //   // Reset the state and initiate the CSV file download.
      //   setCsvDownload(false);
      //   downloadCsv(response.data, undefined, "Brands.csv");
      // }

      if (brands.data?.results?.length) {

        const currentData = brands.data?.results?.map((brand)=> { 

          return {
            

            brand_id: brand.manufacturer_id,
            name: brand.name,
            index: brand.sort_order,
            enabled: brand.enabled ? "Enabled" : "Disable",
            image: brand.image,

            
           
          }
        })

        // Reset the state and initiate the CSV file download.
        setCsvDownload(false);
        exportToExcel(currentData, "Brands.xlsx");
        
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
    <CanSection permissions={["app_api.view_ocmanufacturer"]}>
      <Section className="space-y-8 h-fit items-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Brands</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderText className={"w-full text-start "} text={"Brands"} />
        {isFilterMenu && (
          <Card className="w-full">
            <CardHeader>
              <CardDescription>{t("Filter By")}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-start flex-wrap w-full gap-4">
              <Select
                onValueChange={(val)=>{
                  setEnabled(val)
                  setPage(1)

                }}
                defaultValue={enabled}
                value={enabled}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select User Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("Brand Status")}</SelectLabel>
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
                    type={searchBy === "sort_order" ? "number" : "text"}
                    placeholder={`Search by ${searchBy?.replace(
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
                      <SelectLabel>Brand Fields</SelectLabel>
                      <SelectItem value={"name"} className="capitalize">
                        name
                      </SelectItem>
                      <SelectItem value={"sort_order"} className="capitalize">
                        Index
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}
        <Card className="flex justify-between items-center w-full px-2  py-2 flex-wrap gap-4">
          <div className="flex items-center gap-2 justify-start flex-wrap">
            <Can permissions={["app_api.add_ocmanufacturer"]}>
              <Button
                onClick={handleAddBrand}
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
                Add New Brand
              </Button>
            </Can>
            <Can permissions={["app_api.change_ocmanufacturer"]}>
              <Button
                variant="outline"
                onClick={handleAssignBrand}
                className="flex items-center gap-2 text-slate-900 dark:text-slate-200"
              >
                {/* Medium screen and above */}
                <span className="hidden md:block">
                  <Link2 size={18} />
                </span>
                {/* Small screen */}
                <span className="md:hidden">
                  <Link2 size={14} />
                </span>
                Link Brand
              </Button>
            </Can>
            <Button
              variant="outline"
              onClick={exportCsvHandler}
              disabled={csvDownload}
              className="text-slate-900 dark:text-slate-200"
            >
              {csvDownload ? (
                <p className="flex justify-center items-center space-x-2">
                  <Loader2 className=" h-5 w-5 animate-spin" />
                  <span>Please wait</span>
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
                  Export
                </p>
              )}
            </Button>
          </div>
          <div className="flex justify-end items-center space-x-2">
          <CustomsItemsPerPage setItemPerPage={setItemPerPage} itemPerPage={itemPerPage}/>

            <Button
              variant={isFilterMenu ? "default" : "outline"}
              onClick={() => {
                setIsFilterMenu(!isFilterMenu);
              }}
            >
              Filter Menu
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
                    <p className="text-xs">Clear Filters</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </Card>

        <WrapperComponent
          isEmpty={!brands?.data?.results?.length > 0}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={<DataTableSkeleton columnCount={5} />}
          emptyStateMessage={
            isFilter
              ? "You don't have any banners by this filter"
              : "You don't have any banners get started by creating a new one."
          }
        >
          {/* {brands?.data?.results?.length > 0 && (
          <> */}
          <DataTable
            name="Brands"
            canView={true}
            to={"/catalog/brands/details/"}
            columns={columns}
            data={brands?.data?.results?.map((brand) => ({
              manufacturer_id: brand.manufacturer_id,
              id: brand.manufacturer_id,
              name: brand.name,
              sort_order: brand.sort_order,
              image: brand.image,

              enabled: brand.enabled,
              actions: brand.manufacturer_id,
            }))}
          />
          <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full min-h-fit">
            <Pagination
              itemPerPage={itemPerPage}
              next={brands?.data?.next}
              previous={brands?.data?.previous}
              totalPages={totalPages}
              totalCount={brands?.data?.count}
              page={page}
              setPage={setPage}
            />
          </Card>
        </WrapperComponent>
        <BrandDialog />
        <AssignBrand
          isDialogOpen={isAssignBrand}
          setIsDialogOpen={setIsAssignBrand}
        />
        <OnDeleteDialog
          name={"Brands"}
          heading={"Are you absolutely sure?"}
          description={`This action cannot be undone. This will permanently delete this  "${selectedBrand?.name}".`}
          url={BRAND_URL}
          id={selectedBrand?.manufacturer_id}
          isDialogOpen={isDeleteBrandDialogOpen}
          setIsDialogOpen={setIsDeleteDialogOpen}
        />

        <OnChangeStatus
          name={"Brands"}
          heading={"Are you absolutely sure?"}
          description={`This action will ${
            selectedBrand?.enabled ? "Disable" : "Enabled"
          }  "${selectedBrand?.name}".`}
          url={BRAND_URL}
          id={`${selectedBrand?.manufacturer_id}/`}
          isDialogOpen={isChangeStatusBrandDialogOpen}
          setIsDialogOpen={setIsChangeStatusBrandDialogOpen}
          headers={{
            "Content-Type": "multipart/form-data",
          }}
          data={{
            name: selectedBrand?.name,
            enabled: selectedBrand?.enabled ? false : true,
          }}
        />
      </Section>
    </CanSection>
  );
};

export default Brands;
