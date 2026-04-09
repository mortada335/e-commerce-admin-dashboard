import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

import { ORDERS_URL, PRODUCTS_URL } from "@/utils/constants/urls";


import { ScrollArea } from "@/components/ui/scroll-area";

import {
  setIsUpdateOrderProductDialogOpen,
  setProductsOrder,
  useOrderStore,
} from "../store";
import { cn } from "@/lib/utils";
import useDebounce from "@/hooks/useDebounce";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import qs from "qs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { updateProductOrderSchema } from "@/utils/validation/updateProductOrder";
import Text from "@/components/layout/text";
import { useParams } from "react-router-dom";
import CanSection from "@/components/CanSection";
import ProductQuantityInput from "./ProductQuantityInput";
import Can from "@/components/Can";
import { handleError } from "@/utils/methods";
import { useTranslation } from "react-i18next";

const defaultFormFields = {
  quantity: 0,
  select_product_id: null,
  select_product_name: null,
};
export default function UpdateOrderProductDialog() {
  const { id } = useParams();
  const {t} =useTranslation()
  const { isUpdateOrderProductDialogOpen, productsOrder,orderDetails } =
    useOrderStore();
  const { toast } = useToast();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const axiosPrivate = useAxiosPrivate();
  const form = useForm({
    resolver: yupResolver(updateProductOrderSchema),
    defaultValues: defaultFormFields,
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const [search, setSearch] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearchValue = useDebounce(search, 1500);
  const [orderChanged, setOrderChanged] = useState(false);
  const [isAction, setIsAction] = useState(false);
  // Initialize query client.
  const queryClient = useQueryClient();

  const GetAdminProduct = async (searchKeyObject = {}) => {
    try {
      const response = await axiosPrivate.get(`${PRODUCTS_URL}`, {
        params: { ...searchKeyObject },
        paramsSerializer: (params) => qs.stringify(params, { encode: false }),
      });
      return response;
      // ...
    } catch (error) {
      // Handle the error
      if (error.code === "ERR_BAD_REQUEST") {
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: "Something went wrong",
        });
      } else if (error.code === "ERR_NETWORK") {
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: "Network error, please try again",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: "An unknown error occurred. Please try again later",
        });
      }
      return error;
    }
  };
  const {
    data: products,

    isLoading,
  } = useQuery({
    queryKey: ["ProductsForOrder", debouncedSearchValue],
    queryFn: () =>
      GetAdminProduct({
        model: debouncedSearchValue,
      }),
    enabled: isUpdateOrderProductDialogOpen,
  });

  useEffect(() => {
    if (formFields.quantity && formFields.select_product_id) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [formFields]);

  const onClose = () => {
    setIsUpdateOrderProductDialogOpen(false);
    form.reset();
  };

  const onSave = async () => {

    const newProductsArray = productsOrder.map((product) => {
      return {
        quantity: product.quantity,
        product_id: product.product_id,
        model: product.model,
        price: product.price,
        product_option_value_id: "None",
      };
    });

    let formData = {};

    formData = Object.fromEntries(
      Object.entries({
        // ...orderDetails,
        order_products: newProductsArray,
        order_status_id:orderDetails?.order_status_id
        // eslint-disable-next-line no-unused-vars
      }).filter(
        // eslint-disable-next-line no-unused-vars
        ([_, value]) => value !== "" && value !== undefined && value !== null
      )
    );

    // mutate({
    //   url: ORDERS_URL,
    //   id: id,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   onFinish: onClose,

    //   formData,
    // });


    try {
      setIsAction(true)

        const response = await axiosPrivate.patch(
          `${ORDERS_URL}${id}/`,

          formData,

          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )

        if (response.status === 201 || response.status === 200) {
          toast({
            title: "Success",
            description: "Updated successfully",
          })
          onClose(response.data)
        }

      

      
    } catch (error) {
      // Handle the error
      // console.log(error)
      setIsAction(false)
      handleError(error)
     
    }finally{
      setIsAction(false)
      queryClient.invalidateQueries({ queryKey: ['OrderDetails'] })
      queryClient.invalidateQueries({ queryKey: ['Order'] })
    }
  };
  const onSubmit = async () => {
    // Validate currency Change
    if (!formFields.select_product_id || !formFields.quantity) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }

    const checkProduct = productsOrder.findIndex(
      (item) => item.product_id === formFields.select_product_id
    );
    if (checkProduct !== -1) {
      setFormFields(defaultFormFields);

      form.reset();
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please select another product",
      });
    } else {
      const product = {
        product:{model: formFields.select_product_name},
        product_id: formFields.select_product_id,
        quantity: Number(formFields.quantity),
      };

      setProductsOrder([...productsOrder, product]);

      setOrderChanged(true)

      setFormFields(defaultFormFields);

      form.reset();
    }
  };
  const handleDeleteProduct = (id) => {
    const filteredProduct = productsOrder.filter(
      (product) => product.product_id != id
    );
    setProductsOrder(filteredProduct);
    setOrderChanged(true)
  };

  const onClickProduct=(product,field) => {

    if (product?.available_quantity===0) {
      toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "This product is not available",
      });
      setIsOpen(false);
      return
    } 
    form.setValue(
      "select_product_id",
      product.id
    );
    if (
      product.product_id ===
      formFields.select_product_id
    ) {
      field.onChange("");
      setFormFields({
        ...formFields,
        select_product_id: null,
        select_product_name: null,
      });
    } else {
      field.onChange(product.product_id);
      setFormFields({
        ...formFields,

        select_product_id:
          product.product_id,
        select_product_name: product.model,
      });
    }
    setIsOpen(false);
  }
  return (
    <Can permissions={["app_api.change_ocorder"]}>
      <Dialog
        open={isUpdateOrderProductDialogOpen}
        onOpenChange={setIsUpdateOrderProductDialogOpen}
      >
        <DialogContent className="max-w-[350px] sm:max-w-[500px] md:max-w-[700px]">
          <ScrollArea className=" h-[500px] pr-4 w-full ">
            <DialogHeader className="pb-4 rtl:items-end">
              <DialogTitle>{t("Update Products Order")}</DialogTitle>
              <DialogDescription>
                {t("Make changes to Products Order here. Click save when you are done.")}
              </DialogDescription>
            </DialogHeader>

            <Table >
              <TableHeader>
                <TableRow className="divide-x-2">
                  <TableHead className=" !font-semibold text-slate-900 dark:text-slate-100">
                    {t("Product Model")}
                  </TableHead>
                  <TableHead className=" !font-semibold text-slate-900 dark:text-slate-100">
                    {t("Quantity")}
                  </TableHead>
                  <TableHead className="!font-semibold text-slate-900 dark:text-slate-100">
                    {t("Actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsOrder?.length > 0 ? (
                  productsOrder?.map((product) => (
                    <TableRow
                      key={product.product_id + product.quantity}
                      className="divide-x-2"
                    >
                      <TableCell>{product?.product?.model}</TableCell>

                      <TableCell className="py-0"><ProductQuantityInput product_id={product.product_id} quantity={product.quantity} setOrderChanged={setOrderChanged}/></TableCell>

                      <TableCell>
                        <Button
                          onClick={() => {
                            handleDeleteProduct(product.product_id);
                          }}
                          variant="destructive"
                          size="icon"
                          className="w-8 h-8"
                        >
                          <X size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <Text
                    className="py-4 px-4"
                    text={t("There is no products added to this order")}
                  />
                )}
              </TableBody>
            </Table>

            <Form {...form} >
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 pt-4"
              >
                <div className="flex justify-between items-center space-x-4 w-full">
                  <FormField
                    control={form.control}
                    name="select_product_id"
                    render={({ field }) => (
                      <FormItem className="w-full px-1 ">
                        <FormLabel>{t("Product")}</FormLabel>
                        <FormControl>
                          <Popover open={isOpen} onOpenChange={setIsOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !formFields.select_product_name &&
                                    "text-muted-foreground"
                                )}
                              >
                                {formFields.select_product_name
                                  ? formFields.select_product_name
                                  : t("Select Product")}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                              <Input
                                onChange={(e) => setSearch(e.target.value)}
                                className="rounded-none  border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-0  focus-visible:ring-offset-0"
                                placeholder={t("Search type...")}
                              />
                              <Separator />
                              <ScrollArea className="h-[250px] pr-4 w-full ">
                                {isLoading ? (
                                  <div className="flex justify-center items-center space-x-2 h-[200px] w-full">
                                    <Loader2 className=" h-5 w-5 animate-spin" />
                                    <span>{t("Please wait")}</span>
                                  </div>
                                ) : products?.data?.results?.length > 0 ? (
                                  products?.data?.results?.map((product) => (
                                    <Button
                                      variant="ghost"
                                      className="w-full rounded-none flex justify-between px-3"
                                      key={product.id}
                                      onClick={()=>onClickProduct(product,field)}
                                    >
                                      {product.model}
                                      <Check
                                        size={"16"}
                                        className={cn(
                                          "ml-2 ",
                                          product.product_id ===
                                            formFields.select_product_id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </Button>
                                  ))
                                ) : (
                                  <p className="w-full py-2  text-center text-sm font-medium">
                                    {t("No product found!!!")}
                                  </p>
                                )}
                              </ScrollArea>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 pt-0">
                      <FormLabel className="capitalize">{t("Quantity")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t("Quantity")}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                            setFormFields({
                              ...formFields,
                              quantity: e.target.value,
                            });
                          }}
                          autoComplete="quantity"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-start items-center w-full py-2 space-x-4">
                  <Button disabled={!isSubmit} variant="outline" type="submit">
                    <span>{t("Add")}</span>
                  </Button>
                </div>
              </form>
            </Form>
            <div className="flex justify-end items-center w-full py-2 space-x-4">
              <Button type="button" variant="secondary" onClick={onClose}>
                {t("Cancel")}
              </Button>
              <Button onClick={onSave} disabled={isAction||!orderChanged} type="button">
                {isAction ? (
                  <p className="flex justify-center items-center space-x-2">
                    <Loader2 className=" h-5 w-5 animate-spin" />
                    <span>{t("Please wait")}</span>
                  </p>
                ) : (
                  <span>{t("Save Changes")}</span>
                )}
              </Button>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Can>
  );
}
