import OnDeleteDialog from "@/components/Dialogs/OnDelete"
import HeaderText from "@/components/layout/header-text"
import Text from "@/components/layout/text"
import { Card } from "@/components/ui/card"
import { PRODUCT_ATTRIBUTES_URL } from "@/utils/constants/urls"
import { setDeleteAttribute, setIsDeleteAttributeDialogOpen, useProductStore } from "../../store"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Can from "@/components/Can"
import { useState } from "react"

const AttributesCard = ({ attribute = {}, productId }) => {


  const handleDelete=()=>{
 
      console.log(attribute)
      setDeleteAttribute(attribute)
      setIsDeleteAttributeDialogOpen(true)
    
  }
  return (
    <div className="flex flex-col justify-start items-center w-full">
      <Card className="relative flex w-full h-full flex-col justify-center items-start bg-[#262626] space-y-2 rounded-b-md px-8 py-4 ">
        <HeaderText
          className={"!text-white text-base font-normal"}
          text={attribute?.attributes_data?.attributes_group}
        />
        <div className="flex justify-start items-center space-x-1 w-full">
          <Text
            className={"text-gray-400 w-fit"}
            text={`${attribute?.attributes_data?.key} :`}
          />
          <Text
            className={"text-white w-fit"}
            text={attribute?.attributes_data?.value}
          />
        </div>
        <Can permissions={[  "app_api.delete_ocproductattribute"]}>

        <Button
          size="icon"
          variant="destructive"
          className="absolute top-0 right-2 rounded-full w-8 h-8"
          onClick={handleDelete}
        >
          <Trash2 size={16} />
        </Button>
        </Can>
        
      </Card>
    </div>
  )
}

export default AttributesCard
