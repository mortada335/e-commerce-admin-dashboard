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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import WrapperComponent from "@/components/layout/WrapperComponent";
import HeaderText from "@/components/layout/header-text";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "@/components/layout/Pagination";
import columns from "./components/columns";
import { BANNER_URL, CATEGORIES_URL, PRODUCTS_URL, WAREHOUSES_URL } from "@/utils/constants/urls";

import OnDeleteDialog from "@/components/Dialogs/OnDelete";
import {
  useProductStore,
  setIsDeleteProductDialogOpen,
  clearSelectedProducts,
  setSearchBy,
  setIsFilterMenu,
  setIsChangeStatusDialogOpen,
  setClearFilterBtn,
  setIsApplyRandomDiscountDialogOpen,
  setProductModel,
  setIsProductsBulkStatusUpdateDialogOpen,
  setIsProductsBulkPriceUpdateDialogOpen,
  setIsProductsBulkAssignCategoriesDialogOpen,
} from "./store";

import qs from "qs";

import {
  CalendarIcon,
  CirclePercent,
  FilePenLine,
  Loader2,
  Plus,
  RotateCcw,
  Search,
  Upload,
  X,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  convertProductStatusIdToString,
  convertProductStatusStringToId,
  displayBasicDate,
  exportToExcel,
  formatDate,
  formatNumberWithCurrency,
} from "@/utils/methods";
import ProductDialog from "./components/ProductDialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Text from "@/components/layout/text";
import { Calendar } from "@/components/ui/calendar";
import DuplicateProductDialog from "./components/DuplicateProductDialog";
import { DeleteAdminProduct } from "@/utils/apis/catalog/products/products";
import { useToast } from "@/components/ui/use-toast";
import ProductAutocomplete from "@/components/ProductAutocomplete";

import OnChangeStatus from "@/components/Dialogs/OnChangeStatus";
import CanSection from "@/components/CanSection";
import Can from "@/components/Can";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import CustomsItemsPerPage from "@/components/ui/customs-items-per-page";
import ApplyRandomDiscount from "./components/ApplyRandomDiscount";
import ColumnsMenu from "@/components/data-table/ColumnsMenu";
import ProductsBulkStatusUpdate from "./components/ProductsBulkStatusUpdate";
import ExportButton from "@/components/ui/export-button";
import ProductsBulkPriceUpdate from "./components/ProductsBulkPriceUpdate";
import ProductsBulkAssignCategories from "./components/ProductsBulkAssignCategories";
import CustomsCombobox from "@/components/ui/customs-combobox";
import { useTranslation } from "react-i18next";
import FiltersSection from "@/components/filters-ui/FiltersSection";
import FiltersMenu from "@/components/filters-ui/FiltersMenu";
// import { mkConfig, generateCsv, download } from "export-to-csv";

