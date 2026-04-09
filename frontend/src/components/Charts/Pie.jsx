import { Pie } from 'react-chartjs-2';

import {Chart as ChartJS,Title, Tooltip, Legend, ArcElement, CategoryScale} from 'chart.js'

ChartJS.register(
  Title, Tooltip, Legend, ArcElement, CategoryScale
)

const PieGraph = ({options,data}) => {
  return (
    
    <Pie options={options} data={data}></Pie>
  )
}

export default PieGraph