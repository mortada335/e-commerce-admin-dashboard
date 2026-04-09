import { Bar } from 'react-chartjs-2';

import {Chart as ChartJS,Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale} from 'chart.js'
import { cn } from '@/lib/utils';

ChartJS.register(
  Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale
)

const BarGraph = ({className,options,data}) => {
  return (
    
    <Bar className={cn('size-[500px]',className)} options={options} data={data}></Bar>
  )
}

export default BarGraph