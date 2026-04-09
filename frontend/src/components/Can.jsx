import { useHomeStore } from "@/pages/home/store";
import { checkPermissions } from "@/utils/methods";

const Can = ({ children, permissions = [], isPublic= false }) => {
  const { userPermissions } = useHomeStore();

  const hasPermission = checkPermissions(userPermissions, permissions);

  return  hasPermission || isPublic ? children : null;
};

export default Can;
