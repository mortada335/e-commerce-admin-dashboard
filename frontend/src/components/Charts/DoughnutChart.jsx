import { Doughnut } from 'react-chartjs-2';

import {Chart as ChartJS,Title, Tooltip, Legend, ArcElement, CategoryScale} from 'chart.js'
import { cn } from '@/lib/utils';

ChartJS.register(
  Title, Tooltip, Legend, ArcElement, CategoryScale
)

const DoughnutChart = ({className,options,data}) => {
  return (
    
    <Doughnut className={cn('size-[250px]',className)} options={options} data={data}></Doughnut>
  )
}

export default DoughnutChart