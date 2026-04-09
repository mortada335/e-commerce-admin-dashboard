
import Section from "@/components/layout/Section"
import DataTable from "@/components/ui/DataTable"
import DataTableSkeleton from "@/components/data-table/data-table-skeleton"

import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate"
import WrapperComponent from "@/components/layout/WrapperComponent"
import { toast } from "@/components/ui/use-toast";
import { useState } from "react"

import Pagination from "@/components/layout/Pagination"
import columns from "./components/columns"


import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {  Loader2, RotateCcw, Search, Upload } from "lucide-react"

import qs from "qs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input"
import { displayBasicDate, exportToExcel } from "@/utils/methods"

import { Button } from "@/components/ui/button"
import { useUserSearchHistoryStore } from "./store"
import { USER_SEARCH_HISTORY_URL } from "@/utils/constants/urls"
import { Link } from "react-router-dom"
import HeaderText from "@/components/layout/header-text"
import CustomerAutocomplete from "@/components/CustomerAutocomplete"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import CustomsItemsPerPage from "@/components/ui/customs-items-per-page"
import { useTranslation } from "react-i18next"
const UserSearchHistory = ({ userId=null  }) => {
  const axiosPrivate = useAxiosPrivate()
  const { sortBy, sortType } = useUserSearchHistoryStore()
  const [page, setPage] = useState(1)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState(null)
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(null)
  // CSV download State
  const [csvDownload, setCsvDownload] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState({
    filter_id: "",
    filter_name: "",
  });

  const [itemPerPage, setItemPerPage] = useState("25")
  const {t} =useTranslation()

  const clearFilters = () => {

    setPage(1);
    setItemPerPage("25");

    setSelectedCustomer({
      filter_id: "",
      filter_name: "",
    })

    setDebouncedSearchValue(null)
    setSearch(null)

 

    

  };

  const fetchUserSearchHistory = async (page) => {

    let searchKeyObject = {};

    searchKeyObject = Object.fromEntries(
      Object.entries({
        user__id:userId?userId:selectedCustomer.filter_id !== null ? selectedCustomer.filter_id  : null,
        search_param:
          debouncedSearchValue? debouncedSearchValue : null  ,
        ordering: sortBy
          ? `${sortType === "asc" ? "" : "-"}${sortBy}`
          : "-date_added",
      }).filter(
        // eslint-disable-next-line no-unused-vars
        ([_, value]) => value !== "" && value !== undefined && value !== null
      )
    )
    try {
      return axiosPrivate.get(
        `${USER_SEARCH_HISTORY_URL}?page=${page}&page_size=${itemPerPage}`,
        {
          params: { ...searchKeyObject },
          paramsSerializer: (params) => qs.stringify(params, { encode: false }),
        }
      )

     

      // ...
    } catch (error) {
      // Handle the error
      setIsError(true)
      setError(error)
      return error
    }
  }

  const {
    data: UserSearchHistory,
    
    isLoading,
   
  } = useQuery({
    queryKey: [
      "UserSearchHistory",
      page,
      debouncedSearchValue,
      itemPerPage,
      userId,
      sortBy,
      sortType,
    ],
    queryFn: () =>
      fetchUserSearchHistory(page),
  })
  const totalPages = Math.ceil(UserSearchHistory?.data?.count / itemPerPage) // Assuming 25 items per page

  const isFilter =

  debouncedSearchValue || selectedCustomer.filter_id 

    ? true
    : false;



      // Handler for exporting the orders list as a CSV file.
  const exportCsvHandler = async () => {
    // Set the state to indicate loading and disable the button.
    setCsvDownload(true);

    // Initialize an object to store search params fro API request..
    // let searchKeyObject = {};

    // Convert an object into an array of [key, value] pairs, filter it, then convert it back to an object.
    // searchKeyObject = Object.fromEntries(
    //   Object.entries({
    //     // Set search parameters based on various conditions.
    //     user__id:selectedCustomer.filter_id !== null ? selectedCustomer.filter_id  : userId,
    //     product__model: model.filter_id !== null ? model.filter_name : null,
    //     ordering: sortBy
    //       ? `${sortType === "asc" ? "" : "-"}${sortBy}`
    //       : "-date_added",
    //     // eslint-disable-next-line no-unused-vars
    //   }).filter(([_, value]) => value !== undefined && value !== null)
    // );

    // Try to fetch and handle the response data.

    try {
      // const response = await getExportedCsv(searchKeyObject, itemPerPage, page, USER_RECENT_PRODUCTS_URL);

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

      // Succesfull request and handle the data.
      if (UserSearchHistory.data?.results?.length) {



        // Reset the state and initiate the CSV file download.
        setCsvDownload(false);
        exportToExcel(UserSearchHistory.data?.results, "User Search History.xlsx");
        // downloadCsv(response.data, undefined, "Orders List.csv");
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

    <Section className="gap-6 h-fit items-start">
    {
      userId === null &&
      <>
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink>
          <Link to="/">{t("Home")}</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>{t("Users Search History")}</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
  <HeaderText className={"w-full text-start "} text={t("Users Search History")} />
      </>
    }

    <Card className="flex justify-between items-center w-full px-2  py-2 flex-wrap gap-4">
    <Button disabled={csvDownload} onClick={exportCsvHandler}>
            {csvDownload ? (
              <p className="flex justify-center items-center space-x-2">
                <Loader2 className=" h-5 w-5 animate-spin" />
                <span>{t("Please wait")}</span>
              </p>
            ) : (
              <p className="flex items-center gap-2">
                {/* Medium screen and above. */}
                <span className="hidden md:block">
                  <Upload size={16} />
                </span>
                {/* Small screen. */}
                <span className="md:hidden">
                  <Upload size={12} />
                </span>
                {t("Export")}
              </p>
            )}
          </Button>
          <div className="flex flex-wrap justify-end items-start gap-4">
      <CustomerAutocomplete 
               formFields={selectedCustomer}
               setFormFields={setSelectedCustomer}
               isFetchCategory={ false }
              />
       
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setDebouncedSearchValue(search)
          setPage(1)
        }}
        className="relative"
      >
        <Input
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder={t("Search")}
          disabled={isLoading}
          className={"w-fit"}
        />
        <Button
          className="absolute rtl:left-0 ltr:right-0 rtl:rounded-r-none rtl:rounded-l-md top-0 rounded-l-none rounded-r-md"
          variant="ghost"
          size={"icon"}
          type="submit"
        >
          <Search size={16} />
        </Button>
      </form>
      <CustomsItemsPerPage setItemPerPage={setItemPerPage} itemPerPage={itemPerPage}/>
      {isFilter && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => {
                        clearFilters();
                        
                      }}
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
    isEmpty={!UserSearchHistory?.data?.results?.length > 0}
    isError={isError}
    error={error}
    isLoading={isLoading}
    loadingUI={<DataTableSkeleton columnCount={5} />}
     emptyStateMessage={t("There is no history for this user")}
  >
    <DataTable
      columns={columns}
      data={UserSearchHistory?.data?.results?.map((history) => ({
        
        search_param: history.search_param,
        
        last_searched: history?.last_searched
          ? displayBasicDate(history?.last_searched)
          : "/",
      
      }))}
    />
    <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
      <Pagination
        itemPerPage={itemPerPage}
        next={UserSearchHistory?.data?.next}
        previous={UserSearchHistory?.data?.previous}
        totalPages={totalPages}
        totalCount={UserSearchHistory?.data?.count}
        page={page}
        setPage={setPage}
      />
    </Card>
  </WrapperComponent>

    </Section>

  )
}

export default UserSearchHistory
