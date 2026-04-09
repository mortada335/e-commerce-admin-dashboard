

import DataTable from "@/components/ui/DataTable"
import DataTableSkeleton from "@/components/data-table/data-table-skeleton"

import { Card, } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate"
import WrapperComponent from "@/components/layout/WrapperComponent"

import { useState } from "react"
import { toast } from "@/components/ui/use-toast";
import Pagination from "@/components/layout/Pagination"
import columns from "../components/columns"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {   Upload } from "lucide-react"




import { customFormatDate, exportToExcel, formatNumberWithCurrency } from "@/utils/methods"

import { Button } from "@/components/ui/button"
import {  setIsFilterMenu,  useWalletTransactionsStore } from "../store"
import { ADMIN_WALLET_TRANSACTIONS_URL } from "@/utils/constants/urls"

import Section from "@/components/layout/Section"
import { Link } from "react-router-dom"


import CustomsItemsPerPage from "@/components/ui/customs-items-per-page"
import ColumnsMenu from "@/components/data-table/ColumnsMenu"

import { useEffect } from "react"
import FiltersSection from "@/components/filters-ui/FiltersSection"
import FiltersMenu from "@/components/filters-ui/FiltersMenu"
import { useTranslation } from "react-i18next"
const WalletTransactionData = ({ userId=null  }) => {
  const axiosPrivate = useAxiosPrivate()
  const { 
    sortBy, sortType,

    isFilterMenu,


   } = useWalletTransactionsStore()

   
  const [page, setPage] = useState(1)
  const {t} = useTranslation()

const [filters, setFilters] = useState([]);


  const [itemPerPage, setItemPerPage] = useState("25")

   const defaultsFilters = userId? [
       { 
      title:'payment_status',
      type:'select',
      key:'payment_status',
      value:null,
      options:[
        {label:"Pending",value:"pending"},
        {label:"Started",value:"started"},
        {label:"Completed",value:"completed"},
        {label:"Failed",value:"failed"},
      ]
    },
   
    ]:[
 {
    title:"User Id",
    type:"text",
    key:"user_id",
    value:null
    },
    { 
      title:'payment_status',
      type:'select',
      key:'payment_status',
      value:null,
      options:[
        {label:"Pending",value:"pending"},
        {label:"Started",value:"started"},
        {label:"Completed",value:"completed"},
        {label:"Failed",value:"failed"},
      ]
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
  

  // Set initial visibility: true for visible columns, false for hidden ones
  const [columnVisibility, setColumnVisibility] = useState({
    user: true,
    amount_iqd: JSON.parse(localStorage.getItem("amount_iqd")) ?? true,
    payment_status: JSON.parse(localStorage.getItem("payment_status")) ?? true,
    completed_at: JSON.parse(localStorage.getItem("completed_at")) ?? true,
    created_at: JSON.parse(localStorage.getItem("created_at")) ?? true,
    actions: true,
  });

  const getData = async () => {
    // Create a new URLSearchParams object
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", itemPerPage);
    if (userId) {
      
      params.append("user_id", userId);
    }

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


    return axiosPrivate.get(`${ADMIN_WALLET_TRANSACTIONS_URL}?${params.toString()}`);
  };
  const {
    data: WalletTransaction,
    error,
    isError,
    isLoading,
   
  } = useQuery({
    queryKey: [
      "WalletTransactions",
      page,
 
      itemPerPage,
      userId,
      sortBy,
      sortType,

    ],
    queryFn: getData,
  })
  const totalPages = Math.ceil(WalletTransaction?.data?.count / itemPerPage) // Assuming 25 items per page



  // Handler for exporting the orders list as a CSV file.
  const exportCsvHandler = async () => {
    // Set the state to indicate loading and disable the button.


    try {

      if (WalletTransaction.data?.results?.length) {

        const currentData = WalletTransaction.data?.results?.map((item)=> { 

          return {
            user:item?.user,
            amount_iqd:formatNumberWithCurrency(item?.amount_iqd,'IQD'),
            payment_status: item?.payment_status,
            completed_at: customFormatDate(item?.completed_at,true),
            created_at: customFormatDate(item?.created_at,true),
          
            
          }
        })


     
        exportToExcel(currentData, "Users WalletTransactions.xlsx");

      }
    } catch (error) {
      // Reset the state and notify the user about the error.

      toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };


    const disabledColumnVisibility = (column) =>{

    if (column) {
      
      return  column?.accessorKey!=='user' 
    }else{
      return true
    }


  }


  return (

    <Section className="gap-6 h-fit items-start">



  
    <Card className="flex justify-between items-center w-full px-2  py-2 flex-wrap gap-4">
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
          <BreadcrumbPage>{t("Wallet Transactions")}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  
        </>
      }

           <FiltersSection
            setPage={setPage} 
            value={filters} 
            onChange={setFilters}  
            isLoading={isLoading}
              isMenuOpen={isFilterMenu}
              searchQueryKey="search"
            setIsMenuOpen={setIsFilterMenu}
         />

          <div className="flex flex-wrap justify-end items-start gap-4">
    <Button  onClick={exportCsvHandler}>
           
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
   
          </Button>
                <ColumnsMenu columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} disabledColumnVisibility={disabledColumnVisibility}/>
                <CustomsItemsPerPage setItemPerPage={setItemPerPage} itemPerPage={itemPerPage}/>

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
    isEmpty={!WalletTransaction?.data?.results?.length > 0}
    isError={isError}
    error={error}
    isLoading={isLoading}
    loadingUI={<DataTableSkeleton columnCount={5} />}
     emptyStateMessage={
            isFilter
              ? t("You don't have any wallet transaction by this filter")
              : t("You don't have any wallet transaction get started by creating a new one.")
          }
  >
    <DataTable
      columns={columns}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
      data={WalletTransaction?.data?.results?.map((WalletTransaction) => (
       {...WalletTransaction}
      ))}
    />
    <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
      <Pagination
        itemPerPage={itemPerPage}
        next={WalletTransaction?.data?.next}
        previous={WalletTransaction?.data?.previous}
        totalPages={totalPages}
        totalCount={WalletTransaction?.data?.count}
        page={page}
        setPage={setPage}
      />
    </Card>

  </WrapperComponent>
  

    </Section>

  )
}

export default WalletTransactionData
