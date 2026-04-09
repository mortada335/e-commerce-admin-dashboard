import { cn } from '@/lib/utils'

import { Link } from 'react-router-dom'

const Relation = ({children,to,classname}) => {
  return (
    <Link to={to} className={cn('hover:text-blue-500 text-nowrap',classname)}>
      {children}
    </Link>
  )
}

export default Relation