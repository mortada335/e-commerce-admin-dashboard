import Text from "@/components/layout/text";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const OrderPaymentMethod = ({ method, className }) => {
  const { t } = useTranslation()
  return (
    <Text
      text={t(method)}
      className={cn(
        "text-left uppercase rounded-md !py-1 w-fit ",
        method === "APS" || method === "PayTabs Express Checkout"
          ? "bg-blue-500 py-2 px-2 text-white "
          : method === "Zain cash"
          ? "bg-violet-500 py-2 px-2 text-white"
          : "",
        className
      )}
    />
  );
};

export default OrderPaymentMethod;
