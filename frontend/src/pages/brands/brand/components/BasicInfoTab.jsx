import {
  Card,
  
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate"
import { BRAND_URL,  } from "@/utils/constants/urls"
import { useQuery } from "@tanstack/react-query"
import { useParams, useNavigate } from "react-router-dom"

import WrapperComponent from "@/components/layout/WrapperComponent"

import Text from "@/components/layout/text"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"
import OnDeleteDialog from "@/components/Dialogs/OnDelete"
import { setIsDeleteDialogOpen, useBrandStore } from "../../store"
import { Badge } from "@/components/ui/badge"

import { cn } from "@/lib/utils"
import Can from "@/components/Can"


const BasicInfoTab = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()
  const { isDeleteBrandDialogOpen } = useBrandStore()
  const GetBrandById = async (id) => {
    return axiosPrivate.get(`${BRAND_URL}${id}/`)
  }

  const {
    data: brand,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["Brand"],
    queryFn: () => GetBrandById(id),
    enabled: !!id,
  })

  return (
    <Card className="flex flex-col justify-start items-center w-full h-full space-y-4 mb-36">
      <WrapperComponent
        isEmpty={!brand?.data?.manufacturer_id}
        isError={isError}
        error={error}
        isLoading={isLoading}
        loadingUI={
          <div className="flex justify-center items-center space-x-2 h-[450px] w-full">
            <Loader2 className=" h-5 w-5 animate-spin" />
            <span>Please wait</span>
          </div>
        }
        emptyStateMessage="Brand not found"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 place-content-center place-items-start w-full">
          <div className="flex flex-col justify-start items-center py-4 w-full">
            {brand?.data?.image ? (
              <img
                src={brand?.data?.image}
                alt=""
                className="w-[75%] h-[300px] object-center rounded-sm border"
              />
            ) : (
              <div className="w-[75%] h-[300px] bg-accent rounded-sm"></div>
            )}
          </div>
          {/* Info */}
          <div className="flex flex-col justify-start items-start space-y-4  w-full h-full py-4 px-4">
            <div className="flex justify-between  items-start  w-full">
              <CardHeader className="py-0 px-0">
                <CardTitle className="!font-normal !text-2xl">
                  {brand?.data?.name}{" "}
                </CardTitle>
               
              </CardHeader>
              <Can permissions={[ "app_api.delete_ocmanufacturer"]}>

              <Button
                onClick={() => {
                  setIsDeleteDialogOpen(true)
                }}
                type="button"
                variant="destructive"
                size="icon"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
              </Can>
            </div>

            {/* Order */}
            <div className="flex justify-start space-x-1 items-center  w-full">
              <Text text={"Order:"} />
              <span className="font-semibold text-sm">
                {brand?.data?.sort_order}
              </span>
            </div>
           
            {/* status */}
            <div className="flex justify-start space-x-1 items-center  w-full">
              <Text text={"Status:"} />
              <span className="font-semibold text-sm">
                <Badge
                  className={cn(
                    " rounded-sm",
                    brand?.data?.enabled 
                      ? "bg-[#A1FFEE] text-[#127462]"
                      : "bg-red-500 text-white "
                  )}
                  variant={
                    brand?.data?.enabled  ? "success" : "destructive"
                  }
                >
                  {brand?.data?.enabled ? "Enabled" : "Disable"}
                </Badge>
              </span>
            </div>
          </div>
        </div>
      
      
      </WrapperComponent>

      <OnDeleteDialog
        name={"Brands"}
        heading={"Are you absolutely sure?"}
        description={`This action cannot be undone. This will permanently delete this Brand.`}
        url={BRAND_URL}
        id={brand?.data?.manufacturer_id}
        isDialogOpen={isDeleteBrandDialogOpen}
        setIsDialogOpen={setIsDeleteDialogOpen}
        onFinish={() => {
          navigate("/catalog/brands")
        }}
      />
    </Card>
  )
}

export default BasicInfoTab
