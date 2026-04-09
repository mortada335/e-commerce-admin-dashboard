import Section from "@/components/layout/Section";
import DataTable from "@/components/ui/DataTable";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
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
import { CATEGORIES_URL } from "@/utils/constants/urls";

import {
  setIsCategoryDialogOpen,
  setSelectedCategory,
  useCategoryStore,
  setIsChangeStatusCategoryDialogOpen,
  setIsDeleteCategoryDialogOpen,
  setIsFilterMenu,
  setSearchBy,
} from "./store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CategoryDialog from "./components/CategoryDialog";
import qs from "qs";

import { Loader2, Plus, RotateCcw, Search, Upload } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import OnChangeStatus from "@/components/Dialogs/OnChangeStatus";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { toast } from "@/components/ui/use-toast";

import CanSection from "@/components/CanSection";
import Can from "@/components/Can";
import OnDeleteDialog from "@/components/Dialogs/OnDelete";
import CategoryAutocomplete from "@/components/CategoryAutocomplete";
import CustomsItemsPerPage from "@/components/ui/customs-items-per-page";
import { exportToExcel } from "@/utils/methods";
import { useTranslation } from "react-i18next";
import FiltersSection from "@/components/filters-ui/FiltersSection";
import FiltersMenu from "@/components/filters-ui/FiltersMenu";