const Products = ({
  warehouseId = null,
  categoryId = null,
  manufacturerId = null,
}) => {
  const axiosPrivate = useAxiosPrivate();
  const {
    isDeleteProductDialogOpen,
    selectedProduct,
    selectedProducts,
    sortBy,
    sortType,
    searchBy,
    productModel,
    dateAdded,
    dateModified,
    isChangeStatus,
    isFilterMenu,
    clearFilterBtn,
  } = useProductStore();

  const queryClient = useQueryClient();
  const {t} = useTranslation()
  const { toast } = useToast();
  const [model, setModel] = useState({ filter_name: "", filter_id: "" });
  const [isDeleteSelected, setIsDeleteSelected] = useState(false);
  const [onlyNewProducts, setOnlyNewProducts] = useState(false);
  const [productsHaveOptions, setProductsHaveOptions] = useState(false);
  const [discountStartDate, setDiscountStartDate] = useState(null);
  const [discountExpiryDate, setDiscountExpiryDate] = useState(null);
  const [rangeDate, setRangeDate] = useState(null);
  const [modifiedRangeDate, setModifiedRangeDate] = useState(null);
  const [search, setSearch] = useState(null);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(null);
  const [warehouseFormFields, setWarehouseFormFields] = useState(null);
  const [csvDownload, setCsvDownload] = useState(null);

  const [status, setStatus] = useState(null);
  const [isEnable, setIsEnable] = useState(null);
  const [filters,setFilters] = useState([])

  const [itemPerPage, setItemPerPage] = useState("25");
  const [page, setPage] = useState(1);

  
  const defaultsFilters = [
  {
    key: "enabled",
    title: t("Product Status"),
    type: "select",
    value:null,
    options: [
      { label: t("Enabled"), value: "1" },
      { label: t("Disabled"), value: "0" },
    ],
  },
  // {
  //   title: t("Product Label"),
  //   key: "status",
  //   type: "select",
  //   options: [
  //     { label: t("All labels"), value: null },
  //     { label: t("New"), value: "NEW" },
  //     { label: t("Featured"), value: "FEATURED" },
  //     { label: t("Promoted"), value: "PROMOTED" },
  //     { label: t("Discount"), value: "DISCOUNT" },
  //     { label: t("None"), value: "NONE" },
  //   ],
  // },
  // {
  //   title: t("warehouse"),
  //   type: "combobox",
  //   key: "warehouse_id",
  //   endpoint: WAREHOUSES_URL,
  //   queryKey: "warehouses",
  //   itemTitle: "name",
  //   itemValue: "id",
  //   value:null
  // },
  {
    title: t("Added Date"),
    type: "date",
    key: "date_added",
    value:null
  },
  {
    title: t("Modified Date"),
    type: "date",
    key: "date_modified",
    value:null
  },
  {
    title: t("Discount Start Date"),
    type: "date",
    key: "discount_start_date",
    value:null
  },
  {
    title: t("Discount Expiry Date"),
    type: "date",
    key: "discount_expiry_date",
    value:null
  },
  {
    title: t("Products With Options"),
    type: "select",
    key: "have_options",
    options: [
      { label: t("yes"), value: "1" },
      { label: t("no"), value: "0" },
    ],
  },
    {
    title: t("model"),
    type: "text",
    key: "model",
    value: null,
  },
   {
    title: t("description"),
    type: "text",
    key: "description",
    value: null,
  },
  // {
  //   title: t("weight"),
  //   type: "text",
  //   key: "weight",
  //   value: null,
  // },
  // {
  //   title: t("width"),
  //   type: "text",
  //   key: "width",
  //   value: null,
  // },
  // {
  //   title: t("height"),
  //   type: "text",
  //   key: "height",
  //   value: null,
  // },
  // {
  //   title: t("length"),
  //   type: "text",
  //   key: "length",
  //   value: null,
  // },
  // {
  //   title: t("banner_image_id"),
  //   type: "combobox",
  //   key: "banner_image_id",
  //   endpoint: BANNER_URL,
  //   queryKey: "banners",
  //   value: null,
  // },
  {
    title: t("product_id"),
    type: "text",
    key: "product_id",
    value: null,
  },
];

  const clearFilters = () => {
    setDiscountExpiryDate(null);
    setDiscountStartDate(null);
    setStatus(null);
    setRangeDate(null);

    setIsFilterMenu(false);
    setPage(1);
    setItemPerPage("25");

    setDebouncedSearchValue(null);
    setSearch(null);
    setWarehouseFormFields(null);

    setProductModel({ filter_name: "", filter_id: "" });

    setSearchBy(t("available_quantity"));
  };

  // const GetAdminProduct = async (page) => {
  //   let searchKeyObject = {};

  //   const debouncedSearchValueLowercase = debouncedSearchValue
  //     ? debouncedSearchValue.toLowerCase()
  //     : null;

  //   searchKeyObject = Object.fromEntries(
  //     Object.entries({
  //       [searchBy]: debouncedSearchValueLowercase,
  //       model: productModel.filter_id !== null ? productModel.filter_name : null,

  //       status: status !== null ? convertProductStatusStringToId(status) : null,
  //       enabled: isEnable,
  //       date_added_before: rangeDate?.to ? formatDate(rangeDate?.to) : null,
  //       date_added_after: rangeDate?.from ? formatDate(rangeDate?.from) : null,
  //       date_modified_before: modifiedRangeDate?.to ? formatDate(modifiedRangeDate?.to) : null,
  //       date_modified_after: modifiedRangeDate?.from ? formatDate(modifiedRangeDate?.from) : null,
  //       // date_added_before: dateAdded ? formatDate(dateAdded) : null,
  //       // date_modified: dateModified ? dateModified : null,
  //       discount_start_date: discountStartDate ? discountStartDate : null,
  //       discount_expiry_date: discountExpiryDate ? discountExpiryDate : null,
  //       warehouse_id: warehouseId?warehouseId:warehouseFormFields?.id?warehouseFormFields?.id:null,
  //       category_id: categoryId,
  //       manufacturer_id: manufacturerId,
  //       new_product: onlyNewProducts ? onlyNewProducts : null,
  //       have_options: productsHaveOptions ? productsHaveOptions : null,
  //       ordering: sortBy
  //         ? `${sortType === "asc" ? "" : "-"}${sortBy}`
  //         : "-date_added",
  //       // eslint-disable-next-line no-unused-vars
  //     }).filter(([_, value]) => value !== undefined && value !== null)
  //   );
  //   return axiosPrivate.get(
  //     `${PRODUCTS_URL}?page=${page}&page_size=${itemPerPage}`,
  //     {
  //       params: { ...searchKeyObject },
  //       paramsSerializer: (params) => qs.stringify(params, { encode: false }),
  //     }
  //   );
  // };

  const GetAdminProduct = async () => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("page_size", itemPerPage);
  params.append(
    "ordering",
    sortBy ? `${sortType === "asc" ? "" : "-"}${sortBy}` : "-date_added"
  );

  if (filters?.length) {
    filters.forEach((filter) => {
      if (!filter?.value) return;

      let valueToSend = filter.value;

      // Handle date range filters
      if (filter.type === "daterange" && typeof valueToSend === "object") {
        if (valueToSend?.from)
          params.append(`${filter.key}_after`, formatDate(valueToSend.from));
        if (valueToSend?.to)
          params.append(`${filter.key}_before`, formatDate(valueToSend.to));
        return;
      }

      if (typeof valueToSend === "object") {
        valueToSend =
          valueToSend?.id ??
          valueToSend?.value ??
          valueToSend?.category_id ??
          valueToSend?.product_id ??
          null;
      }

      if (valueToSend === null || valueToSend === undefined) return;
      params.append(filter.key, valueToSend);
    });
  }
  if(warehouseId){
    params.append("warehouse_id", warehouseId)
  }
  if(categoryId){
    params.append("category_id", categoryId)
  }

  return axiosPrivate.get(`${PRODUCTS_URL}?${params.toString()}`);
};

  const {
    data: products,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "Products",
      page,
      filters,
      debouncedSearchValue,
      productModel,
      status,
      dateAdded,
      dateModified,
      discountStartDate,
      discountExpiryDate,
      itemPerPage,
      sortBy,
      sortType,
      rangeDate,
      modifiedRangeDate,
      onlyNewProducts,
      productsHaveOptions,
      isEnable,
      warehouseId,
      warehouseFormFields,
    ],
    queryFn: () => GetAdminProduct(page),
  });

  const totalPages = Math.ceil(products?.data?.count / itemPerPage); // Assuming 25 items per page
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate("/catalog/products/addProduct");
  };

  const handleApplyRandomDiscount = () => {
    setIsApplyRandomDiscountDialogOpen(true);
  };

  const handleProductsBulkAssignCategories = () => {
    setIsProductsBulkAssignCategoriesDialogOpen(true);
  };
  const handleProductsBulkStatusUpdate = () => {
    setIsProductsBulkStatusUpdateDialogOpen(true);
  };
  const handleProductsBulkPriceUpdate = () => {
    setIsProductsBulkPriceUpdateDialogOpen(true);
  };

  const handelDeleteMultipleProducts = async () => {
    try {
      setIsDeleteSelected(true);
      await Promise.allSettled(
        selectedProducts.map(async (item) => {
          await DeleteAdminProduct(item.id);
        })
      );
      clearSelectedProducts();
      queryClient.invalidateQueries({ queryKey: ["Products"] });

      toast({
        title: "Success!!!",
        description: "Deleted Successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "An unknown error occurred. Please try again later",
      });
      setIsDeleteSelected(false);
    } finally {
      setIsDeleteSelected(false);
    }
  };

  const isFilter =
    clearFilterBtn ||
    productModel.filter_id ||
    debouncedSearchValue ||
    warehouseFormFields ||
    discountStartDate ||
    discountExpiryDate ||
    rangeDate ||
    status
      ? true
      : false;

  const handleMainProductImage = (images = []) => {
    if (images?.length) {
      const mainIndex = images.findIndex((item) => item.sort_order === 0);

      return mainIndex !== -1
        ? images?.at(mainIndex)?.image
        : images?.at(0)?.image;
    } else {
      return "";
    }
  };

  const [columnVisibility, setColumnVisibility] = useState({
    id: true,
    product: JSON.parse(localStorage.getItem("product")) ?? true,
    model: JSON.parse(localStorage.getItem("model")) ?? true,
    quantity_avilable:
      JSON.parse(localStorage.getItem("quantity_avilable")) ?? true,
    price: JSON.parse(localStorage.getItem("price")) ?? true,
    discounted: JSON.parse(localStorage.getItem("discounted")) ?? true,
    enabled: JSON.parse(localStorage.getItem("enabled")) ?? true,
    status: JSON.parse(localStorage.getItem("status")) ?? true,
    new_product: JSON.parse(localStorage.getItem("new_product")) ?? true,

    date_added: JSON.parse(localStorage.getItem("date_added")) ?? true,
    date_modified: JSON.parse(localStorage.getItem("date_modified")) ?? true,
    discount_start_date:
      JSON.parse(localStorage.getItem("discount_start_date")) ?? true,
    discount_expiry_date:
      JSON.parse(localStorage.getItem("discount_expiry_date")) ?? true,

    actions: true,
  });

  const disabledColumnVisibility = (column) => {
    if (column) {
      return (
        column?.accessorKey !== "id" &&
        column?.accessorKey !== "model" &&
        column?.accessorKey !== "actions"
      );
    } else {
      return true;
    }
  };

  return (
    <CanSection permissions={["app_api.view_ocproduct"]}>
      <Section className="space-y-6 h-fit items-start">
        {warehouseId === null && categoryId === null && manufacturerId === null && (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <Link to="/">{t("Home")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t("Products")}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}

        <Card
          className={cn(
            "flex justify-between items-center w-full px-2  py-2 flex-wrap gap-4",
            warehouseId !== null || (manufacturerId !== null && "justify-end")
          )}
        >     <FiltersSection
              setPage={setPage} 
              value={filters}
              onChange={setFilters}  
              isLoading={isLoading}
              isMenuOpen={isFilterMenu}
              searchQueryKey="model"
              setIsMenuOpen={setIsFilterMenu}
             />    
          <div className="flex items-start justify-start flex-wrap gap-2">
            {/* {warehouseId === null &&categoryId === null && manufacturerId === null && (
              <Can permissions={["app_api.add_ocproduct"]}>
                <Button
                  onClick={handleAddProduct}
                  className="flex items-center gap-1"
                >
                  <span className="hidden md:block">
                    <Plus size={18} />
                  </span>
                  <span className="md:hidden">
                    <Plus size={14} />
                  </span>
                  {t("Add New Product")}
                </Button>
              </Can>
            )} */}
            {warehouseId === null && manufacturerId === null && (
              <>
              <Can permissions={["app_api.add_ocproductdiscount"]}>

                <Button
                // variant="outline"
                  onClick={handleApplyRandomDiscount}
                  className="flex items-center gap-1   "
                >
                  {/* Medium screen and above */}
                  <span className="hidden md:block">
                    <CirclePercent size={18} />
                  </span>
                  {/* Small screen */}
                  <span className="md:hidden">
                    <CirclePercent size={14} />
                  </span>
                  {t("Apply Random Discount")}
                </Button>
              </Can>
              <Can permissions={["app_api.change_ocproduct"]}>

                <Button
                // variant="outline"
                  onClick={handleProductsBulkStatusUpdate}
                  className="flex items-center gap-1  "
                >
                  {/* Medium screen and above */}
                  <span className="hidden md:block">
                    <FilePenLine size={18} />
                  </span>
                  {/* Small screen */}
                  <span className="md:hidden">
                    <FilePenLine size={14} />
                  </span>
                  {t("Update Status")} 
                </Button>
              </Can>
              <Can permissions={["app_api.change_ocproduct"]}>

                <Button
                // variant="outline"
                  onClick={handleProductsBulkPriceUpdate}
                  className="flex items-center gap-1 "
                >
                  {/* Medium screen and above */}
                  <span className="hidden md:block">
                    <FilePenLine size={18} />
                  </span>
                  {/* Small screen */}
                  <span className="md:hidden">
                    <FilePenLine size={14} />
                  </span>
                  {t("Update Price")} 
                </Button>
              </Can>
              <Can permissions={["app_api.change_ocproduct"]}>

                <Button
                // variant="outline"
                  onClick={handleProductsBulkAssignCategories}
                  className="flex items-center gap-1  "
                >
                  {/* Medium screen and above */}
                  <span className="hidden md:block">
                    <FilePenLine size={18} />
                  </span>
                  {/* Small screen */}
                  <span className="md:hidden">
                    <FilePenLine size={14} />
                  </span>
                  {t("Assign To Categories")}
                </Button>
              </Can>

              </>
            )}

            <ExportButton
              itemPerPage={products?.data?.count}
              url={PRODUCTS_URL}
              isCustomObject={true}
              exportObject={(item) => {
                return {
                  product_id: item.product_id,
                  image: item?.image,
                  model: item.model,
                  quantity_available: item.available_quantity,
                  price: formatNumberWithCurrency(String(item?.price)),
                  discounted_price: formatNumberWithCurrency(
                    String(item?.discounted_price)
                  ),

                  status: item.enabled ? "Enabled" : "Disable",
                  label: convertProductStatusIdToString(item.status),
                  new_item: item?.new_item ? "Yes" : "No",
                  date_added: item.date_added
                    ? displayBasicDate(item.date_added)
                    : "",
                  date_modified: item.date_modified
                    ? displayBasicDate(item.date_modified)
                    : "",
                };
              }}
              fileName="Products.xlsx"
              filters={[
                {
                  key: "slim",
                  value: true,
                },
                {
                  key: searchBy,
                  value: debouncedSearchValue
                    ? debouncedSearchValue.toLowerCase()
                    : null,
                },
                {
                  key: model,
                  value:
                    productModel.filter_id !== null
                      ? productModel.filter_name
                      : null,
                },
                {
                  key: "status",
                  value:
                    status !== null
                      ? convertProductStatusStringToId(status)
                      : null,
                },
                {
                  key: "enabled",
                  value: isEnable,
                },
                {
                  key: "date_added_after",
                  value: rangeDate?.from ? formatDate(rangeDate?.from) : null,
                },
                {
                  key: "date_added_before",
                  value: rangeDate?.to ? formatDate(rangeDate?.to) : null,
                },
                {
                  key: "date_modified_after",
                  value: modifiedRangeDate?.from
                    ? formatDate(modifiedRangeDate?.from)
                    : null,
                },
                {
                  key: "date_modified_before",
                  value: modifiedRangeDate?.to
                    ? formatDate(modifiedRangeDate?.to)
                    : null,
                },
                {
                  key: "discount_start_date",
                  value: discountStartDate ? discountStartDate : null,
                },
                {
                  key: "discount_expiry_date",
                  value: discountExpiryDate ? discountExpiryDate : null,
                },
                {
                  key: "category_id",
                  value: categoryId,
                },
                {
                  key: "warehouse_id",
                  value: warehouseId
                    ? warehouseId
                    : warehouseFormFields?.id
                    ? warehouseFormFields?.id
                    : null,
                },
                {
                  key: "manufacturer_id",
                  value: manufacturerId,
                },
                {
                  key: "new_product",
                  value: onlyNewProducts ? onlyNewProducts : null,
                },
                {
                  key: "have_options",
                  value: productsHaveOptions ? productsHaveOptions : null,
                },
              ]}
              sortBy={sortBy}
              sortType={sortType}
              page={page}
            />
          </div>
          <div className="flex justify-end items-center gap-2">
            {!!selectedProducts?.length && (
              <Button
                disabled={isDeleteSelected}
                variant="destructive"
                onClick={handelDeleteMultipleProducts}
              >
                {isDeleteSelected ? (
                  <p className="flex justify-center items-center space-x-2">
                    <Loader2 className=" h-5 w-5 animate-spin" />
                    <span>{t("Please wait")}</span>
                  </p>
                ) : (
                  <span>{t("Delete Selected")}</span>
                )}
              </Button>
            )}
            {/* <div className="flex items-center space-x-2 group">
              <Switch
                id="#OnlyNewProducts"
                checked={onlyNewProducts}
                onCheckedChange={(val) => {
                  setOnlyNewProducts(val);

                  setPage(1);
                }}
              />
              <Label
                htmlFor="#OnlyNewProducts"
                className={cn(
                  "text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition",
                  onlyNewProducts && "text-slate-900 dark:text-slate-200"
                )}
              >
                {t("Only New Products")}
              </Label>
            </div> */}
            <CustomsItemsPerPage
              setItemPerPage={setItemPerPage}
              itemPerPage={itemPerPage}
            />

            <ColumnsMenu columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} disabledColumnVisibility={disabledColumnVisibility}/>
            
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
          isEmpty={!products?.data?.results?.length > 0}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={<DataTableSkeleton columnCount={5} />}
          emptyStateMessage={
            isFilter
              ? t("You don't have any Products by this filter")
              : t("You don't have any Products get started by creating a new one.")
          }
        >
          <DataTable
            canView={true}
            to={"/catalog/products/details/"}
            columns={columns}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            data={products?.data?.results?.map((product) => ({
              productData: product,
              id: product.product_id,
              product: handleMainProductImage(product?.images || []),
              model: product.model,
              quantity_avilable: product.available_quantity,
              price: product.price,

              enabled: product.enabled,
              status: product.status,
              new_product: product.new_product,
              discounted_price: product.discounted_price,
              date_added: product.date_added
                ? displayBasicDate(product.date_added)
                : "",
              date_modified: product.date_modified
                ? displayBasicDate(product.date_modified)
                : "",
              discount_start_date: product.discount_start_date
                ? displayBasicDate(product.discount_start_date)
                : "",
              discount_expiry_date: product.discount_expiry_date
                ? displayBasicDate(product.discount_expiry_date)
                : "",
              actions: product.Product_id,
            }))}
          />
          <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
            <Pagination
              itemPerPage={itemPerPage}
              next={products?.data?.next}
              previous={products?.data?.previous}
              totalPages={totalPages}
              totalCount={products?.data?.count}
              page={page}
              setPage={setPage}
            />
          </Card>
        </WrapperComponent>
        <ProductDialog />
        <DuplicateProductDialog />
        <ApplyRandomDiscount />
        <ProductsBulkStatusUpdate />
        <ProductsBulkPriceUpdate />
        <ProductsBulkAssignCategories />

        <OnChangeStatus
          name={"Products"}
          heading={t("Are you absolutely sure?")}
          description={`This action will ${
            selectedProduct?.enabled ? "Disable" : "Enabled"
          }  "${selectedProduct?.model}".`}
          url={PRODUCTS_URL}
          id={`${selectedProduct?.id}/`}
          isDialogOpen={isChangeStatus}
          setIsDialogOpen={setIsChangeStatusDialogOpen}
          headers={{
            "Content-Type": "multipart/form-data",
          }}
          data={{
            enabled: selectedProduct?.enabled ? false : true,
          }}
        />

        <OnDeleteDialog
          name={"Products"}
          heading={t("Are you absolutely sure?")}
          description={`${t("This action cannot be undone. This will permanently delete this")} ${selectedProduct?.model}.`}
          url={PRODUCTS_URL}
          id={selectedProduct?.id}
          isDialogOpen={isDeleteProductDialogOpen}
          setIsDialogOpen={setIsDeleteProductDialogOpen}
        />
      </Section>
    </CanSection>
  );
};

export default Products;
