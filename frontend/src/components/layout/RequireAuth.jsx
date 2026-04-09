import { useLocation, Navigate, Outlet } from "react-router-dom";

import { useContext } from "react";
import { getCookieValue } from "@/utils/methods";
import { useAuthStore } from "@/pages/login/store";



const RequireAuth = () => {
    const {  accessToken} =useAuthStore()
  
    
  const location = useLocation();
  //check accessToken to persist login after refresh
  
  return accessToken ? (
    
  
      <Outlet />

  ) : (
    <Navigate to="/login" state={{ from: location }} replace={true} />
  );
};
export default RequireAuth;
