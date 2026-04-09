import Section from "@/components/layout/Section"
import DataTable from "@/components/ui/DataTable"
import DataTableSkeleton from "@/components/data-table/data-table-skeleton"

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate"
import WrapperComponent from "@/components/layout/WrapperComponent"
import HeaderText from "@/components/layout/header-text"
import { useState } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link } from "react-router-dom"
import Pagination from "@/components/layout/Pagination"
import columns from "./components/columns"
import { CUSTOMER_MEMBERSHIP_URL, PRODUCTS_URL, USERS_URL } from "@/utils/constants/urls"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {  RotateCcw, Search } from "lucide-react"

import qs from "qs"

import { Input } from "@/components/ui/input"
import { displayBasicDate } from "@/utils/methods"
import { setActiveCustomerMembershipId } from "../users/store"
import { Button } from "@/components/ui/button"
import { setIsFilterMenu, setSearchBy, useCustomerMembershipStore } from "./store"
import CanSection from "@/components/CanSection"
import CustomerAutocomplete from "@/components/CustomerAutocomplete"
import CustomsItemsPerPage from "@/components/ui/customs-items-per-page"
import { useTranslation } from "react-i18next"
import FiltersSection from "@/components/filters-ui/FiltersSection"
import FiltersMenu from "@/components/filters-ui/FiltersMenu"
const CustomersMembership = ({ customer_id = null }) => {
  const axiosPrivate = useAxiosPrivate()
  const { sortBy, sortType, searchBy, isFilterMenu } = useCustomerMembershipStore()
  const [page, setPage] = useState(1)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState(null)
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState({
    filter_id: "",
    filter_name: "",
  });

  const [itemPerPage, setItemPerPage] = useState("25")
  const clearFilters = () => {
    setPage(1);
    setItemPerPage("25");

   
    setDebouncedSearchValue(null);
    setSearch(null);
    setIsFilterMenu(false);
    setSearchBy("coupon_code");
    setSelectedCustomer({
      filter_id: "",
      filter_name: "",
    })


  };
  const {t} = useTranslation()
  const [filters,setFilters] = useState([])

// const defaultsFilters = [
//   {
//     title: t("Product"),
//     type: "combobox",
//     key: "by_product",
//     value: null,
//     queryKey: "products",
//     endpoint: PRODUCTS_URL,
//     itemTitle: "model",
//     itemValue: "product_id",
//   },
//   {
//     title: t("Search Field"),
//     key: "search_by",
//     type: "select",
//     value: "quantity",
//     options: [
//       { label: t("Quantity"), value: "quantity" },
//       { label: t("Option"), value: "option" },
//     ],
//   },
//   {
//     title: t("Search"),
//     key: "search_value",
//     type: "text",
//     value: "",
//   },
// ];

const defaultsFilters = [
  {
    title: t("Customer"),
    key: "customer_id",
    type: "combobox",
    endpoint: USERS_URL,
    itemTitle: "first_name",
    itemValue: "id",
    value: null,
  },
];


const fetchCustomersMembership = async (page) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("page_size", itemPerPage);
  params.append(
    "ordering",
    sortBy ? `${sortType === "asc" ? "" : "-"}${sortBy}` : "-date_added"
  );

  if (filters?.length) {
    filters.forEach((filter) => {
      if (filter?.value === null || filter?.value === undefined) return;

      let valueToSend = filter.value;

      if (filter.type === "date" && valueToSend) {
        if (valueToSend?.from) params.append(`${filter.key}_after`, formatDate(valueToSend.from));
        if (valueToSend?.to) params.append(`${filter.key}_before`, formatDate(valueToSend.to));
        return;
      }

      if (filter.type === "text" || filter.type === "search") {
        params.append(searchBy || "name", valueToSend);
        return;
      }

      if (typeof valueToSend === "object") {
        valueToSend = valueToSend?.id ?? valueToSend?.value ?? null;
      }

      if (valueToSend === null || valueToSend === undefined) return;

      params.append(filter.key, valueToSend);
    });
  }

  // Local search & selected customer
  if (debouncedSearchValue) params.append(searchBy, debouncedSearchValue);
  if (selectedCustomer?.filter_id) params.append("customer_id", selectedCustomer.filter_id);

  try {
    const response = await axiosPrivate.get(`${CUSTOMER_MEMBERSHIP_URL}?${params.toString()}`);
    setActiveCustomerMembershipId(response?.data.results?.[0]?.id);
    return response;
  } catch (error) {
    setIsError(true);
    setError(error);
    return error;
  }
};


  // const fetchCustomersMembership = async (page, searchKeyObject = {}) => {
  //   try {
  //     const response = await axiosPrivate.get(
  //       `${CUSTOMER_MEMBERSHIP_URL}?page=${page}&page_size=${itemPerPage}`,
  //       {
  //         params: { ...searchKeyObject },
  //         paramsSerializer: (params) => qs.stringify(params, { encode: false }),
  //       }
  //     )

  //     setActiveCustomerMembershipId(response?.data.results?.[0]?.id)

  //      return response
  //     // ...
  //   } catch (error) {
  //     // Handle the error
  //     setIsError(true)
  //     setError(error)
  //     return error
  //   }
  // }

  const {
    data: customersMembership,
    
    isLoading,
   
  } = useQuery({
    queryKey: [
      "CustomersMembership",
      page,
      filters,
      debouncedSearchValue,
      itemPerPage,
      customer_id,
      sortBy,
      sortType,
      selectedCustomer,
    ],
    queryFn: () =>
      fetchCustomersMembership(page, {
        customer_id:
          selectedCustomer.filter_id ? selectedCustomer.filter_id :  customer_id,
          [searchBy]: debouncedSearchValue ? debouncedSearchValue : null,
        ordering: sortBy
          ? `${sortType === "asc" ? "" : "-"}${sortBy}`
          : "-date_added",
      }),
  })
  const totalPages = Math.ceil(customersMembership?.data?.count / itemPerPage) // Assuming 25 items per page

  const isFilter = debouncedSearchValue || selectedCustomer.filter_id  ? true : false;

 
  return (
    <CanSection permissions={["app_api.view_occustomermembership"]}>

    <Section className="space-y-8 h-fit items-start">
      {customer_id === null && (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/">{t("Home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("Membership")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <HeaderText className={"w-full text-start "} text={t("Membership")} />
      {/* {isFilterMenu && (
          <Card className="w-full">
            <CardHeader>
              <CardDescription>{t("Filter By")}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-start flex-wrap w-full gap-4">
        
              <CustomerAutocomplete 
               formFields={selectedCustomer}
               setFormFields={setSelectedCustomer}
               isFetchCategory={ false }
              />

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
                    type={searchBy === "current_reward_points" ? "number" : "text"}
                    placeholder={`${t("Search by")} ${searchBy?.replace(
                      /[_\s]/g,
                      " "
                    )}...`}
                    disabled={isLoading}
                    className={"w-[300px]"}
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
                    <SelectValue placeholder={t("Search By")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("Membership Fields")}</SelectLabel>
                      <SelectItem value={"coupon_code"} className="capitalize">
                      {t("Coupon Code")}
                      </SelectItem>
                      <SelectItem value={"current_reward_points"} className="capitalize">
                      {t("Reward Points")}
                      </SelectItem>
                      <SelectItem value={"current_membership"} className="capitalize">
                      {t("Current Membership")}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )} */}


      {customer_id === null && (
        <Card className="flex justify-end items-center w-full px-2  py-2 flex-wrap gap-4">
                     <FiltersSection
              setPage={setPage} 
              value={filters}
              onChange={setFilters}  
              isLoading={isLoading}
              isMenuOpen={isFilterMenu}
              searchQueryKey="name"
              setIsMenuOpen={setIsFilterMenu}
             />
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
          
        </Card>
      )}
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
        isEmpty={!customersMembership?.data?.results?.length > 0}
        isError={isError}
        error={error}
        isLoading={isLoading}
        loadingUI={<DataTableSkeleton columnCount={5} />}
      >
        <DataTable
          columns={columns}
          data={customersMembership?.data?.results?.map((customer) => ({
            customerId: customer.customer_id,
            customer_name: customer.customer_name,
            highestCombinedPoints: customer.highest_combined_points,
            numberTimesPointsTransferred:
              customer.number_times_points_transferred,
            currentRewardPoints: customer.current_reward_points,
            currentMembership: customer.current_membership,
            dateAdded: customer?.date_added
              ? displayBasicDate(customer?.date_added)
              : "/",
            pointsDateModified: customer?.date_modified
              ? displayBasicDate(customer?.date_modified)
              : "/",
          }))}
        />
        <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
          <Pagination
            itemPerPage={itemPerPage}
            next={customersMembership?.data?.next}
            previous={customersMembership?.data?.previous}
            totalPages={totalPages}
            totalCount={customersMembership?.data?.count}
            page={page}
            setPage={setPage}
          />
        </Card>
      </WrapperComponent>
    </Section>
    </CanSection>
  )
}

export default CustomersMembership
