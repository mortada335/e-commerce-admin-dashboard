import Orders from "../orders-v1"


const OrdersPayment = () => {
  return (
    <Orders queryKey='OrdersPayment'  isOrdersPaymentPage={true} />
  )
}

export default OrdersPayment