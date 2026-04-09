import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import {
  PRODUCT_ATTRIBUTES_URL,
  PRODUCT_VIDEO_ADMIN_URL,
  PRODUCTS_URL,
} from "@/utils/constants/urls";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel"
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import WrapperComponent from "@/components/layout/WrapperComponent";
import useMutation from "@/hooks/useMutation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Text from "@/components/layout/text";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  CalendarPlus,
  Check,
  CircleAlert,
  Edit2,
  EllipsisVertical,
  Loader2,
  MoreHorizontal,
  Plus,
  RefreshCcw,
  SquarePen,
  Trash2,
} from "lucide-react";
import OnDeleteDialog from "@/components/Dialogs/OnDelete";
import {
  setDeleteAttribute,
  setIsAddImageDialog,
  setIsAttributesDialog,
  setIsDeleteAttributeDialogOpen,
  setIsDeleteImageDialogOpen,
  setIsDeleteProductDialogOpen,
  setIsDeleteVideoDialogOpen,
  setSelectedVideoId,
  useProductStore,
} from "../../store";
import { Badge } from "@/components/ui/badge";
import {
  convertProductStatusStringToId,
  formatDateToISO,
  formatFullDate,
  isNumber,
} from "@/utils/methods";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import CategoryMultiSelect from "@/components/CategoryMultiSelect";
import { Textarea } from "@/components/ui/textarea";
import ProductStatusAutoComplete from "@/pages/sections/components/ProductStatusAutoComplete";
import { useToast } from "@/components/ui/use-toast";

import { Editor } from "@/components/ui/editor";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AddImageDialog from "./AddImageDialog";
import AttributesDialog from "./AttributesDialog";
import AttributesCard from "./AttributesCard";
import ImageCard from "./ImageCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import TimePicker from "@/components/ui/time-picker";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Can from "@/components/Can";
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
  setIsReFetchBaseOnNotification,
  useHomeStore,
} from "@/pages/home/store";
import { Separator } from "@/components/ui/separator";
import EditImageDialog from "./EditImageDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import VideoCard from "./VideoCard";
import ProductVideoDropzone from "./ProductVideoDropzone";
import EditVideoDialog from "./EditVideoDialog";
import usePatch from "@/hooks/usePatch";
import useCan from "@/hooks/useCan";
import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import i18n from "@/locales/i18n";


const currentDate=new Date()

const default_discount_expiry_date = new Date(
  currentDate.setFullYear(currentDate.getFullYear() + 100)
);

