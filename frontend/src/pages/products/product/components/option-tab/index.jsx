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
import { PRODUCT_OPTIONS_URL, } from "@/utils/constants/urls";

import OnDeleteDialog from "@/components/Dialogs/OnDelete";
import {
  useOptionStore,
  setIsDeleteOptionDialogOpen,

  setSearchBy,

  setIsFilterMenu,
  setIsOptionDialogOpen,
  setSelectedOption,

} from "./store";

import qs from "qs";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {  Download, Loader2, Plus, RotateCcw, Search, Upload,  } from "lucide-react";

import { Input } from "@/components/ui/input";


import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useState } from "react";

import { toast } from "@/components/ui/use-toast";

import CustomsItemsPerPage from "@/components/ui/customs-items-per-page";
import { exportToExcel, formatNumberWithCurrency } from "@/utils/methods";
import OptionDialog from "./components/OptionDialog";
import Can from "@/components/Can";
import { useTranslation } from "react-i18next";

const OptionsTab = ({ productId = null }) => {
  const axiosPrivate = useAxiosPrivate();
  const {t}= useTranslation()
  const {
    isDeleteOptionDialogOpen,
    selectedOption,
    isOptionDialogOpen,
    searchBy,

    selectedCity,


    sortType,
    sortBy,
    isFilterMenu,
  } = useOptionStore();

  const [search, setSearch] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(null);

  // CSV download State
  const [csvDownload, setCsvDownload] = useState(null);

  const [itemPerPage, setItemPerPage] = useState("25");
  const [page, setPage] = useState(1);


    const handleAddNew = () => {
      setSelectedOption(null);
      setIsOptionDialogOpen(true);
    };

  const clearFilters = () => {

    setIsFilterMenu(false);
    setPage(1);
    setItemPerPage("25");

    setDebouncedSearchValue(null);
    setSearch(null);
    setSearchBy("product_option_value_id");
  };

  const GetAdminOrder = async (page) => {
    // Initialize an object to store search params fro API request.
    let searchKeyObject = {};

    // Convert object to [key, value] array and filter it, then reconvert to a valid {key: value} object.
    searchKeyObject = Object.fromEntries(
      Object.entries({
        [searchBy]: debouncedSearchValue ? debouncedSearchValue : null,

        product_id: productId,
        ordering: sortBy
          ? `${sortType === "asc" ? "" : "-"}${sortBy}`
          : "-date_added",
        // eslint-disable-next-line no-unused-vars
      }).filter(([_, value]) => value !== undefined && value !== null)
    );

    return axiosPrivate.get(
      `${PRODUCT_OPTIONS_URL}?page=${page}&page_size=${itemPerPage}`,
      {
        params: { ...searchKeyObject },
        paramsSerializer: (params) => qs.stringify(params, { encode: false }),
      }
    );
  };

  const {
    data: options,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "Options",
      page,
      debouncedSearchValue,
      selectedCity,

      sortBy,
      sortType,
      itemPerPage,

      productId,

 
    ],
    queryFn: () => GetAdminOrder(page),
  });
  const totalPages = Math.ceil(options?.data?.count / itemPerPage); // Assuming 25 items per page
  const isChild = productId === null ? true : false;
  const isFilter =
    selectedCity || debouncedSearchValue 
      ? true
      : false;

  // Handler for exporting the options list as a CSV file.
  const exportCsvHandler = async () => {
    // Set the state to indicate loading and disable the button.
    setCsvDownload(true);



    try {


      if (options.data?.results?.length) {

        const currentData = options.data?.results?.map((option)=> { 

          
          

          return {
            

              product_option_value_id: option?.product_option_value_id,

              option: option?.option,
              quantity: option?.quantity,

              price: formatNumberWithCurrency(String(option?.price), "IQD"),
              points: option?.points,

            
           
          }
        })

        // Reset the state and initiate the CSV file download.
        setCsvDownload(false);
        exportToExcel(currentData, "options.xlsx");
        // downloadCsv(response.data, undefined, "options List.csv");
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
    <Section className="space-y-6 h-fit rtl:items-end items-start px-0">
      {isChild && (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/">{t("Home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>{t("options")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <HeaderText className={"w-full "} text={t("Options List")} />
      {isFilterMenu && (
        <Card className="w-full">
          <CardHeader>
            <CardDescription>{t("Filter By")}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-start flex-wrap w-full gap-2">


            <div className="flex flex-col md:flex-row items-center gap-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();

       
                    setDebouncedSearchValue(search);
                  
                }}
                className="relative"
              >
                <Input
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder={`Search by ${searchBy?.replace(
                    /[_\s]/g,
                    " "
                  )}...`}
                  disabled={isLoading}
                  className={"w-[300px]"}
                  value={search}
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
              <Select
                onValueChange={setSearchBy}
                defaultValue={searchBy}
                value={searchBy}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder={t("Search By")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("Option Field")}</SelectLabel>


                    <SelectItem
                      value={"product_option_value_id"}
                      className="capitalize"
                    >
                      {t("Option Id")}
                    </SelectItem>
                    
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="flex justify-between items-center w-full px-2  py-2 space-x-2">
             <div className="flex items-center space-x-2">

      <Can permissions={["app_api.add_ocoptionvalue"]}>
              <Button
                onClick={handleAddNew}
                className="flex items-center gap-1 hover:bg-[#2fad4f] bg-[#2fad4f]"
              >
                {/* Medium screen and above */}
                <span className="hidden md:block">
                  <Plus size={18} />
                </span>
                {/* Small screen */}
                <span className="md:hidden">
                  <Plus size={14} />
                </span>
                {t("Add")}
              </Button>
            </Can>
        <Button   disabled={csvDownload} onClick={exportCsvHandler}>
          {csvDownload ? (
            <p className="flex justify-center items-center space-x-2">
              <Loader2 className=" h-5 w-5 animate-spin" />
              <span>{t("Please wait")}</span>
            </p>
          ) : (
            <div className="flex items-center gap-2">
                  {/* Medium screen and above */}
                  <span className="hidden md:block">
                    <Upload size={16} />
                  </span>
                  {/* Small screen */}
                  <span className="md:hidden">
                    <Upload size={12} />
                  </span>
                  <span>

                  {t("Export")}
                  </span>
                </div>
          )}
        </Button>
             </div>
        <div className="flex items-center space-x-2">
        <CustomsItemsPerPage setItemPerPage={setItemPerPage} itemPerPage={itemPerPage}/>
          <Button
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
          )}
        </div>
      </Card>

      <WrapperComponent
        isEmpty={!options?.data?.results?.length > 0}
        isError={isError}
        error={error}
        isLoading={isLoading}
        loadingUI={<DataTableSkeleton columnCount={5} />}
        emptyStateMessage={
          isFilter
            ? t("You don't have any options by this filter")
            : t("You don't have any options")
        }
      >
        <DataTable
          canView={true}
         
          columns={columns}
          data={options?.data?.results?.map((order) => ({
            ...order
          }))}
        />
        <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
          <Pagination
            itemPerPage={itemPerPage}
            next={options?.data?.next}
            previous={options?.data?.previous}
            totalPages={totalPages}
            totalCount={options?.data?.count}
            page={page}
            setPage={setPage}
          />
        </Card>
      </WrapperComponent>
        <OptionDialog
          isDialogOpen={isOptionDialogOpen}
          setIsDialogOpen={setIsOptionDialogOpen}
          option={selectedOption}
          product_id={productId}
        />
      <OnDeleteDialog
        name={"Options"}
        heading={t("Are you absolutely sure?")}
        description={`${t("This action cannot be undone. This will permanently delete this")} "${selectedOption?.option}".`}
        url={PRODUCT_OPTIONS_URL}
        id={selectedOption?.product_option_value_id}
        isDialogOpen={isDeleteOptionDialogOpen}
        setIsDialogOpen={setIsDeleteOptionDialogOpen}
      />
    </Section>
  );
};

export default OptionsTab;
