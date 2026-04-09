
import Section from "@/components/layout/Section"
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {  Search } from "lucide-react"

import qs from "qs"

import { Input } from "@/components/ui/input"
import { displayBasicDate } from "@/utils/methods"

import { Button } from "@/components/ui/button"
import { useUserSearchHistoryStore } from "./store"
import { USER_SEARCH_HISTORY_URL } from "@/utils/constants/urls"
const UserSearchHistory = ({ id  }) => {
  const axiosPrivate = useAxiosPrivate()
  const { sortBy, sortType } = useUserSearchHistoryStore()
  const [page, setPage] = useState(1)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState(null)
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(null)

  const [itemPerPage, setItemPerPage] = useState("25")
  const fetchUserSearchHistory = async (page, searchKeyObject = {}) => {
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
      id,
      sortBy,
      sortType,
    ],
    queryFn: () =>
      fetchUserSearchHistory(page, {
        user__id:id,
        search_param:
          debouncedSearchValue  ,
        ordering: sortBy
          ? `${sortType === "asc" ? "" : "-"}${sortBy}`
          : "-date_added",
      }),
  })
  const totalPages = Math.ceil(UserSearchHistory?.data?.count / itemPerPage) // Assuming 25 items per page
 
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
          placeholder="Search..."
          disabled={isLoading}
          className={"w-fit"}
        />
        <Button
          className="absolute right-0 top-0 rounded-l-none rounded-r-md"
          variant="ghost"
          size={"icon"}
          type="submit"
        >
          <Search size={16} />
        </Button>
      </form>
    </Card>

  <WrapperComponent
    isEmpty={!UserSearchHistory?.data?.results?.length > 0}
    isError={isError}
    error={error}
    isLoading={isLoading}
    loadingUI={<DataTableSkeleton columnCount={5} />}
     emptyStateMessage="There is no history for this user"
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

    </Card>

  )
}

export default UserSearchHistory
