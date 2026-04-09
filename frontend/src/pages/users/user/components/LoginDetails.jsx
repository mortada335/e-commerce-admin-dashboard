import HeaderText from "@/components/layout/header-text"
import Text from "@/components/layout/text"

import { Card, CardHeader } from "@/components/ui/card"
import { formatFullDate } from "@/utils/methods"
import { useTranslation } from "react-i18next"

const LoginDetails = ({ userLoginDetails }) => {
  const {t} = useTranslation()
  return (
    <Card className="flex flex-col justify-start items-center w-full h-full px-4 py-4 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-fit place-content-center place-items-start gap-8 ">
        <Card className="w-full ">
          <CardHeader className="py-2 ">
            <HeaderText className={"lg:text-lg"} text={t("Operating System")} />
            <Text text={userLoginDetails?.operating_system || t("None")} />
          </CardHeader>
        </Card>
        <Card className="w-full ">
          <CardHeader className="py-2 ">
            <HeaderText className={"lg:text-lg"} text={t("Login Time")} />
            <Text text={formatFullDate(userLoginDetails?.login_time) || t("None")} />
          </CardHeader>
        </Card>
        <Card className="w-full ">
          <CardHeader className="py-2 ">
            <HeaderText className={"lg:text-lg"} text={t("Last Login Ip")} />
            <Text text={userLoginDetails?.last_login_ip || t("None")} />
          </CardHeader>
        </Card>
      </div>
    </Card>
  )
}

export default LoginDetails
