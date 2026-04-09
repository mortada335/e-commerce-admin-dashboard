import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PRODUCT_ATTRIBUTES_URL } from "@/utils/constants/urls";

import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";

import { useEffect, useState } from "react";
import { setIsAttributesDialog } from "../store";
import AttributesDialog from "../product/components/AttributesDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import AttributesList from "../components/AttributesList";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
const AttributesTab = ({ setCurrentStep, product }) => {
  const { toast } = useToast();

  const [attributesFormFields, setAttributesFormFields] = useState([]);

  const {
    mutate,

    isPending: isAction,
  } = useMutation("Product");

  useEffect(() => {
    if (
      product?.data?.product_id >= 0 &&
      product?.data?.product_attributes?.length
    ) {
      let newAttributesMap =
        product?.data?.product_attributes?.map((attr) => {
          return {
            productId: "",
            attributeId: attr?.attribute_id,
            attributeName: attr?.attributes_data?.key,

            text: attr?.attributes_data?.value || "",
            language_id: 1,
            key: attr?.attributes_data?.key,
          };
        }) || [];
      if (newAttributesMap?.length) {
        setAttributesFormFields([...newAttributesMap]);
      }
    } else {
      setAttributesFormFields([
        {
          productId: "",
          attributeId: "",
          attributeName: "",
          text: "",
          language_id: 1,
        },
      ]);
    }
  }, [product]);

  const onSave = async () => {
    const validAttributes = attributesFormFields.filter(
      (attribute) => attribute.text && attribute.attributeId
    );

    if (!validAttributes.length) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }

    const formData = attributesFormFields.map((attribute) => ({
      text: attribute.text,
      product_id: product?.data?.product_id,
      attribute_id: attribute.attributeId,
      language_id: 1,
    }));

    mutate({
      url: PRODUCT_ATTRIBUTES_URL,

      headers: {
        "Content-Type": "application/json",
      },
      onFinish: () => {},
      formData,
    });
  };

  return (
    <Card className="flex flex-col justify-start items-start w-full h-fit rounded-sm">
      <CardHeader className="flex flex-row items-center w-full justify-between py-4">
        <CardTitle>Add Attributes</CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <AttributesList
          setAttributes={setAttributesFormFields}
          attributes={attributesFormFields?.length ? attributesFormFields : []}
        />
      </CardContent>

      <div className="flex justify-end items-center w-full py-4 px-4 gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setCurrentStep("other");
          }}
        >
          Back
        </Button>
        <Button
          disabled={
            !attributesFormFields.length ||
            isAction ||
            !product?.data?.product_id
          }
          onClick={onSave}
          type="button"
        >
          {isAction ? (
            <p className="flex justify-center items-center space-x-2">
              <Loader2 className=" h-5 w-5 animate-spin" />
              <span>Please wait</span>
            </p>
          ) : (
            <span>Save Attributes</span>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default AttributesTab;
