import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import qs from "qs";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";

import useDebounce from "@/hooks/useDebounce";

import { ATTRIBUTES_URL } from "@/utils/constants/urls";

import AttributeAutocomplete from "./AttributesAutocomplete"
import { Trash } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

const AttributesList = ({ attributes, setAttributes }) => {
  const [search, setSearch] = useState(null)
  const axiosPrivate = useAxiosPrivate()
  const debouncedSearchValue = useDebounce(search, 1500)
  const {t} = useTranslation()

  const [isOpen, setIsOpen] = useState(false);

  const fetchAdminProductsAttributes = async () => {
    let searchKeyObject = {};
    searchKeyObject = Object.fromEntries(
      Object.entries({
        name: debouncedSearchValue ? debouncedSearchValue : null,

        // eslint-disable-next-line no-unused-vars
      }).filter(([_, value]) => value !== undefined && value !== null)
    );
    return axiosPrivate.get(ATTRIBUTES_URL, {
      params: { ...searchKeyObject },
      paramsSerializer: (params) => qs.stringify(params, { encode: false }),
    });
  };

  const { data: adminAttributes } = useQuery({
    queryKey: ["Attributes", debouncedSearchValue],
    queryFn: () => fetchAdminProductsAttributes(),
  });

  // handle add attribute
  const handleAddAttribute = () => {
    const updatedAttributes = [
      ...attributes,
      {
        productId: "",
        attributeId: "",
        attributeName: "",
        englishText: "",
        arabicText: "",
      },
    ];
    setAttributes(updatedAttributes);
  };

  // handle remove attribute
  const handleRemoveAttribute = (index) => {
    const updatedAttributes = [...attributes];
    updatedAttributes.splice(index, 1);
    setAttributes(updatedAttributes);
  };

  // handle attribute values change
  const handleChangeAttribute = (index, field, value, nameField, nameValue) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index][field] = value;
    if (nameField) {
      updatedAttributes[index][nameField] = nameValue;
    }
    setAttributes(updatedAttributes);
  };

  return (
    <div className="flex flex-col justify-start rtl:items-end items-start space-y-4 px-1 py-1">
      {attributes.map((attribute, index) => (
        <div
          key={attribute.attributeId}
          className="flex justify-start items-center rtl:flex-row-reverse gap-4 w-full flex-wrap"
        >
          <Input
            placeholder={t("Arabic Text")}
            value={attribute.arabicText}
            onChange={(e) =>
              handleChangeAttribute(index, "arabicText", e.target.value)
            }
            className="w-full md:w-3/12"
          />
          <Input
            placeholder={t("English Text")}
            value={attribute.englishText}
            onChange={(e) =>
              handleChangeAttribute(index, "englishText", e.target.value)
            }
            className="w-full md:w-3/12"
          />

          <AttributeAutocomplete
            search={search}
            setSearch={setSearch}
            attributeId={attribute.attributeId}
            attributeName={attribute.attributeName}
            attributes={adminAttributes?.data?.results}
            index={index}
            onSelect={handleChangeAttribute}
          />

          <Button
            onClick={() => handleRemoveAttribute(index)}
            variant="destructive"
            size="icon"
            className="w-1/12 h-10"
            type="button"
          >
            <Trash className=" h-4 w-4 shrink-0 " />
          </Button>
        </div>
      ))}

      <Button className={cn('w-fit',!attributes.length&&'w-full')} type="button" onClick={handleAddAttribute}>
        {t("Add")} {!attributes.length&&'Attribute'}
      </Button>
    </div>
  );
};

export default AttributesList;
