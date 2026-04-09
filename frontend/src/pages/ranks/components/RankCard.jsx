import {  CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { EllipsisVertical, SquarePen, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// Images
import pattern from "@/assets/images/illustrations/CreditCard.svg"
import Can from "@/components/Can"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
// import masterCardLogo from "@/assets/images/logos/mastercard.png"

const RankCard = ({
  rank,
  setIsDeleteDialogOpen,
  setIsSelectedRank,
  setIsRankDialogOpen,
  canEdit = true,
  userCurrentPoints = null,
  language="1",
  className=''
}) => {
  const onDelete = () => {
    setIsDeleteDialogOpen(true)
    setIsSelectedRank(rank)
  }
  const onUpdate = () => {
    setIsRankDialogOpen(true)
    setIsSelectedRank(rank)
  }
  const {t} = useTranslation()
  return (
    <div className={cn("w-full h-[300px] relative rounded-md",className)}>
      <img
        src={pattern}
        alt={""}
        className="w-full h-full object-cover rounded-md "
      />

      <CardHeader className="px-6 py-6 absolute inset-x-0 top-0 flex flex-row justify-end items-center">
      {userCurrentPoints !== null && (
          <div className="flex flex-col justify-start items-center">
            <h3 className="text-[#C0C0C1]  font-medium text-sm">
              {t("Current Points")}
            </h3>
            <p className="text-white font-semibold text-base">
              {" "}
              {userCurrentPoints}
            </p>
          </div>
        )}
        {canEdit && (
          <Can permissions={["app_api.change_userrank","app_api.delete_userrank"]}>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" className="h-8 w-8 p-0 ">
                <span className="sr-only">{t("Open menu")}</span>
                <EllipsisVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>

              <DropdownMenuSeparator />

              <Can permissions={["app_api.change_userrank"]}>

              <DropdownMenuItem   className="flex justify-start items-center space-x-2" onClick={onUpdate}><SquarePen size={16} /> <span>{t("Edit")}</span>{" "}</DropdownMenuItem>
              </Can>
              <Can permissions={["app_api.delete_userrank"]}>

              <DropdownMenuItem className="flex justify-start items-center space-x-2 text-red-500" onClick={onDelete}> <Trash size={16} className="" /> <span>{t("Delete")}</span></DropdownMenuItem>
              </Can>
            </DropdownMenuContent>
          </DropdownMenu>
          </Can>
        )}
      </CardHeader>
      <CardContent className="px-6 py-0 absolute inset-x-0 top-[40%] space-x-4 text-3xl text-white font-semibold  capitalize">
        {rank?.rank_name?.at(Number(language))?.rank_name}
      </CardContent>

      <CardFooter className="py-4 px-6 flex justify-between items-center  absolute  inset-x-0 bottom-9 xl:bottom-7 ">
        {/* <div className="flex flex-col justify-start items-start">
          <h3 className="text-[#C0C0C1]  font-medium text-sm">Rank Name</h3>
          <p className="text-white font-semibold text-base capitalize">
            {" "}
            {rank?.rank_name?.at(0)?.rank_name}
          </p>
        </div> */}
        <div className="flex flex-col justify-start items-start">
          {/* <h3 className="text-[#C0C0C1]  font-medium text-sm">Range</h3> */}
          <p className="text-white font-semibold text-base">
            {" "}
            {rank?.min_points} - {rank?.max_points}
          </p>
        </div>
      
        {/* <img
          src={masterCardLogo}
          alt={""}
          className="w-12 h-fit object-cover rounded-sm bg-foreground"
        /> */}
        {/* <Wifi color="white" size={20} /> */}
      </CardFooter>
    </div>
  )
}

export default RankCard
