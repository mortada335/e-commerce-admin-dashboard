import { iraqCities } from '@/pages/orders/store';
import  { useMemo } from 'react'
import Text from './layout/text';
import { cn } from '@/lib/utils';

const Governorate = ({postcode,className}) => {
        const governorate = useMemo(() => {
          return iraqCities.find((item) =>
            String(item.postcode)===String(postcode)
          );
        }, [postcode]);
    
    
  return (
    <p className={cn('text-base',className)} >
{governorate?.name_ar||''}
    </p>
  )
}

export default Governorate