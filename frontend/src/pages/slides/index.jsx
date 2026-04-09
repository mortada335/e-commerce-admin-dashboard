import Section from "@/components/layout/Section"
import DataTable from "@/components/ui/DataTable"
import DataTableSkeleton from "@/components/data-table/data-table-skeleton"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate"
import WrapperComponent from "@/components/layout/WrapperComponent"
import HeaderText from "@/components/layout/header-text"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import qs from "qs"
import { Link } from "react-router-dom"
import Pagination from "@/components/layout/Pagination"
import columns from "./components/columns"
import {  SLIDE_URL } from "@/utils/constants/urls"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CalendarIcon, ChevronDown, RotateCcw, Search, X } from "lucide-react"
import BannerDialog from "./components/BannerDialog"
import OnDeleteDialog from "@/components/Dialogs/OnDelete"
import {
  ClearFilters,
  setBannerType,
  setDebouncedSearchValue,
  setEventDate,
  setIsBannerDialogOpen,
  setIsDeleteDialogOpen,
  setIsFilterMenu,
  setItemPerPage,
  setPage,
  setSearch,
  setSearchBy,
  setSelectedBanner,
  useBannerStore,
} from "./store"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import Text from "@/components/layout/text"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { formatDate } from "@/utils/methods"
import CustomsItemsPerPage from "@/components/ui/customs-items-per-page"
const Slides = () => {
  const axiosPrivate = useAxiosPrivate()
  const { isDeleteBannerDialogOpen, selectedBanner, sortBy, sortType ,
    searchBy,
    search,
    debouncedSearchValue,
    itemPerPage,
    page,
    isFilterMenu,
    eventDate,
    bannerType
  } =
    useBannerStore()

  const fetchAdminBanners = async (page) => {
    let searchKeyObject = {}

    searchKeyObject = Object.fromEntries(
      Object.entries({
        [searchBy]: debouncedSearchValue,
        banner_type: bannerType,
        event_date: eventDate ? eventDate : null,
        ordering: sortBy
          ? `${sortType === "asc" ? "" : "-"}${sortBy}`
          : "-date_added",
        // eslint-disable-next-line no-unused-vars
      }).filter(([_, value]) => value !== undefined && value !== null)
    )
    return axiosPrivate.get(
      `${SLIDE_URL}?page=${page}&page_size=${itemPerPage}`,
      {
        params: { ...searchKeyObject },
        paramsSerializer: (params) => qs.stringify(params, { encode: false }),
      }
    )
  }

  const {
    data: banners,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "Slides",
      page,
      itemPerPage,
      bannerType,
      debouncedSearchValue,
      eventDate,
      sortBy,
      sortType,
    ],
    queryFn: () => fetchAdminBanners(page),
  })
  const totalPages = Math.ceil(banners?.data?.count / itemPerPage) // Assuming 25 items per page

  const handleAddBanner = () => {
    setSelectedBanner(null)
    setIsBannerDialogOpen(true)
  }

  const isFilter=    debouncedSearchValue ||
  bannerType ||
  eventDate ?true:false
 
 

  return (
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
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1">
                Design
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                    <Link to="/design/banners">Banners</Link>
                  </DropdownMenuItem>
                <DropdownMenuItem disabled={true}>Slides</DropdownMenuItem>
              </DropdownMenuContent>

            </DropdownMenu>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Slides</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <HeaderText className={"w-full text-start "} text={"Slides"} />
      {isFilterMenu && (
        <Card className="w-full">
          <CardHeader>
            <CardDescription>Filter By</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-start flex-wrap w-full gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Card className="flex justify-between items-center space-y-0 space-x-0">
                  <Button
                    variant={"ghost"}
                    className={cn(
                      " w-fit text-left !text-xs font-normal rounded-none flex justify-start items-center",
                      !eventDate && "text-muted-foreground w-[150px]"
                    )}
                  >
                    {eventDate ? (
                      formatDate(eventDate)
                    ) : (
                      <>
                        Event Date
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </>
                    )}
                  </Button>
                  {eventDate && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {" "}
                          <Button
                            variant={"ghost"}
                            size="icon"
                            className="rounded-none"
                            onClick={() => {
                              setEventDate(null)
                            }}
                          >
                            <X className=" h-4 w-4 opacity-50" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <Text text={"Clear"} />
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Card>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={eventDate}
                  onSelect={(value) => {
                    setEventDate(value)
                  }}
                  disabled={(date) => date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Select onValueChange={setBannerType} defaultValue={bannerType} value={bannerType}>
              <SelectTrigger className="w-[120px]">
                <SelectValue
                  className="!text-xs"
                  placeholder="Select Banner Type"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="!text-xs">Banner Type</SelectLabel>
                  <SelectItem className="!text-xs" value={null}>
                    All Status
                  </SelectItem>
       
                  <SelectItem className="!text-xs" value={"product"}>
                    Product
                  </SelectItem>
                  <SelectItem className="!text-xs" value={"category"}>
                    Category
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setDebouncedSearchValue(search)
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
              <Select onValueChange={setSearchBy} defaultValue={searchBy} value={searchBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Search By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Slide Field</SelectLabel>
                    <SelectItem value={"title"} className="capitalize">
                      Title
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
      <Card className="flex justify-between items-center w-full px-2  py-2">
        <Button onClick={handleAddBanner}>Add New Slide</Button>
        <div className="flex justify-end items-center space-x-2">
        <CustomsItemsPerPage setItemPerPage={setItemPerPage} itemPerPage={itemPerPage}/>

          <Button
            variant={isFilterMenu ? "default" : "outline"}
            onClick={() => {
              setIsFilterMenu(!isFilterMenu)
            }}
          >
            Filter Menu
          </Button>
          {isFilter&& <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button  onClick={ClearFilters}  size="icon" variant={"outline"} ><RotateCcw size={16} /></Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Clear Filters</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>}


        </div>
      </Card>

      <WrapperComponent
        isEmpty={!banners?.data?.results?.length > 0}
        isError={isError}
        error={error}
        isLoading={isLoading}
        loadingUI={<DataTableSkeleton columnCount={5} />}
        emptyStateMessage={
          isFilter
            ? "You don't have any slides by this filter"
            : "You don't have any slides get started by creating a new one."
        }
      >
        {/* {banners?.data?.results?.length > 0 && (
          <> */}
        <DataTable
          columns={columns}
          data={banners?.data?.results?.map((banner) => ({
            banner_image_id: banner.slide_id,
            
            englishImage: banner.titles?.find(
              (item) => item.language
              === "1"
            )?.image,
            englishTitle: banner.titles?.find(
              (item) => item.language
              === "1"
            )?.title,
            arabicTitle: banner.titles?.find(
              (item) => item.language
              === "2"
            )?.title,
            arabicImage: banner.titles?.find(
              (item) => item.language
              === "2"
            )?.image,
          
            sort_order: banner.sort_order,
            banner_type: banner.banner_type,
            banner_type_id:banner.banner_type_id,
            event_date:banner.event_date,
            event_title:banner.event_title,
            link:banner.link,


            actions: "actions",
          }))}
        />
        <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
          <Pagination
            itemPerPage={itemPerPage}
            next={banners?.data?.next}
            previous={banners?.data?.previous}
            totalCount={banners?.data?.count}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
          />
        </Card>
        {/* </>
        )} */}
      </WrapperComponent>
      <BannerDialog />
      <OnDeleteDialog
        name={"Slides"}
        heading={"Are you absolutely sure?"}
        description={`This action cannot be undone. This will permanently delete this  "${selectedBanner?.arabicTitle}".`}
        url={SLIDE_URL}
        id={selectedBanner?.banner_image_id}
        isDialogOpen={isDeleteBannerDialogOpen}
        setIsDialogOpen={setIsDeleteDialogOpen}
      />
    </Section>
  )
}

export default Slides
