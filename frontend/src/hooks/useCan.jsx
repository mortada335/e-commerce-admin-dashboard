
import { useHomeStore } from "@/pages/home/store"
import { checkPermissions } from "@/utils/methods";

export default function useCan(permissions) {
  const { userPermissions } = useHomeStore();
  
  const hasPermission = userPermissions?.length? checkPermissions(userPermissions, permissions):false;

  return  hasPermission


}
