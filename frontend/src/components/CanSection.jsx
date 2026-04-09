import { useHomeStore } from "@/pages/home/store";
import { checkPermissions, checkOnePermissions } from "@/utils/methods";
import { Navigate, useLocation } from "react-router-dom";
import WrapperComponent from "@/components/layout/WrapperComponent";
import { Skeleton } from "@/components/ui/skeleton";

const CanSection = ({ children, permissions = [], requireAll = true }) => {
  const { userPermissions } = useHomeStore();
  const location = useLocation();

  // Determine permission logic
  const hasPermission = requireAll
    ? checkPermissions(userPermissions, permissions)
    : checkOnePermissions(userPermissions, permissions);

  const isLoading = !userPermissions; // Handle cases before store is populated
  const isEmpty = !userPermissions?.length;

  return (
    <WrapperComponent
      isEmpty={isEmpty}
      isError={false}
      error={null}
      isLoading={isLoading}
      loadingUI={
        <div className="flex flex-col px-8 py-8 w-full h-full">
          <Skeleton className="w-full h-full" />
        </div>
      }
      emptyStateMessage={"You don't have any permissions"}
    >
      {hasPermission ? (
        children
      ) : (
        <Navigate
          to="/not-authorize"
          state={{ from: location }}
          replace={true}
        />
      )}
    </WrapperComponent>
  );
};

export default CanSection;
