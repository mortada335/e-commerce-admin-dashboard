

import DataTable from "@/components/ui/DataTable"
import DataTableSkeleton from "@/components/data-table/data-table-skeleton"

import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate"
import WrapperComponent from "@/components/layout/WrapperComponent"

import { useState } from "react"

import Pagination from "@/components/layout/Pagination"
import columns from "./components/columns"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {  RotateCcw, Search } from "lucide-react"

import qs from "qs"

import { Input } from "@/components/ui/input"
import { displayBasicDate } from "@/utils/methods"

import { Button } from "@/components/ui/button"
import { UserRecentProductsStore } from "./store"
import { USER_RECENT_PRODUCTS_URL } from "@/utils/constants/urls"
import ProductAutocomplete from "@/components/ProductAutocomplete"
const UserRecentProducts = ({ id  }) => {
  const axiosPrivate = useAxiosPrivate()
  const { sortBy, sortType } = UserRecentProductsStore()
  const [page, setPage] = useState(1)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState(false)

  const [model, setModel] = useState({ filter_name: "", filter_id: "" });

  const [itemPerPage, setItemPerPage] = useState("25")

  const clearFilters = () => {

    setPage(1);
    setItemPerPage("25");

 

    setModel({ filter_name: "", filter_id: "" });

  };
  const fetchUserRecentProducts = async (page, searchKeyObject = {}) => {
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
      id,
      sortBy,
      sortType,
    ],
    queryFn: () =>
      fetchUserRecentProducts(page, {
        user__id:
          id  ,
  
          product__model: model.filter_id !== null ? model.filter_name : null,
        ordering: sortBy
          ? `${sortType === "asc" ? "" : "-"}${sortBy}`
          : "-date_added",
      }),
  })
  const totalPages = Math.ceil(UserRecentProducts?.data?.count / itemPerPage) // Assuming 25 items per page

  const isFilter =

  model.filter_id 

    ? true
    : false;

  const handleMainProductImage = (images = []) => {
    const mainIndex = images.findIndex((item) => item.sort_order === 1);

    return images?.length > 0 ? images[mainIndex]?.image : "";
  };
  return (

    <Card className="flex flex-col justify-start items-center w-full h-full px-4 py-4 space-y-4">


  
    <Card className="flex justify-end items-center w-full px-2  py-2 flex-wrap gap-4">
      <Select onValueChange={setItemPerPage} defaultValue={itemPerPage}>
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="Select item per page" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Item per page</SelectLabel>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="15">15</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="flex items-center w-full md:w-[200px]">
                <ProductAutocomplete
                  formFields={model}
                  setFormFields={(val)=>{
                    setModel(val) 
                    setPage(1)}}
                  isFetchProduct={false}
                />
                </div>
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
                    <p className="text-xs">Clear Filters</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
      
    </Card>

  <WrapperComponent
    isEmpty={!UserRecentProducts?.data?.results?.length > 0}
    isError={isError}
    error={error}
    isLoading={isLoading}
    loadingUI={<DataTableSkeleton columnCount={5} />}
     emptyStateMessage="There is no products for this user"
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
        date_modified: history?.product.date_modified
          ? displayBasicDate(history?.product.date_modified)
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

    </Card>

  )
}

export default UserRecentProducts
