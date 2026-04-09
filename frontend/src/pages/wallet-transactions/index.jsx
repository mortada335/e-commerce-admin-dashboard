
import WalletTransactionData from './components/WalletTransactionData'
import CanSection from '@/components/CanSection'

const WalletTransactionPage = () => {
  return (
        <CanSection permissions={["app_api.view_currencyexchange"]}>

          <WalletTransactionData/>
        </CanSection>
  )
}

export default WalletTransactionPage