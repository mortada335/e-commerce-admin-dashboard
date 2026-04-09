import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate"
import { CATEGORIES_URL } from "@/utils/constants/urls"
import { useQuery } from "@tanstack/react-query"
import { useParams, useNavigate } from "react-router-dom"

import WrapperComponent from "@/components/layout/WrapperComponent"

import Text from "@/components/layout/text"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"
import OnDeleteDialog from "@/components/Dialogs/OnDelete"
import { setIsDeleteCategoryDialogOpen, useCategoryStore } from "../../store"
import { Badge } from "@/components/ui/badge"

import { cn } from "@/lib/utils"
import Categories from "../.."
import { Separator } from "@/components/ui/separator"
import Can from "@/components/Can"
import { useTranslation } from "react-i18next"

const BasicInfoTab = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, i18n} = useTranslation()
  const axiosPrivate = useAxiosPrivate()
  const { isDeleteCategoryDialogOpen } = useCategoryStore()
  const GetCategoryById = async (id) => {
    return axiosPrivate.get(`${CATEGORIES_URL}${id}/`)
  }

  const {
    data: category,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["Category"],
    queryFn: () => GetCategoryById(id),
    enabled: !!id,
  })

  return (
    <Card className="flex flex-col justify-start items-center w-full h-full space-y-4">
      <WrapperComponent
        isEmpty={!category?.data?.category_id}
        isError={isError}
        error={error}
        isLoading={isLoading}
        loadingUI={
          <div className="flex justify-center items-center space-x-2 h-[450px] w-full">
            <Loader2 className=" h-5 w-5 animate-spin" />
            <span>{t("Please wait")}</span>
          </div>
        }
        emptyStateMessage="Category not found"
      >
        <div className="flex flex-col md:flex-row place-content-center place-items-start w-full">
          <div className="flex flex-col justify-start items-center py-4 w-full">
            {category?.data?.image ? (
              <img
                src={category?.data?.image}
                alt=""
                className="w-[75%] h-[300px] object-center rounded-sm border"
              />
            ) : (
              <div className="w-[75%] h-[300px] bg-accent rounded-sm"></div>
            )}
          </div>

          {/* Info */}
          <div
            className="flex flex-col justify-start items-start space-y-4 w-full h-full py-4 px-4"
            dir={i18n.dir()}
          >
            <div className="flex justify-between items-start w-full">
              <CardHeader className="py-0 px-0">
                <CardTitle className="!font-normal !text-2xl">
                  {category?.data?.description.at(1)?.name}{" "}
                </CardTitle>
                <CardDescription>
                  {t("Description in arabic")}:{" "}
                  {category?.data?.description.at(0)?.description}
                </CardDescription>
                <CardDescription>
                  {t("Name in english")}: {category?.data?.description.at(0)?.name}
                </CardDescription>
                <CardDescription>
                  {t("Description in english")}:{" "}
                  {category?.data?.description.at(0)?.description}
                </CardDescription>
              </CardHeader>

              <Can permissions={["app_api.delete_occategory"]}>
                <Button
                  onClick={() => setIsDeleteCategoryDialogOpen(true)}
                  type="button"
                  variant="destructive"
                  size="icon"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Can>
            </div>

            <div
              className={`flex justify-start items-center w-full ${i18n.dir() === "rtl" ? "space-x-reverse space-x-1" : "space-x-1"
                }`}
            >
              <Text text={t("Order") + ":"} />
              <span className="font-semibold text-sm">
                {category?.data?.sort_order}
              </span>
            </div>

            <div
              className={`flex justify-start items-center w-full ${i18n.dir() === "rtl" ? "space-x-reverse space-x-1" : "space-x-1"
                }`}
            >
              <Text text={t("Color") + ":"} />
              <span className="font-semibold text-sm">
                <div
                  className="w-full py-[2px] rounded-sm text-center text-xs px-2 text-white"
                  style={{ backgroundColor: category?.data?.category_color }}
                >
                  {category?.data?.category_color}
                </div>
              </span>
            </div>

            <div
              className={`flex justify-start items-center w-full ${i18n.dir() === "rtl" ? "space-x-reverse space-x-1" : "space-x-1"
                }`}
            >
              <Text text={t("Status") + ":"} />
              <span className="font-semibold text-sm">
                <Badge
                  className={cn(
                    "rounded-sm",
                    category?.data?.status === 1
                      ? "bg-[#A1FFEE] text-[#127462]"
                      : "bg-red-500 text-white"
                  )}
                  variant={
                    category?.data?.status === 1 ? "success" : "destructive"
                  }
                >
                  {category?.data?.status === 1 ? t("Enabled") : t("Disable")}
                </Badge>
              </span>
            </div>
          </div>
        </div>
        <Separator />
        <Categories parentId={category?.data?.category_id} />
      </WrapperComponent>

      <OnDeleteDialog
        name={"Categories"}
        heading={t("Are you absolutely sure?")}
        description={t('This action cannot be undone. This will permanently delete this Category.')}
        url={CATEGORIES_URL}
        id={category?.data?.category_id}
        isDialogOpen={isDeleteCategoryDialogOpen}
        setIsDialogOpen={setIsDeleteCategoryDialogOpen}
        onFinish={() => {
          navigate("/catalog/categories")
        }}
      />
    </Card>
  )
}

export default BasicInfoTab
