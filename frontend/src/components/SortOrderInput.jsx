import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import useMutation from "@/hooks/useMutation";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
const bannerSchema = yup
  .object({
    sort_order: yup
      .number()

      .integer("Order must be an number")
      .required("Order number is required"),
  })
  .required();

const SortOrderInput = ({ url,  banner }) => {
  const [newSortOrder, setNewSortOrder] = useState();
  const [isChanged, setIsChanged] = useState(false);
  const form = useForm({
    resolver: yupResolver(bannerSchema),
    defaultValues: {
      sort_order: "",
    },
  });

  useEffect(() => {
    setNewSortOrder(banner?.sort_order);
    form.setValue("sort_order", banner?.sort_order);
  }, [banner]);

  useEffect(() => {
    if (Number(newSortOrder) !== Number(banner?.sort_order)) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [newSortOrder, banner]);

  const {
    mutate,

    isPending: isAction,
  } = useMutation("Banners");

  function onSubmit() {
  
    if (!isChanged || !banner?.banner_image_id || !url) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }

    const formData = new FormData(); // Create a new FormData object

    if (banner?.title) {
      formData.append("title", banner?.title);
      formData.append("language_id", banner?.language_id);
    }

    formData.append("sort_order", newSortOrder);

    mutate({
      url: url,
      id: banner?.banner_image_id,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onFinish: () => {
        setIsChanged(false);
      },
      formData,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" flex justify-start items-center w-fit gap-0 relative"
      >
        <FormField
          control={form.control}
          name="sort_order"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className={cn(
                    "  !ring-0 !outline-none !ring-offset-0",
                    isChanged && " rounded-none !rounded-l-md ",
                    !isChanged && "border-none"
                  )}
                  type="number"
                  placeholder="index"
                  value={field.value}
                  min={0}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setNewSortOrder(e.target.value);
                  }}
                  autoComplete="sort_order"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {isChanged && (
          <Button
            className={cn(
              "w-20 xl:w-10",
              isChanged && "rounded-none !rounded-r-md "
            )}
            size="icon"
            type="submit"
          >
            {isAction ? (
              <p className="flex justify-center items-center space-x-2">
                <Loader2 className=" h-5 w-5 animate-spin" />
              </p>
            ) : (
              <Check size={15} />
            )}
          </Button>
        )}
      </form>
    </Form>
  );
};

export default SortOrderInput;