const defaultFormFields = {
  nameEnglish: "",
  nameArabic: "",
  englishDescription: "",
  arabicDescription: "",
  model: "",
  notes: "",
  has_points:false,

  price: 0,
  discount_price: 0,
  available_quantity: "",
  discount_start_date: new Date(),
  discount_expiry_date: "",
  points: null,
  enabled: false,

  weight: 0,
  width: 0,
  height: 0,
  length: 0,
};
const BasicInfoTab = () => {
  const { id } = useParams();
  const navigate = useNavigate();
    const {t} = useTranslation()
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const axiosPrivate = useAxiosPrivate();
  const canUpdateAction = useCan(["app_api.change_ocproduct"]);
  const canUpdateProductImageAction = useCan([
    "app_api.change_ocproductimage",
  ]);
  const { isReFetchBaseOnNotification } = useHomeStore();
  const {
    isDeleteProductDialogOpen,
    isDeleteImageDialogOpen,
    selectedImageId,
    isDeleteVideoDialogOpen,
    selectedVideoId,
    isDeleteAttributeDialogOpen,
    deleteAttribute,
  } = useProductStore();

  const GetProductById = async (id) => {
    return axiosPrivate.get(`${PRODUCTS_URL}${id}/`);
  };

  const {
    data: product,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["Product", id],
    queryFn: () => GetProductById(id),
    enabled: !!id,
  });

  const [categoryFormFields, setCategoryFormFields] = useState([]);

  const [images, setImages] = useState(product?.data?.images || []);
  const [selectedImage, setSelectedImage] = useState(images?.at(0) || {});
  const [selectedDraggableImage, setSelectedDraggableImage] = useState(null);
  const [isSave, setIsSave] = useState(false);
  const [quantityUpdateType, setQuantityUpdateType] = useState("increase");
  const [isUpdateQuantity, setIsUpdateQuantity] = useState(false);
  const [isUpdateQuantityValid, setIsUpdateQuantityValid] = useState(false);
  const [isUploadImage, setIsUploadImage] = useState(false);
  const [currentTab, setCurrentTab] = useState("images");
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [statusFormFields, setStatusFormFields] = useState({
    filter_id: null,
    filter_name: null,
  });

  const [attributesFormFields, setAttributesFormFields] = useState([]);

  const handleDefaultDateForDiscountStartDate = () => {
    setFormFields({
      ...formFields,
      discount_start_date: new Date(),
    });
  };
  const handleDefaultDateForDiscountExpiryDate = () => {
    setFormFields({
      ...formFields,
      discount_expiry_date: default_discount_expiry_date,
    });
  };

  useEffect(() => {
    if (product?.data?.product_id >= 0) {
      setFormFields({
        has_points:Boolean(product?.data?.has_points),
        nameEnglish: product?.data?.description?.at(0)?.name,
        nameArabic: product?.data?.description?.at(1)?.name,
        englishDescription: product?.data?.description?.at(0)?.description,
        arabicDescription: product?.data?.description?.at(1)?.description,

        enabled: product?.data?.enabled,
        model: product?.data?.model,
        notes: product?.data?.notes,
        price: Number(product?.data?.price || 0),
        discount_price: Number(product?.data.discounted_price || 0),
        available_quantity: "",
        discount_start_date: product?.data.discount_start_date,
        discount_expiry_date: product?.data.discount_expiry_date,
        points: product?.data.points ? Number(product?.data.points) : 0,
        weight: Number(product?.data.weight) || 0,
        width: Number(product?.data.width) || 0,
        height: Number(product?.data.height) || 0,
        length: Number(product?.data.length) || 0,
      });

      setImages(
        product?.data?.images?.sort((a, b) => a.sort_order - b.sort_order)
      );

      setSelectedImage(
        product?.data?.images
          ?.sort((a, b) => a.sort_order - b.sort_order)
          ?.at(0)
      );
      setCategoryFormFields(product?.data?.categories || []);
      setStatusFormFields({
        filter_id: product?.data.status,
      });

      setAttributesFormFields(product?.data?.product_attributes || []);
    }
  }, [product]);

  useEffect(() => {
    if (
      statusFormFields.filter_id !== product?.data.status ||
      JSON.stringify(categoryFormFields) !==
        JSON.stringify(product?.data?.categories) ||
      formFields.nameEnglish !== product?.data?.description?.at(0)?.name ||
      formFields.nameArabic !== product?.data?.description?.at(1)?.name ||
      formFields.englishDescription !==
        product?.data?.description?.at(0)?.description ||
      formFields.arabicDescription !==
        product?.data?.description?.at(1)?.description ||
      formFields.model !== product?.data?.model ||
      JSON.stringify(formFields.notes) !==
        JSON.stringify(product?.data?.notes || "") ||
      formFields.enabled !== product?.data?.enabled ||
      (formFields.price &&
        isNumber(formFields?.price) &&
        Number(formFields.price) !== Number(product?.data?.price || 0)) ||
      (isNumber(formFields.discount_price) &&
        Number(formFields.discount_price) !==
          Number(product?.data.discounted_price || 0)) ||
      (formFields.available_quantity && isUpdateQuantityValid) ||
      (isNumber(formFields.discount_price) &&
        new Date(formFields.discount_start_date).getTime() !==
          new Date(product?.data.discount_start_date).getTime()) ||
      (isNumber(formFields.discount_price) &&
        new Date(formFields.discount_expiry_date).getTime() !==
          new Date(product?.data.discount_expiry_date).getTime()) ||
      Number(formFields.points) !== Number(product?.data.points || 0) ||
      Number(formFields.weight) !== Number(product?.data.weight || 0) ||
      Number(formFields.width) !== Number(product?.data.width || 0) ||
      Number(formFields.height) !== Number(product?.data.height || 0) ||
      Number(formFields.length) !== Number(product?.data.length || 0) ||
       formFields.has_points !== Boolean(product?.data?.has_points)
    ) {
      setIsSave(true);
    } else {
      setIsSave(false);
    }
  }, [
    statusFormFields,
    attributesFormFields,
    categoryFormFields,
    formFields,
    isUpdateQuantityValid,
  ]);

  useEffect(() => {
    const availableQuantity = formFields.available_quantity;

    // Check if the input is a valid finite number and within the int range

    const isWithinRange = isNumber(availableQuantity);

    const productAvailableQuantity = Number(product?.data?.available_quantity);

    const isIncreaseValid =
      quantityUpdateType === "increase" &&
      isWithinRange &&
      Number(availableQuantity) > 0;

    const isDecreaseValid =
      quantityUpdateType === "decrease" &&
      isWithinRange &&
      Number(availableQuantity) <= productAvailableQuantity &&
      Number(availableQuantity) > 0;

    setIsUpdateQuantityValid(isIncreaseValid || isDecreaseValid);
  }, [formFields, quantityUpdateType, product?.data?.available_quantity]);

  const onFinish = () => {
    setIsUpdateQuantity(false);
    setFormFields({
      ...formFields,
      available_quantity: "",
    });

    // navigate("/catalog/products")
  };

  // const {
  //   mutate,

  //   isPending: isAction,
  // } = useMutation("Product");
  const {
    mutate: patchMutate,

    isPending: isAction,
  } = usePatch({
    queryKey: "Product",
    onSuccess: onFinish,
  });
  const onSubmit = async () => {
    // if (
    //   !formFields.price ||
    //   !formFields.nameArabic ||
    //   !formFields.nameEnglish ||
    //   !formFields.englishDescription ||
    //   !formFields.arabicDescription ||
    //   !formFields.model
    // ) {
    //   return toast({
    //     variant: "destructive",
    //     title: "Failed!!!",
    //     description: "Please fill all the fields",
    //   });
    // }

    const formData = new FormData();
    const description = [
      {
        id: product?.data?.description?.at(0)?.id,
        language_id: 1,
        name: formFields.nameEnglish,
        description: formFields.englishDescription,
        product: product?.data?.description?.at(0)?.product,
      },
      {
        id: product?.data?.description?.at(1)?.id,
        language_id: 2,
        name: formFields.nameArabic,
        description: formFields.arabicDescription,
        product: product?.data?.description?.at(1)?.product,
      },
    ];

    const changedFields = {}; // Track changed fields

    // Compare each field with its original value
    const addFieldIfChanged = (key, value, originalValue) => {
      if (value !== originalValue) {
        changedFields[key] = value;
        formData.append(key, value);
      }
    };

    // Compare and append only changed fields
    addFieldIfChanged("name", formFields.nameEnglish)
    // console.log(formFields.nameArabic)
    addFieldIfChanged("model", formFields.model, product?.data?.model);
    addFieldIfChanged(
      "price",
      Number(formFields.price),
      Number(product?.data?.price)
    );
    addFieldIfChanged(
      "weight",
      Number(formFields.weight),
      Number(product?.data?.weight)
    );
    addFieldIfChanged(
      "length",
      Number(formFields.length),
      Number(product?.data?.length)
    );
    addFieldIfChanged(
      "width",
      Number(formFields.width),
      Number(product?.data?.width)
    );
    addFieldIfChanged(
      "height",
      Number(formFields.height),
      Number(product?.data?.height)
    );
    addFieldIfChanged("enabled", formFields.enabled, product?.data?.enabled);
    addFieldIfChanged("notes", formFields.notes, product?.data?.notes);
    addFieldIfChanged(
      "status",
      statusFormFields.filter_id,
      product?.data?.status
    );
    addFieldIfChanged(
  "has_points",
  formFields.has_points,
  Boolean(product?.data?.has_points)
);

    if (
      JSON.stringify(description) !== JSON.stringify(product?.data?.description)
    ) {
      formData.append("description", JSON.stringify(description));
    }

    if (
      categoryFormFields &&
      JSON.stringify(categoryFormFields.map((item) => item?.category_id)) !==
        JSON.stringify(
          product?.data?.categories?.map((item) => item?.category_id)
        )
    ) {
      formData.append(
        "categories",
        JSON.stringify(categoryFormFields.map((item) => item?.category_id))
      );
    }

    if (
      isNumber(formFields.discount_price) &&
      Number(formFields.discount_price) !==
        Number(product?.data?.discounted_price)
    ) {
      formData.append("discounted_price", String(formFields.discount_price));
    }

    if (
      formFields.discount_start_date &&
      formatDateToISO(formFields.discount_start_date) !==
        formatDateToISO(product?.data?.discount_start_date)
    ) {
      formData.append(
        "discount_start_date",
        formatDateToISO(formFields.discount_start_date)
      );
    }

    if (
      formFields.discount_expiry_date &&
      formatDateToISO(formFields.discount_expiry_date) !==
        formatDateToISO(product?.data?.discount_expiry_date)
    ) {
      formData.append(
        "discount_expiry_date",
        formatDateToISO(formFields.discount_expiry_date)
      );
    }

    if (formFields.points !== product?.data?.points) {
      formData.append("points", Number(formFields.points));
    }

    // Handle quantity update logic only if the user changes it
    if (formFields.available_quantity !== undefined && isUpdateQuantityValid) {
      const newQuantity =
        quantityUpdateType === "increase"
          ? Number(product?.data?.available_quantity) +
            Number(formFields.available_quantity)
          : Number(product?.data?.available_quantity) -
            Number(formFields.available_quantity);

      if (newQuantity !== product?.data?.available_quantity) {
        formData.append("available_quantity", Number(newQuantity));
      }
    }

    // Send only if at least one field has changed
    if (formData.entries().next().done) {
      return toast({
        title: "No Changes",
        description: "No fields were modified.",
      });
    }

    patchMutate({
      endpoint: PRODUCTS_URL,
      id: product?.data?.product_id,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    // mutate({
    //   url: PRODUCTS_URL,
    //   id: product?.data?.product_id,
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    //   onFinish: onFinish,
    //   formData,
    // });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getImagePos = (id) =>
    images.find((item) => item.product_image_id === id);
  const getImageIndex = (id) =>
    images.findIndex((item) => item.product_image_id === id);

  const handleDragEnd = async (event) => {
    if (canUpdateProductImageAction) {
      const { active, over } = event;

      if (active.id === over.id) return;

      const oldPos = getImagePos(active.id);
      const newPos = getImagePos(over.id);

      if (oldPos?.product_image_id && newPos?.product_image_id) {
        setImages((images) => {
          const originalPos = getImageIndex(active.id);
          const newPos = getImageIndex(over.id);

          return arrayMove(images, originalPos, newPos);
        });
        setSelectedDraggableImage(null);

        try {
          const oldPosResponse = await axiosPrivate.put(
            `product_images/${oldPos.product_image_id}/`,

            {
              product_id: id,
              sort_order: newPos.sort_order,
            }
          );
          const newPosResponse = await axiosPrivate.put(
            `product_images/${newPos.product_image_id}/`,

            {
              product_id: id,
              sort_order: oldPos.sort_order,
            }
          );

          if (newPosResponse.status === 200 && oldPosResponse.status === 200) {
            toast({
              title: "Success",
              description: "Moved successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["Product"] });
          }
        } catch (error) {
          // Handle the error

          if (error?.response?.status && error?.response?.status !== 500) {
            toast({
              variant: "destructive",
              title: "Failed!!!",
              description: error.response?.data?.error,
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
      }
    }
  };

  function handleDragStart(event) {
    setSelectedDraggableImage(getImagePos(event.active.id));
  }

  function handleDragCancel() {
    setSelectedDraggableImage(null);
  }
  return (
    <Card dir={i18n.dir()} className="flex flex-col justify-start items-center w-full min-h-fit max-h-fit px-0">
      <WrapperComponent
        isEmpty={!product?.data?.product_id}
        isError={isError}
        error={error}
        isLoading={isLoading}
        loadingUI={
          <div className="flex justify-center items-center space-x-2 h-[450px] w-full">
            <Loader2 className=" h-5 w-5 animate-spin" />
            <span>{t("Please wait")}</span>
          </div>
        }
        emptyStateMessage="Product not found"
      >
        <div className="flex flex-col lg:flex-row w-full min-h-full max-h-fit justify-between gap-1  ">
          <div className="flex flex-col justify-start items-center py-4 w-full lg:w-3/6 space-y-4 border-b lg:border-r">
     
            <Tabs     value={currentTab}
                  onValueChange={setCurrentTab}
          defaultValue="images"  className="flex flex-col justify-center items-center w-full rounded-sm space-y-4  px-2 pb-4">

              <CardHeader className="flex flex-row items-center rtl:flex-row-reverse w-full justify-between py-4">
              <TabsList className="w-fit bg-inherit gap-1 flex flex-row  h-fit">
              <TabsTrigger  className="!w-fit text-lg flex justify-center items-center gap-2 data-[state=active]:border-b-2 rounded-none border-blue-500 "  value="images">
            {t("Images")}
              </TabsTrigger>
              <TabsTrigger  className="!w-fit text-lg flex justify-center items-center gap-2 data-[state=active]:border-b-2 rounded-none border-blue-500 "  value="videos">
            {t("Videos")}
              </TabsTrigger>

        
           
            
          
</TabsList>
              {
                currentTab==='images'&&
                
                <Can permissions={["app_api.change_ocproductimage"]}>
                  <Button
                    size="icon"
                    className="flex justify-center  items-center space-x-2 "
                    onClick={() => {
                      setIsAddImageDialog(true);
                    }}
                  >
                    <Plus size={16} className="" />
                  </Button>
                </Can>
                
              }
              {
                currentTab==='videos' && !product?.data?.videos?.length &&
                <Can permissions={["app_api.change_ocproductimage"]}>
                  <Button
                    size="icon"
                    className="flex justify-center  items-center space-x-2 "
                    onClick={() => {
                      setIsUploadImage((prev)=>!prev);
                    }}
                  >
                    <Plus size={16} className="" />
                  </Button>
                </Can>
              }
              </CardHeader>
              <TabsContent className="w-full h-fit" value="images">
                {images.length ? (
                  <>
                    <div className={cn("relative w-[94%] h-[350px]  ")}>
                      <img
                        src={selectedImage?.image}
                        alt=""
                        className={cn(
                          "w-full h-full object-contain rounded-sm border cursor-pointer"
                        )}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="py-0 px-0 opacity-70 rounded-full absolute top-1 left-1"
                      >
                        <Badge className="py-2 px-3 opacity-70 rounded-full ">
                          {selectedImage?.sort_order}
                        </Badge>
                      </Button>
                    </div>

                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onDragCancel={handleDragCancel}
                    >
                      <SortableContext
                        items={images}
                        strategy={horizontalListSortingStrategy}
                      >
                        <ScrollArea className="w-[94%] whitespace-nowrap rounded-md border">
                          <div className="flex flex-row  justify-start items-center w-full h-fit gap-4 px-4 py-4">
                            {images.map((item, index) => (
                              <ImageCard
                                key={item.product_image_id}
                                index={index}
                                className="w-40 h-40 object-contain rounded-sm border cursor-pointer"
                                item={item}
                                setSelectedImage={setSelectedImage}
                              />
                            ))}
                          </div>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </SortableContext>

                    <DragOverlay adjustScale={true}>
                      {selectedDraggableImage?.product_image_id ? (
                        <div className={cn("relative w-full h-40 ")}>
                          <img
                            src={selectedDraggableImage?.image}
                            alt=""
                            className={cn(
                              "w-full h-full object-contain rounded-sm border cursor-pointer"
                            )}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="py-0 px-0 opacity-70 rounded-full absolute top-1 left-1"
                          >
                            <Badge className="py-2 px-3 opacity-70 rounded-full ">
                              {selectedDraggableImage?.sort_order}
                            </Badge>
                          </Button>
                          <Can permissions={["app_api.change_ocproductimage","app_api.delete_ocproductimage"]}>

                          <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button size="icon" variant="ghost" className="h-8 w-8 p-0 absolute top-2 right-1.5 rounded-full text-blue-500">
      <span className="sr-only">{t("Open menu")}</span>
      <EllipsisVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>

                                  <DropdownMenuSeparator />

    <Can permissions={["app_api.change_ocproductimage"]}>
    <DropdownMenuItem
      className="space-x-2 "
   
    >
   
      <SquarePen size={16} /> <span>{t("Edit")}</span>{" "}
    </DropdownMenuItem>
    </Can>
    <Can permissions={["app_api.delete_ocproductimage"]}>
    <DropdownMenuItem
      className="space-x-2 text-red-500"
     
    >
    
      <Trash2 size={16} className="" /> <span>{t("Delete")}</span>
    </DropdownMenuItem>
    </Can>
  </DropdownMenuContent>
</DropdownMenu>
                          </Can>
                        </div>
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                </>
              ) : (
                <div className="w-full h-[400px]  rounded-sm  flex flex-col space-y-4  justify-center items-center">
                  <Text
                    text={"There is no images in this product to display "}
                  />
                  <Can permissions={["app_api.change_ocproductimage"]}>
                    <Button
                      size="sm"
                      className="flex justify-start items-center space-x-2 "
                      onClick={() => {
                        setIsAddImageDialog(true);
                      }}
                    >
                      <Plus size={16} className="" /> <span> {t("Add Image")}</span>
                    </Button>
                  </Can>
                </div>
              )}
         
          </TabsContent>
          <TabsContent
            className="w-full h-fit"
           value="videos"
         >
         {/* <video src={product?.data?.videos?.at(0)} controls className="w-full max-w-md rounded-md" /> */}
 {product?.data?.videos?.length ? (<VideoCard item={product?.data?.videos?.at(0)}/>):
  isUploadImage?
  <ProductVideoDropzone itemId={product?.data?.product_id}/>
  :
  <div className="w-full h-[400px]  rounded-sm  flex flex-col space-y-4  justify-center items-center">
                  <Text
                    text={t("No videos are available for this product.")}
                  />
                  <Can permissions={["app_api.change_ocproductimage"]}>
                    <Button
                      size="sm"
                      className="flex justify-start items-center space-x-2 "
                      onClick={() => {
                        setIsUploadImage((prev)=>!prev);
                      }}
                    >
                      <Plus size={16} className="" /> <span> {t("Add Video")}</span>
                    </Button>
                  </Can>
                </div>
 }
         </TabsContent>



              {/* <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        
      >


              <SortableContext items={images} strategy={rectSortingStrategy} >
      {!!images.length && (
        <Carousel className="w-[75%] h-40">
          <CarouselContent className="-ml-1">
            {images.map((item) => (
              <CarouselItem
                key={item.id}
                className="pl-1 md:basis-1/2 lg:basis-1/3"
              >
                <ImageCard
                  className="w-full h-40 object-center rounded-sm border cursor-pointer"
                  item={item}
                  setSelectedImage={setSelectedImage}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </SortableContext>
             
      </DndContext> */}
            </Tabs>

            <Separator />

            <div className="flex flex-col justify-start items-start w-[99%] h-full rounded-sm  px-2" >
              <CardHeader className="flex flex-row items-center w-full  justify-between py-4">
                <CardTitle>{t("Attributes")}</CardTitle>
                <Can permissions={["app_api.add_ocproductattribute"]}>
                  <Button
                    size="icon"
                    className="flex justify-center  items-center space-x-2 "
                    onClick={() => {
                      setIsAttributesDialog(true);
                    }}
                  >
                    <Plus size={16} className="" />
                  </Button>
                </Can>
              </CardHeader>
              {attributesFormFields?.length ? (
                <CardContent className="grid grid-cols-2 place-content-start place-items-start w-full h-full gap-4">
                  {attributesFormFields?.map((attribute, index) => (
                    <AttributesCard
                      key={attribute?.attribute_id + index}
                      attribute={attribute}
                      productId={product?.data?.product_id}
                    />
                  ))}
                </CardContent>
              ) : (
                <CardContent className="h-full w-full  flex flex-col justify-center items-center space-y-4">
                  <Text text={t("There is no attributes in this product")} />
                  <Can permissions={["app_api.add_ocproductattribute"]}>
                    <Button
                      size="sm"
                      className="flex justify-start items-center space-x-2 "
                      onClick={() => {
                        setIsAttributesDialog(true);
                      }}
                    >
                      <Plus size={16} className="" />{" "}
                      <span> {t("Add attribute")}</span>
                    </Button>
                  </Can>
                </CardContent>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between items-start space-y-4 w-full lg:w-3/6 h-full py-4 px-2 overflow-x-auto ">
            {/* Info Content */}
            <div className="flex flex-col justify-center items-start space-y-4 w-full h-full py-4 overflow-x-auto">
              <div className="flex justify-between items-start w-full flex-wrap gap-2">
                <CardHeader className="py-0 px-0 w-fit">
                  <CardTitle className="!font-normal !text-2xl w-fit">
                    <Input
                      className="border-0 !font-normal !text-2xl px-2 w-fit"
                      value={formFields.nameArabic}
                      disabled={!canUpdateAction}
                      onChange={(e) => {
                        setFormFields({
                          ...formFields,
                          nameArabic: e.target.value,
                        });
                      }}
                    />{" "}
                  </CardTitle>
                  <CardDescription className="flex justify-start items-center space-x-1">
                    <span>{t("English Name")}:</span>
                    <Input
                      className="border-0 w-fit h-fit  py-1 px-1"
                      onChange={(e) => {
                        setFormFields({
                          ...formFields,
                          nameEnglish: e.target.value,
                        });
                      }}
                      value={formFields.nameEnglish}
                      disabled={!canUpdateAction}
                    />{" "}
                  </CardDescription>
                </CardHeader>
                <div className="flex justify-end items-center space-x-2">
                  <Can permissions={["app_api.change_ocproduct"]}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            disabled={!isSave || isAction}
                            onClick={onSubmit}
                            type="button"
                            size="icon"
                          >
                            {isAction ? (
                              <Loader2 className=" h-5 w-5 animate-spin" />
                            ) : (
                              <Check size="20" aria-hidden="true" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <Text text={t("Save Changes")} />
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Can>
                  {isReFetchBaseOnNotification && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            disabled={isLoading}
                            variant="outline"
                            type="button"
                            size="icon"
                            onClick={() => {
                              queryClient.invalidateQueries({
                                queryKey: ["Product"],
                              });

                              setIsReFetchBaseOnNotification(false);
                            }}
                          >
                            {isLoading ? (
                              <RefreshCcw className=" h-5 w-5 animate-spin" />
                            ) : (
                              <RefreshCcw size="20" aria-hidden="true" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <Text text={t("Refresh")} />
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                   <Can permissions={["app_api.delete_ocproduct","app_api.change_ocproductimage","app_api.add_ocproductattribute"]}>


                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="outline">
                        <span className="sr-only">{t("Open menu")}</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Can
                        permissions={["app_api.change_ocproductimage"]}
                      >
                        <DropdownMenuItem
                          className="flex justify-start items-center space-x-2 "
                          onClick={() => {
                            setIsAddImageDialog(true);
                          }}
                        >
                          <Plus size={16} className="" />{" "}
                          <span> {t("Add Image")}</span>
                        </DropdownMenuItem>
                      </Can>
                      <Can
                        permissions={["app_api.add_ocproductattribute"]}
                      >
                        <DropdownMenuItem
                          className="flex justify-start items-center space-x-2 "
                          onClick={() => {
                            setIsAttributesDialog(true);
                          }}
                        >
                          <Plus size={16} className="" />{" "}
                          <span> {t("Add Attribute")}</span>
                        </DropdownMenuItem>
                      </Can>
                      <Can permissions={["app_api.delete_ocproduct"]}>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="flex justify-start items-center space-x-2 text-red-500"
                          onClick={() => {
                            setIsDeleteProductDialogOpen(true);
                          }}
                        >
                          <Trash2 size={16} className="" /> <span>{t("Delete")}</span>
                        </DropdownMenuItem>
                      </Can>
                    </DropdownMenuContent>
                  </DropdownMenu>
                   </Can>
                  

                </div>
              </div>
              {/* Categories */}
              <div className="flex flex-col justify-start items-start space-y-2 w-full ">
                <Text text={t("Categories")} />

                <CategoryMultiSelect
                  disabled={!canUpdateAction}
                  selectedCategories={categoryFormFields}
                  setSelectedCategories={setCategoryFormFields}
                />
              </div>
              {/* Model */}
              <div className="flex justify-start space-x-1 items-center  w-full">
                <Text text={t("Model") + ":"} />
                <Input
                  className="border-0 w-fit h-fit  py-1 px-1"
                  onChange={(e) => {
                    setFormFields({
                      ...formFields,
                      model: e.target.value,
                    });
                  }}
                  value={formFields.model}
                  disabled={!canUpdateAction}
                />{" "}
              </div>

              {/* Price */}
              <div className="flex justify-start space-x-1 items-center  w-full">
                <Text text={t("Price") + ":"} />
                <Input
                  className={cn(
                    "border-0 w-fit h-fit font-semibold text-sm  py-1 px-1",
                    !isNumber(formFields?.price) && "!ring-red-500"
                  )}
                  type="text"
                  value={formFields?.price}
                  disabled={!canUpdateAction}
                  onChange={(e) => {
                    setFormFields({
                      ...formFields,
                      price: e.target.value,
                    });
                  }}
                />{" "}
              </div>
              {/* Has Points Section */}
              <div className="border rounded-lg p-4 flex items-center justify-between mb-4 gap-4">
                <div className="flex flex-col flex-1">
                  <label className="text-sm font-medium">{t("Has Points")}</label>
                  <p className="text-xs text-muted-foreground">
                    {t("Enable if this product earns or uses points")}
                  </p>
                </div>

                <div className="flex items-center ms-4">
                  <Checkbox
                    checked={formFields.has_points}
                    onCheckedChange={(checked) =>
                      setFormFields({ ...formFields, has_points: checked })
                    }
                    disabled={!canUpdateAction}
                  />
                </div>
              </div>


              {/* Available Quantity */}
              <div className="flex justify-start space-x-1 items-center  w-full gap-4 h-7">
                <Text text={t("Quantity") + ":"} />
                <Text
                  className={
                    "font-semibold text-sm text-slate-900 dark:text-white"
                  }
                  text={product?.data?.available_quantity}
                />
                      <Can
                        permissions={["app_api.change_ocproduct"]}
                      >

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="px-0 w-7 py-1 h-7 "
                        onClick={() => {
                          setIsUpdateQuantity((prev) => !prev);
                        }}
                        size="icon"
                        variant="ghost"
                      >
                        <Edit2 size={12} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("Update Quantity")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                      </Can>
              </div>
              {isUpdateQuantity && (
                <div className="flex justify-start gap-2 items-center  w-full">
                  <Text
                    className={
                      "border rounded-md px-4 py-1 text-slate-900 dark:text-white"
                    }
                    text={product?.data?.available_quantity}
                  />
                  <Select
                    onValueChange={setQuantityUpdateType}
                    defaultValue={quantityUpdateType}
                    value={quantityUpdateType}
                  >
                    <SelectTrigger className="w-fit h-8 gap-2">
                      <SelectValue
                        className=""
                        placeholder={t("Select Quantity Update Type")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{t("Quantity Update Type")}</SelectLabel>
                        <SelectItem value="increase">{t("Increase")} +</SelectItem>
                        <SelectItem value="decrease">{t("Decrease")} -</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {/* available_quantity */}
                  <Input
                    className={cn(
                      "border w-32  font-medium text-sm h-8  py-1 px-2",
                      !formFields.available_quantity >= 0 &&
                        !isUpdateQuantityValid &&
                        "!ring-red-500"
                    )}
                    type="text"
                    placeholder={t("New Quantity")}
           
                    value={formFields?.available_quantity}
                    onChange={(e) => {
                      setFormFields({
                        ...formFields,
                        available_quantity: e.target.value,
                      });
                    }}
                  />{" "}
                  {formFields.available_quantity >= 0 &&
                  isUpdateQuantityValid ? (
                    <>
                      <span className="px-2">=</span>

                      <Text
                        className={
                          "border rounded-md px-4 py-1 font-semibold text-slate-900 dark:text-white"
                        }
                        text={
                          quantityUpdateType === "increase"
                            ? Number(product?.data?.available_quantity) +
                              Number(formFields.available_quantity)
                            : Number(product?.data?.available_quantity) -
                              Number(formFields.available_quantity)
                        }
                      />
                    </>
                  ) : (
                    <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg">
                       <CircleAlert className="text-red-500" size={18} />
                     </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-red-500">{t("Invalid Quantity")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                  )}
                </div>
              )}
              <Badge
                disabled={!canUpdateAction}
                variant={
                  product?.data?.available_quantity > 0 ? "" : "destructive"
                }
                className={cn(
                  "rounded-sm py-2 uppercase ",
                  product?.data?.available_quantity > 0 &&
                    "bg-[#3AC5AB] text-white "
                )}
              >
                {product?.data?.available_quantity > 0
                  ? t("in stock")
                  : t("not available")}
              </Badge>
              <Badge
                disabled={!canUpdateAction}
                onClick={() => {
                  if (canUpdateAction) {
                    setFormFields({
                      ...formFields,
                      enabled: !formFields.enabled,
                    });
                  }
                }}
                className={cn(
                  " rounded-sm py-2 uppercase cursor-pointer",
                  formFields?.enabled
                    ? "bg-[#3AC5AB] text-white"
                    : "bg-red-500 text-white "
                )}
                variant={formFields?.enabled ? "success" : "destructive"}
              >
                {formFields?.enabled ? t("Enabled") : t("Disable")}
              </Badge>

              {/* Description */}
              <div className="flex flex-col justify-start items-start space-y-2 w-full px-1 ">
                <Text className="font-medium" text={t("Arabic Description:")} />
                <Textarea
                  rows={4}
                  className="font-medium text-sm w-full"
                  value={formFields?.arabicDescription}
                  onChange={(e) => {
                    setFormFields({
                      ...formFields,
                      arabicDescription: e.target.value,
                    });
                  }}
                  placeholder={t("Type your description here.")}
                  disabled={!canUpdateAction}
                />
              </div>
              {/* English Description */}
              <div className="flex flex-col justify-start items-start space-y-2 w-full px-1">
                <Text className="font-medium" text={t("English Description:")} />
                <Textarea
                  rows={4}
                  className="font-medium text-sm"
                  value={formFields?.englishDescription}
                  onChange={(e) => {
                    setFormFields({
                      ...formFields,
                      englishDescription: e.target.value,
                    });
                  }}
                  placeholder={t("Type your description here.")}
                  disabled={!canUpdateAction}
                />
              </div>

              {/* <Table>
              <TableHeader>
                <TableRow className="divide-x-2">
                  <TableHead className="w-[150px] !font-semibold">
                    Weight
                  </TableHead>
                  <TableHead className="w-[150px] !font-semibold">
                    Length
                  </TableHead>
                  <TableHead className="w-[150px] !font-semibold">
                    Width
                  </TableHead>
                  <TableHead className="w-[150px] !font-semibold">
                    Height
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="divide-x-2">
                  <TableCell className="py-2 px-2">
                    <Input
                      className="border-0 w-full h-full font-semibold text-sm  py-1 px-1 rounded-none"
                      value={formFields?.weight}
                      min={0}
                      onChange={(e) => {
                        setFormFields({
                          ...formFields,
                          weight: e.target.value,
                        })
                      }}
                      type="number"
                    />
                  </TableCell>
                  <TableCell className="py-2 px-2">
                    <Input
                      className="border-0 w-full h-fit font-semibold text-sm  py-1 px-1 rounded-none"
                      value={formFields?.length}
                      min={0}
                      onChange={(e) => {
                        setFormFields({
                          ...formFields,
                          length: e.target.value,
                        })
                      }}
                      type="number"
                    />
                  </TableCell>
                  <TableCell className="py-2 px-2">
                    <Input
                      className="border-0 w-full h-fit font-semibold text-sm  py-1 px-1 rounded-none"
                      value={formFields?.width}
                      min={0}
                      onChange={(e) => {
                        setFormFields({
                          ...formFields,
                          width: e.target.value,
                        })
                      }}
                      type="number"
                    />
                  </TableCell>
                  <TableCell className="py-2 px-2">
                    <Input
                      className="border-0 w-full h-fit font-semibold text-sm  py-1 px-1 rounded-none"
                      value={formFields?.height}
                      min={0}
                      onChange={(e) => {
                        setFormFields({
                          ...formFields,
                          height: e.target.value,
                        })
                      }}
                      type="number"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table> */}
            </div>
            {/* Table */}
            <div className="px-1 w-full">

            <Table containerClassName="overflow-x-auto">
              <TableHeader>
                <TableRow className="divide-x-2">
                  <TableHead className="w-[150px] !font-semibold">
                    {t("Discount Price")}
                  </TableHead>
                  <TableHead className="w-[150px] !font-semibold">
                    {t("Discount Start")}
                  </TableHead>
                  <TableHead className="w-[150px] !font-semibold">
                    {t("Discount Expiry")}
                  </TableHead>
                  <TableHead className=" w-[150px] !font-semibold">
                    {t("Label")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="divide-x-2">
                  <TableCell className="py-2 px-2">
                    <Input
                      className={cn("border-0 w-full h-fit font-semibold text-sm  py-1 px-1 rounded-none ",!isNumber(formFields?.discount_price)&&'!ring-red-500')}
                      type="text"
                      disabled={!canUpdateAction}
                      value={formFields?.discount_price}
                      onChange={(e) => {
                        // Get current date
                        const currentDate = new Date();
                        // Set it to midnight
                        currentDate.setHours(0, 0, 0, 0);
                        // Add one day
               
      
                        setFormFields({
                          ...formFields,
                          discount_price: e.target.value,
                          // discount_start_date: currentDate,
                          // discount_expiry_date: default_discount_expiry_date,
                        });
                        // if(e.target.value>0){

                          // setStatusFormFields({
                          //   filter_id:convertProductStatusStringToId("DISCOUNT")
                          // })
                          // }else{

                        // setStatusFormFields({
                        //   filter_id:convertProductStatusStringToId("NONE")
                        // })
                        // }
                      }}
                    />
                  </TableCell>
                  <TableCell className="py-2 px-2">
                    <div className="py-0 px-2 flex justify-start items-center gap-2">
                    <Popover>
                      <PopoverTrigger  asChild>
                        <Button
                        disabled={!canUpdateAction}
                          variant={"ghost"}
                          type="button"
                          className={cn(
                            " w-full text-left !text-xs font-normal rounded-none flex justify-start items-center px-1",
                            !formFields.discount_start_date &&
                              "text-muted-foreground w-[150px]"
                          )}
                        >
                          {formFields.discount_start_date ? (
                            formatFullDate(formFields.discount_start_date)
                          ) : (
                            <>
                              {t("Discount Start")}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formFields.discount_start_date}
                          onSelect={(value) => {
                            setFormFields({
                              ...formFields,
                              discount_start_date: value,
                            });
                          }}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                        <TimePicker
                          selectedTime={formFields.discount_start_date}
                          onSelectTime={(value) => {
                            setFormFields({
                              ...formFields,
                              discount_start_date: value,
                            });
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                    <Button
                    disabled={!canUpdateAction}
                    size="icon"
                      variant={"ghost"}
                      className="w-10 h-10"
                     
                      onClick={handleDefaultDateForDiscountStartDate}
                    >

                     <CalendarPlus className=" h-4 w-4 " />
                            
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-blue-500">{t("Set Default Date")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                  </div>
                  </TableCell>
                  <TableCell >
                  <div className="py-0 px-2 flex justify-start items-center gap-2">
                    <Popover>
                      <PopoverTrigger  asChild>
                        <Button
                        disabled={!canUpdateAction}
                          variant={"ghost"}
                          type="button"
                          className={cn(
                            " w-full text-left !text-xs font-normal rounded-none flex justify-start items-center px-1",
                            !formFields.discount_expiry_date &&
                              "text-muted-foreground w-[150px]"
                          )}
                        >
                          {formFields.discount_expiry_date ? (
                            formatFullDate(formFields.discount_expiry_date)
                          ) : (
                            <>
                              {t("Discount Expiry")}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formFields.discount_expiry_date}
                          onSelect={(value) => {
                            setFormFields({
                              ...formFields,
                              discount_expiry_date: value,
                            });
                          }}
                          disabled={(date) => date < new Date(formFields.discount_start_date)}
                          initialFocus
                        />
                        <TimePicker
                          selectedTime={formFields.discount_expiry_date}
                          onSelectTime={(value) => {
                            setFormFields({
                              ...formFields,
                              discount_expiry_date: value,
                            });
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                    <Button
                    disabled={!canUpdateAction}
                    size="icon"
                      variant={"ghost"}
                      className="w-10 h-10"
                     
                      onClick={handleDefaultDateForDiscountExpiryDate}
                    >

                     <CalendarPlus className=" h-4 w-4 " />
                            
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-blue-500">{t("Set Default Date")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                  </div>

                  </TableCell>

                    <TableCell className="py-2 px-2">
                      <ProductStatusAutoComplete
                        disabled={!canUpdateAction}
                        formFields={statusFormFields}
                        setFormFields={setStatusFormFields}
                      />
                      {/* <Badge
                      className={cn(
                        "text-xs font-medium rounded-sm bg-blue-500 text-white "
                      )}
                    >
                      {convertProductStatusIdToString(product?.data?.status)}
                    </Badge> */}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <Separator />
        <div className="w-full h-fit px-4 py-4">
          <Editor
            editable={canUpdateAction}
            initialContent={
              formFields.notes ? formFields.description : product?.data?.notes
            }
            onChange={(value) => {
              setFormFields({
                ...formFields,
                notes: value,
              });
            }}
          />
        </div>
      </WrapperComponent>
      <AddImageDialog product={product} />
      <AttributesDialog product={product} />
      <OnDeleteDialog
        name={"Products"}
        heading={t("Are you absolutely sure?")}
        description={`${t("This action cannot be undone. This will permanently delete this product.")}`}
        url={PRODUCTS_URL}
        id={product?.data?.product_id}
        isDialogOpen={isDeleteProductDialogOpen}
        setIsDialogOpen={setIsDeleteProductDialogOpen}
        onFinish={() => {
          navigate("/catalog/products");
        }}
      />
      <OnDeleteDialog
        name={"Product"}
        heading={t("Are you absolutely sure?")}
        description={`${t("This action cannot be undone. This will permanently delete image with this id")} "${selectedVideoId}".`}
        url={PRODUCT_VIDEO_ADMIN_URL}
        id={`${selectedVideoId}/`}
        isDialogOpen={isDeleteVideoDialogOpen}
        setIsDialogOpen={setIsDeleteVideoDialogOpen}
        onFinish={() => {
          setSelectedVideoId(null);
        }}
      />

      <OnDeleteDialog
        name={"Product"}
        heading={t("Are you absolutely sure?")}
        description={`${t("This action cannot be undone. This will permanently delete image with this id")} "${selectedImageId}".`}
        url={"product_images/"}
        id={`${selectedImageId}/`}
        isDialogOpen={isDeleteImageDialogOpen}
        setIsDialogOpen={setIsDeleteImageDialogOpen}
        onFinish={() => {
          setSelectedImage(null);
        }}
      />
      <EditImageDialog />
      <EditVideoDialog />
      <OnDeleteDialog
          name={"Product"}
          heading={t("Are you absolutely sure?")}
          description={`${t("This action cannot be undone. This will permanently delete this")} "${deleteAttribute?.attributes_data?.value}".`}
          url={PRODUCT_ATTRIBUTES_URL}
          id={"delete_attribute/"}
          isDialogOpen={isDeleteAttributeDialogOpen}
          setIsDialogOpen={setIsDeleteAttributeDialogOpen}
          onFinish={() => {
            setDeleteAttribute(null)
          }}
          data={{
            attribute_id: deleteAttribute?.attribute_id,
            product_id: product?.data?.product_id,
            
          }}
        />
    </Card>
  );
};

export default BasicInfoTab;
