

import DataTable from "@/components/ui/DataTable"
import DataTableSkeleton from "@/components/data-table/data-table-skeleton"

import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate"
import WrapperComponent from "@/components/layout/WrapperComponent"

import { useState } from "react"
import { toast } from "@/components/ui/use-toast";
import Pagination from "@/components/layout/Pagination"
import columns from "./components/columns"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {  Loader2, RotateCcw, Upload } from "lucide-react"

import qs from "qs"


import { convertProductStatusIdToString, displayBasicDate, exportToExcel } from "@/utils/methods"

import { Button } from "@/components/ui/button"
import { UserRecentProductsStore } from "./store"
import { USER_RECENT_PRODUCTS_URL } from "@/utils/constants/urls"
import ProductAutocomplete from "@/components/ProductAutocomplete"
import HeaderText from "@/components/layout/header-text"
import Section from "@/components/layout/Section"
import { Link } from "react-router-dom"
import CustomerAutocomplete from "@/components/CustomerAutocomplete"

import CustomsItemsPerPage from "@/components/ui/customs-items-per-page"
import { useTranslation } from "react-i18next"
const UserRecentProducts = ({ userId=null  }) => {
  const axiosPrivate = useAxiosPrivate()
  const { sortBy, sortType } = UserRecentProductsStore()
  const [page, setPage] = useState(1)
  const {t} = useTranslation()
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState(false)
  // CSV download State
  const [csvDownload, setCsvDownload] = useState(null);

  const [model, setModel] = useState({ filter_name: "", filter_id: "" });

  const [itemPerPage, setItemPerPage] = useState("25")

  const [selectedCustomer, setSelectedCustomer] = useState({
    filter_id: "",
    filter_name: "",
  });

  const clearFilters = () => {

    setPage(1);
    setItemPerPage("25");

    setSelectedCustomer({
      filter_id: "",
      filter_name: "",
    })

 

    setModel({ filter_name: "", filter_id: "" });

  };
  const fetchUserRecentProducts = async (page) => {

    let searchKeyObject = {};

    searchKeyObject = Object.fromEntries(
      Object.entries({ user__id:userId?userId:selectedCustomer.filter_id !== null ? selectedCustomer.filter_id  : null,
        product__model: model.filter_id !== null ? model.filter_name : null,
        ordering: sortBy
          ? `${sortType === "asc" ? "" : "-"}${sortBy}`
          : "-date_added",}).filter(
        // eslint-disable-next-line no-unused-vars
        ([_, value]) => value !== "" && value !== undefined && value !== null
      )
    )
    try {
      return axiosPrivate.get(
        `${USER_RECENT_PRODUCTS_URL}?page=${page}&page_size=${itemPerPage}`,
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
    data: UserRecentProducts,
    
    isLoading,
   
  } = useQuery({
    queryKey: [
      "UserRecentProducts",
      page,
      model,
      itemPerPage,
      userId,
      sortBy,
      sortType,
      selectedCustomer
    ],
    queryFn: () =>
      fetchUserRecentProducts(page),
  })
  const totalPages = Math.ceil(UserRecentProducts?.data?.count / itemPerPage) // Assuming 25 items per page

  const isFilter =

  model.filter_id || selectedCustomer.filter_id 

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
      if (UserRecentProducts.data?.results?.length) {

        const currentData = UserRecentProducts.data?.results?.map((item)=> { 

          return {
            user:item?.user,
            product_id:item?.product?.product_id,
            model:item?.product?.model,
            quantity_available: item?.product?.available_quantity,
            price: item?.product?.price,
            status: item?.product?.enabled ? "Enabled" : "Disable",
            label:convertProductStatusIdToString(item?.product?.status),
            new_item:  item?.product?.new_item ? "Yes" : "No",
            viewed_at : item?.viewed_at
          }
        })


        // Reset the state and initiate the CSV file download.
        setCsvDownload(false);
        exportToExcel(currentData, "User Recent Products.xlsx");
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
          <BreadcrumbPage>{t("Users Recent Products")}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <HeaderText className={"w-full text-start "} text={t("Users Recent Products")} />
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

          {
         userId === null && <CustomerAutocomplete 
               formFields={selectedCustomer}
               setFormFields={setSelectedCustomer}
               isFetchCategory={ false }
              />
              }
      <div className="flex items-center w-[200px]">
                <ProductAutocomplete
                  formFields={model}
                  setFormFields={(val)=>{
                    setModel(val) 
                    setPage(1)}}
                  isFetchProduct={false}
                />
                </div>
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
    isEmpty={!UserRecentProducts?.data?.results?.length > 0}
    isError={isError}
    error={error}
    isLoading={isLoading}
    loadingUI={<DataTableSkeleton columnCount={5} />}
     emptyStateMessage={t("There is no products for this user")}
  >
    <DataTable
      columns={columns}
      data={UserRecentProducts?.data?.results?.map((history) => ({
        productData: history?.product,
        id: history?.product.product_id,
        product: history?.product?.image || '',
        model: history?.product.model,
        quantity_avilable: history?.product.available_quantity,
        price: history?.product.price,
        enabled: history?.product.enabled,
        status: history?.product.status,
        new_product: history?.product.new_product,
        viewed_at: history?.viewed_at
          ? displayBasicDate(history?.viewed_at)
          : "",
        date_added: history?.product.date_added
          ? displayBasicDate(history?.product.date_added)
          : "",
        
      
      }))}
    />
    <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
      <Pagination
        itemPerPage={itemPerPage}
        next={UserRecentProducts?.data?.next}
        previous={UserRecentProducts?.data?.previous}
        totalPages={totalPages}
        totalCount={UserRecentProducts?.data?.count}
        page={page}
        setPage={setPage}
      />
    </Card>
  </WrapperComponent>

    </Section>

  )
}

export default UserRecentProducts
