import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { optionSchema } from "@/utils/validation/product";

import {
  PRODUCT_OPTIONS_TYPE_URL,
  PRODUCT_OPTIONS_TYPE_VALUES_URL,
  PRODUCT_OPTIONS_URL,
} from "@/utils/constants/urls";
import useUpdateMutation from "@/hooks/useUpdateMutation";
import { ScrollArea } from "@/components/ui/scroll-area";

import { isNumber } from "@/utils/methods";
import Can from "@/components/Can";
import { setIsOptionDialogOpen, useOptionStore } from "../store";
import FileInput from "@/components/ui/custom-file-input";
import CustomsCombobox from "@/components/ui/customs-combobox";
import usePost from "@/hooks/usePost";
import usePUT from "@/hooks/usePut";
import usePatch from "@/hooks/usePatch";
import { useTranslation } from "react-i18next";

const defaultFormFields = {
  quantity: 0,
  imageUrl: null,
  image: null,
};

export default function OptionDialog({ product_id }) {
  const { toast } = useToast();
  const {t} = useTranslation()
  const [optionType, setOptionType] = useState(null);
  const [optionTypeValues, setOptionTypeValues] = useState(null);
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { selectedOption, isOptionDialogOpen } = useOptionStore();

  const form = useForm({
    resolver: yupResolver(optionSchema),
    defaultValues: defaultFormFields,
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const onClose = () => {
    setIsOptionDialogOpen(false);
    form.reset();
    setOptionTypeValues(null);
    setOptionType(null);
    setFormFields(defaultFormFields);
  };

  const {
    mutate: postMutate,

    isPending: isPostAction,
  } = usePost({
    queryKey: "Options",
    onSuccess: onClose,
  });
  const {
    mutate,

    isPending,
  } = usePatch({
    queryKey: "Options",
    onSuccess: onClose,
  });

  useEffect(() => {
    if (
      selectedOption !== null &&
      selectedOption !== undefined &&
      isOptionDialogOpen
    ) {
      form.setValue("quantity", selectedOption.quantity || 0);
      form.setValue("price", Number(selectedOption.price) || 0);
      form.setValue("image", selectedOption.option_image);

      setFormFields({
        imageUrl: selectedOption.option_image,
        quantity: selectedOption.quantity || 0,
        price: Number(selectedOption.price) || 0,
      });
    } else {
      // this is server error or other erro that could happen
      setFormFields(defaultFormFields);
      form.reset();
    }
  }, [selectedOption, isOptionDialogOpen]);

  useEffect(() => {
    const isUpdate = !selectedOption?.product_option_value_id
      ? product_id && optionType?.id && optionTypeValues?.option_value_id
        ? true
        : false
      : true;
    console.log(isUpdate);
    if (
      isUpdate &&
      formFields.quantity &&
      formFields.quantity >= 0 &&
      isNumber(formFields.quantity) &&
      formFields.price &&
      formFields.price >= 0 &&
      isNumber(formFields.price) &&
      (formFields.image || selectedOption?.option_image)
    ) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [formFields, optionType, optionTypeValues]);

  const onSubmit = async () => {
    // Validate currency Change
    if (!isSubmit) {
      toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }

    const formData = new FormData();
    if (product_id) {
      formData.append("product", product_id);
    }
    if (optionType?.option_id) {
      formData.append("option_id", optionType?.option_id);
    }
    if (optionTypeValues?.option_value_id) {
      formData.append("option_value_id", optionTypeValues?.option_value_id);
    }

    formData.append("quantity", formFields.quantity);
    formData.append("price", formFields.price);

    if (formFields.image instanceof File)
      formData.append("option_image", formFields.image);

    if (selectedOption?.product_option_value_id) {
      mutate({
        endpoint: PRODUCT_OPTIONS_URL,
        id: selectedOption?.product_option_value_id,

        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } else {
      postMutate({
        endpoint: PRODUCT_OPTIONS_URL,
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
  };

  const getValueName = (value) => {
    const currentName = (
      <p>
        {" "}
        {value?.description?.find((item) => item?.language_id === 1)?.name ||
          "Unknown Description"}
      </p>
    );

    return currentName;
  };

  return (
    <Can permissions={["app_api.change_ocoptionvalue"]}>
      <Dialog open={isOptionDialogOpen} onOpenChange={setIsOptionDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <ScrollArea className="h-[400px] md:h-[500px] lg:h-[600px] xl:h-[650px] pr-4 w-full ">
            <DialogHeader>
              <DialogTitle>
                {selectedOption?.product_option_value_id ? t("Update") : t("Create")}{" "}
                {t("Options")}
              </DialogTitle>
              <DialogDescription>
                {selectedOption?.product_option_value_id
                  ? t("Make changes to your")
                  : t("Create")}{" "}
                {t("option here. Click save when you are done.")}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 "
              >
                {!selectedOption?.product_option_value_id && (
                  <>
                    <FormField
                      control={form.control}
                      name="option"
                      render={({ field }) => (
                        <FormItem className="w-full px-1">
                          <FormLabel>
                            {" "}
                            {t("Option")}
                            <span className="text-red-500 text-xl">*</span>
                          </FormLabel>
                          <FormControl>
                            <CustomsCombobox
                              endpoint={PRODUCT_OPTIONS_TYPE_URL}
                              itemValue={"id"}
                              setItem={setOptionType}
                              item={optionType}
                              itemTitle="name"
                              containerClassName="w-full"
                              searchQueryKey="name"
                              queryKey="options-type"
                              className=""
                              placeholder={t("Select Option")}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="option-value"
                      disabled={!optionType?.option_id}
                      render={({ field }) => (
                        <FormItem className="w-full px-1">
                          <FormLabel>
                            {" "}
                            {t("Option Value")}
                            <span className="text-red-500 text-xl">*</span>
                          </FormLabel>
                          <FormControl>
                            <CustomsCombobox
                              disabled={!optionType?.option_id}
                              filters={[
                                {
                                  key: "option_id",
                                  value: optionType?.option_id,
                                },
                              ]}
                              endpoint={PRODUCT_OPTIONS_TYPE_VALUES_URL}
                              itemValue={"option_value_id"}
                              setItem={setOptionTypeValues}
                              item={optionTypeValues}
                              itemTitle="name"
                              containerClassName="w-full"
                              searchQueryKey="name"
                              queryKey="options-type-values"
                              className=""
                              placeholder={t("Select Option Value")}
                            >
                              {(item) => <>{getValueName(item)}</>}
                            </CustomsCombobox>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem className="w-full px-1">
                      <FormLabel>
                        {" "}
                        {t("Quantity")}
                        <span className="text-red-500 text-xl">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("Available Quantity")}
                          className={
                            !isNumber(formFields?.quantity) && "!ring-red-500"
                          }
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
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        {" "}
                        {t("Price")}
                        <span className="text-red-500 text-xl">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("Product Price")}
                          value={field.value}
                          className={
                            !isNumber(formFields?.price) && "!ring-red-500"
                          }
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setFormFields({
                              ...formFields,
                              price: e.target.value,
                            });
                          }}
                          autoComplete="price"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* image */}
                <div className="flex justify-between items-center w-full h-fit">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem className="w-full px-1">
                        <FormLabel className="capitalize">
                          {t("image")} <span className="text-red-500 text-xl">*</span>{" "}
                        </FormLabel>
                        <FormControl>
                          {/* <Input
                          type="file"
                          placeholder="Select Category image"
                          id="image"
                          onChange={(e) => handleImageChange(e, field)}
                          autoComplete="image"
                        /> */}
                          <FileInput
                            field={field}
                            setFormFields={setFormFields}
                            formFields={formFields}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end items-center w-full py-2 space-x-4">
                  <Button variant="secondary" onClick={onClose}>
                    {t("Cancel")}
                  </Button>
                  <Button
                    disabled={!isSubmit || isPostAction || isPending}
                    type="submit"
                  >
                    {isPostAction || isPending ? (
                      <p className="flex justify-center items-center space-x-2">
                        <Loader2 className=" h-5 w-5 animate-spin" />
                        <span>{t("Please wait")}</span>
                      </p>
                    ) : (
                      <span>{t("Save")}</span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Can>
  );
}
