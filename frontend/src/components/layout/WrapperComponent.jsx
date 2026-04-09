import connectivity from "@/assets/images/illustrations/connectivity.svg";
import notFound from "@/assets/images/illustrations/not-found.svg";
import notAuth from "@/assets/images/illustrations/not-auth.svg";
import emptyState from "@/assets/images/illustrations/empty-state.svg";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "../ui/card";

import HeaderText from "./header-text";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { toast } from "sonner";

function WrapperComponent({
  isError,
  error,
  isLoading,
  loadingUI = <Skeleton className={"h-[400px] w-full"} />,
  isEmpty,
  emptyStateMessage = "You don't have any data",
  children,
}) {
  const { t } = useTranslation();
  useEffect(() => {
  if (isError && error) {
    const message =
      error?.response?.data?.message || error?.message || t("unknown_error");
      // t("unknown_error");
    toast.error(message, {
        style: {
        background: 'red',
        color: 'white',
      },
    });
  }
}, [isError, error, t]);
  return (
    <>
      {/* Slot for loading state */}
      {isLoading && loadingUI}

      {/* Slot for error handling */}
      {!isLoading && isError && (
        <div className="flex flex-col justify-center items-center w-full h-full space-y-4">
          {error?.response?.status === 403 ? (
            <Card className="flex flex-col justify-center items-center w-full h-full space-y-4">
              {notAuth && (
                <img
                  src={notAuth}
                  alt="Not Auth"
                  className="w-[300px] h-[300px]" 
                />
              )}
              <h3 className="text-center text-h5">{"not_auth"}</h3>
            </Card>
          ) : error?.response?.status === 404 ? (
            <Card className="flex flex-col justify-center items-center w-full h-full space-y-4 py-4">
              {notFound && (
                <img
                  src={notFound}
                  alt="Not Found"
                  className="w-[300px] h-[300px]"
                />
              )}
              <h3 className="text-center text-h5">{t("not_found")}</h3>
            </Card>
          ) : error?.response?.status === 500 ? (
            <Card className="flex flex-col justify-center items-center w-full h-full space-y-4 py-4">
              {notFound && (
                <img
                  src={connectivity}
                  alt="Connectivity"
                  className="w-[300px] h-[300px]"
                />
              )}
              <h3 className="text-center text-h5">{t("unknown_error")}</h3>
            </Card>
          ) : (
            <Card className="flex flex-col justify-center items-center w-full h-full space-y-4">
              {connectivity && (
                <img
                  src={connectivity}
                  alt="Connectivity"
                  className="w-[300px] h-[300px]"
                />
              )}
              <h3 className="text-center text-h5">{t(error.message || "")}</h3>
            </Card>
          )}
        </div>
      )}

      {/* Main content slot */}
      {!isLoading &&
        !isError &&
        (isEmpty ? (
          <Card className="flex flex-col justify-start border-none items-center w-full h-full pb-8 space-y-4">
            {" "}
            <img src={emptyState} alt="" className="size-auto object-cover " />
            <HeaderText
              className="!font-light !text-[#7b809a] !text-md"
              text={t(emptyStateMessage || "")}
            />
          </Card>
        ) : (
          children
        ))}
    </>
  );
}

export default WrapperComponent;