const Categories = ({ parentId = null }) => {
  // Category Stroe.
  const { isDeleteCategoryDialogOpen } = useCategoryStore();

  // Axios.
  const axiosPrivate = useAxiosPrivate();
  const {
    isChangeStatusCategoryDialogOpen,
    selectedCategory,
    sortBy,
    sortType,
    isFilterMenu,
    searchBy
  } = useCategoryStore();



  const [search, setSearch] = useState(null);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(null);
  const [onlyMainCategories, setOnlyMainCategories] = useState(false);
  const {t} = useTranslation()
  const [filters,setFilters]  =useState([])

  const [enabled, setEnabled] = useState(null);
  const [itemPerPage, setItemPerPage] = useState("25");
  const [page, setPage] = useState(1);
  const [selectedParent, setSelectedParent] = useState({
   
    filter_id: "",
    filter_name: "",

  });
  const [csvDownload, setCsvDownload] = useState(false);

  const clearFilters = () => {
    setPage(1);
    setItemPerPage("25");

    setOnlyMainCategories(null);
    setDebouncedSearchValue(null);
    setSearch(null);
    setIsFilterMenu(false);
    setSearchBy("name");
    setEnabled(null);
    setSelectedParent({
      filter_id: "",
      filter_name: "",
    })
  };

  // const GetAdminCategory = async (page) => {
  //   let searchKeyObject = {};
  //   const parent_id =
  //   parentId !== null ? parentId : selectedParent?.filter_id?selectedParent?.filter_id : onlyMainCategories ? 0 : null;
  //   searchKeyObject = Object.fromEntries(
  //     Object.entries({
  //       [searchBy]: debouncedSearchValue ? debouncedSearchValue : null,
  //       status: enabled,
  //       parent_id: parent_id,
  //       // eslint-disable-next-line no-unused-vars
  //       ordering: sortBy
  //         ? `${sortType === "asc" ? "" : "-"}${sortBy}`
  //         : "-date_added",
  //       // eslint-disable-next-line no-unused-vars
  //     }).filter(([_, value]) => value !== undefined && value !== null)
  //   );

  //   return axiosPrivate.get(
  //     `${CATEGORIES_URL}?page=${page}&page_size=${itemPerPage}`,
  //     {
  //       params: { ...searchKeyObject },
  //       paramsSerializer: (params) => qs.stringify(params, { encode: false }),
  //     }
  //   );
  // };

  const defaultsFilters = [
  {
    title: t("Category Status"),
    type: "select",
    key: "status",
    value: null,
    options: [
      { label: t("All Status"), value: null },
      { label: t("Enabled"), value: 1 },
      { label: t("Disabled"), value: 0 },
    ],
  },
  {
    title: t("Parent Category"),
    type: "combobox",
    key: "parent_id",
    value: null,
    queryKey: "categories",
    endpoint: CATEGORIES_URL,
    itemTitle: "category_id",
    itemValue: "category_id",
    extra: {
      onlyMainCategories: true,
      isFetchCategory: false,
    },
  },
  {
    title: t("Search By"),
    type: "select",
    key: "search_by",
    value: "name",
    options: [
      { label: t("Name"), value: "name" },
      // { label: t("Transparency"), value: "category_transparency" },
    ],
  },
];
const GetAdminCategory = async (page) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("page_size", itemPerPage);

  // Sorting
  params.append(
    "ordering",
    sortBy ? `${sortType === "asc" ? "" : "-"}${sortBy}` : "-date_added"
  );

  // Apply filters from defaultsFilters + any dynamic ones
  const allFilters = [...defaultsFilters, ...filters];

  allFilters.forEach((filter) => {
    let value = filter.value;

    // Skip empty values
    if (value === null || value === undefined || value === "") return;

    // Handle nested/complex values (combobox, autocomplete, etc.)
    if (typeof value === "object") {
      value =
        value?.id ??
        value?.category_id ??
        value?.product_id ??
        value?.filter_id ??
        null;
    }

    if (value === null || value === undefined) return;

    // Special case: search_by should modify the search field name
    if (filter.key === "search" && debouncedSearchValue) {
      params.append(searchBy || "name", debouncedSearchValue);
      return;
    }

    // Otherwise append directly
    params.append(filter.key, value);
  });

  // Parent logic fallback (if needed)
  const parent_id =
    parentId !== null
      ? parentId
      : selectedParent?.filter_id
      ? selectedParent?.filter_id
      : onlyMainCategories
      ? 0
      : null;

  if (parent_id !== null && parent_id !== undefined && parent_id !== "") {
    params.set("parent_id", parent_id);
  }

  return axiosPrivate.get(`${CATEGORIES_URL}?${params.toString()}`);
};


  const {
    data: categories,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "Categories",
      page,
      filters,
      debouncedSearchValue,
      onlyMainCategories,
      parentId,
      selectedParent,
      enabled,
      itemPerPage,
      sortBy,
      sortType,
    ],
    queryFn: () => GetAdminCategory(page),
  });

  // useEffect(() => {
  //   if (!isLoading && onlyMainCategories) {
  //     setMainCategories(categories?.data?.results);
  //   }
  // }, [categories, isLoading, onlyMainCategories]);

  const totalPages = Math.ceil(categories?.data?.count / itemPerPage); // Assuming 25 items per page

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsCategoryDialogOpen(true);
  };

  const isFilter = debouncedSearchValue || onlyMainCategories || selectedParent.filter_id || enabled!==null ? true : false;

  // Handler for exporting the users as a CSV file.
  const exportCsvHandler = async () => {
    // Set the state to indicate loading and disable the button.
    setCsvDownload(true);

    // // Initialize an object to store search params fro API request..
    // let searchKeyObject = {};

    // // Convert an object into an array of [key, value] pairs, filter it, then convert it back to an object.
    // const parent_id =
    //   parentId !== null ? parentId : selectedParent?.filter_id?selectedParent?.filter_id : onlyMainCategories ? 0 : null;
    // searchKeyObject = Object.fromEntries(
    //   Object.entries({
    //     name: debouncedSearchValue ? debouncedSearchValue : null,
    //     parent_id: parent_id,
    //     columns:
    //       "category_id,num_of_products,description,parent_category_name",
    //     // eslint-disable-next-line no-unused-vars
    //     ordering: sortBy
    //       ? `${sortType === "asc" ? "" : "-"}${sortBy}`
    //       : "-date_added",
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
      //   downloadCsv(response.data, undefined, "Categories.csv");
      // }


      if (categories.data?.results?.length) {

        const currentData = categories.data?.results?.map((category)=> { 

          return {
            

            id: category.category_id,
            english_name: category.description?.at(0)?.name,
            arabic_name: category.description?.at(1)?.name,
            english_description: category.description?.at(0)?.description,
            Arabic_description: category.description?.at(1)?.description,
            image: category.image,
            index: category.sort_order,
            num_of_products: category.num_of_products,
            color: category.category_color,
            transparency: category.category_transparency,
            status:category.status === 1 ? "Enabled" : "Disable",
            parent_id: category.parent_id,
            parents: category.parents,
            parent_category_name: category.parent_category_name?.at(0)?.name,
            
           
          }
        })

        // Reset the state and initiate the CSV file download.
        setCsvDownload(false);
        exportToExcel(currentData, "Categories.xlsx");
        
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
    <CanSection permissions={["app_api.view_occategory","app_api.change_occategory"]}>
      <Section className="space-y-8 h-fit items-start">
        {parentId === null && (
          <Breadcrumb >
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <Link to="/">{t("Home")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t("Categories")}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <HeaderText className={"w-full text-start "} text={ parentId ? t("Sub_categories") :  t("Categories")} />
        {/* {isFilterMenu && (
          <Card className="w-full rtl:flexrr">
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
                    <SelectLabel>{t("Category Status")}</SelectLabel>
                    <SelectItem value={null}>{t("All Status")}</SelectItem>
                    <SelectItem value={1}>{t("Enabled")}</SelectItem>
                    <SelectItem value={0}>{t("Disable")}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="w-fit">

              <CategoryAutocomplete
                      formFields={selectedParent}
                      setFormFields={setSelectedParent}
                      
                      onlyMainCategories={true}
                      
                      isFetchCategory={ false }
                      isDisabled={ onlyMainCategories }
                    />
              </div>


              <div className="flex items-center space-x-4 gap-5">
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
                    type={searchBy === "category_transparency" ? "number" : "text"}
                    placeholder={`${t("Search by")} ${searchBy?.replace(
                      /[_\s]/g,
                      " "
                    )}...`}
                    disabled={isLoading}
                    className={"w-[300px] rtl:flex-row-reverse"}
                  />
                  <Button
                    className="absolute  rtl:left-0 rtl:rounded-r-none rtl:rounded-l-md top-0 rounded-l-none rounded-r-md"
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
                      <SelectLabel>{t("Category Fields")}</SelectLabel>
                      <SelectItem value={"name"} className="capitalize">
                        {t("name")}
                      </SelectItem>
                      {/* <SelectItem value={"category_transparency"} className="capitalize">
                      Transparency
                      </SelectItem> 
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )} */}
  
        <Card
          className={cn(
            "flex justify-between items-center w-full px-2  py-2 flex-wrap gap-4",
            parentId !== null && "justify-end"
          )}
        > <FiltersSection
              setPage={setPage} 
              value={filters}
              onChange={setFilters}  
              isLoading={isLoading}
              isMenuOpen={isFilterMenu}
              searchQueryKey="name"
              setIsMenuOpen={setIsFilterMenu}
             />
          <div className="flex items-center space-x-2 gap-4">
            {/* {parentId === null && (
              <Can permissions={["app_api.add_occategory"]}>
                <Button
                  onClick={handleAddCategory}
                  className="flex items-center  gap-1"
                >
                  <span className="hidden md:block">
                    <Plus size={18} />
                  </span>
                  <span className="md:hidden">
                    <Plus size={14} />
                  </span>
                  {t("Add New Category")}
                </Button>
              </Can>
            )} */}

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
                  {/* Medium screen and above */}
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

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex rtl:flex-row-reverse items-center space-x-2 group">
              <Switch
                id="#OnlyMainCategories"
                checked={onlyMainCategories}
                onCheckedChange={(val)=> {
                  setSelectedParent({
                    filter_id: "",
                    filter_name: "",
                  })
                  setOnlyMainCategories(val)
                  setPage(1)
                }}
              />
              <Label
                htmlFor="#OnlyMainCategories"
                className={cn(
                  "text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition",
                  onlyMainCategories && "text-slate-900 dark:text-slate-200"
                )}
              >
                {t("Only main categories")}
              </Label>
            </div>
            <CustomsItemsPerPage setItemPerPage={setItemPerPage} itemPerPage={itemPerPage}/>
            {/* <Button]
              variant={isFilterMenu ? "default" : "outline"}
              onClick={() => {
                setIsFilterMenu(!isFilterMenu);
              }}
            >
              {t("Filter Menu")}
            </Button> */}
            {/* {isFilter && (
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
          isEmpty={!categories?.data?.results?.length > 0}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={<DataTableSkeleton columnCount={5} />}
          emptyStateMessage={
            isFilter
              ? t("You don't have any categories by this filter")
              : t("You don't have any categories get started by creating a new one.")
          }
        >
          <DataTable
            isDraggableTable={false}
            canView={true}
            to={"/catalog/categories/details/"}
            columns={columns}
            data={categories?.data?.results?.map((category) => ({
              id: category.category_id,
              nameEnglish: category.description?.at(0)?.name,
              nameArabic: category.description?.at(1)?.name,
              descriptionEnglish: category.description?.at(0)?.description,
              descriptionArabic: category.description?.at(1)?.description,
              image: category.image,
              sortOrder: category.sort_order,
              num_of_products: category.num_of_products,
              color: category.category_color,
              transparency: category.category_transparency,
              status: category.status,
              parent_id: category.parent_id,
              parents: category.parents,
              parent_category_name: category.parent_category_name,
              actions: category.category_id,
            }))}
          />
          <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
            <Pagination
              itemPerPage={itemPerPage}
              next={categories?.data?.next}
              previous={categories?.data?.previous}
              totalPages={totalPages}
              totalCount={categories?.data?.count}
              page={page}
              setPage={setPage}
            />
          </Card>
        </WrapperComponent>
        <CategoryDialog />

        <OnChangeStatus
          name={"Categories"}
          heading={t("Are you absolutely sure?")}
          description={`${t("This action will")} ${
            selectedCategory?.status === 1 ? "Disable" : "Enabled"
          }  "${selectedCategory?.nameEnglish}".`}
          url={CATEGORIES_URL}
          id={`${selectedCategory?.id}/`}
          isDialogOpen={isChangeStatusCategoryDialogOpen}
          setIsDialogOpen={setIsChangeStatusCategoryDialogOpen}
          headers={{
            "Content-Type": "multipart/form-data",
          }}
          data={{
            parent_id: selectedCategory?.parent_id
              ? selectedCategory?.parent_id
              : 0,
            status: selectedCategory?.status === 1 ? 0 : 1,
          }}
        />
        <OnDeleteDialog
          name={"Categories"}
          heading={t("Are you absolutely sure?")}
          description={`${t("This action cannot be undone. This will permanently delete this")}  "${selectedCategory?.nameEnglish}".`}
          url={CATEGORIES_URL}
          id={selectedCategory?.id}
          isDialogOpen={isDeleteCategoryDialogOpen}
          setIsDialogOpen={setIsDeleteCategoryDialogOpen}
        />
      </Section>
    </CanSection>
  );
};

export default Categories;
