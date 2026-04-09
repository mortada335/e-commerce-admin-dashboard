import Text from '@/components/layout/text'
import { cn } from '@/lib/utils'


const OrderPaymentMethod = ({method}) => {
  return (
    <Text
    text={
      method
    }
    className={cn("text-left uppercase rounded-md !py-1 w-fit !px-3", method=== "APS" || method=== "PayTabs Express Checkout"  ? 'bg-blue-500 py-2 px-2 text-white' : method=== "Zain cash" ? 'bg-violet-500 py-2 px-2 text-white' :''   )}
  />
  )
}

export default OrderPaymentMethod