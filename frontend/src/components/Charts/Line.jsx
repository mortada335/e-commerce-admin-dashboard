import { Line } from 'react-chartjs-2';

import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend} from 'chart.js'
import { cn } from '@/lib/utils';

ChartJS.register(
    CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend
)

const LineGraph = ({className,options,data}) => {
  return (
    
    <Line className={cn('size-[500px]',className)} options={options} data={data}></Line>
  )
}

export default LineGraph