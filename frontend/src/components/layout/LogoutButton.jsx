import React, { useState } from 'react'
import { DropdownMenuItem } from '../ui/dropdown-menu'
import { Loader2, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next';
import { clearAccessToken,} from "@/pages/login/store";
import { clearPermissions,} from "@/pages/home/store";
import { axiosPrivate } from "@/api/axios";
import { useNavigate } from 'react-router-dom';
import { deleteCookieValue, handleError } from '../../utils/helpers';
const LogoutButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

   const [isAction, setIsAction] = useState(false);
    // const logout = async () => {
    //   try {
    //     setIsAction(true)
    //       await axiosPrivate.post(LOGOUT_URL, {
    //         headers: {
    //           Accept: "application/json",
    //         },
    //       })
  
    //     } catch (error) {
    //         setIsAction(false)
    //       handleError(error)
    //     }finally{
    //         setIsAction(false)
    //     }
  
    //     deleteCookieValue("accessToken")
    //   localStorage.removeItem("userPermissions");
    //   localStorage.removeItem("pwa_install_dismissed");
    //   navigate("/login");
    //   clearAccessToken();
    //   clearPermissions();
    // };
      const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userPermissions");
        localStorage.removeItem("user");
        navigate("/login");
        deleteCookieValue("accessToken");
        clearAccessToken();
        clearUserData();
        clearPermissions();
      };
  return (
    <DropdownMenuItem
    disabled={isAction}
    className="cursor-pointer px-4 hover:!bg-red-50"
    onClick={logout}
  >
    {isAction ? (
      <p className="flex justify-center items-center space-x-2">
        <Loader2 className=" h-5 w-5 animate-spin" />
        <span>{t("Please wait")}</span>
      </p>
    ) : (
      <p className="flex justify-center items-center space-x-2">
        <LogOut className="text-red-500 mr-2 h-4 w-4" />
        <span className="text-red-500">{t("Log out")}</span>
      </p>
    )}
  </DropdownMenuItem>
  )
}

export default LogoutButton