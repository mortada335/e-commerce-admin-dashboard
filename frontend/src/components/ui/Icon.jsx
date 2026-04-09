

import  { lazy, Suspense } from 'react';

import dynamicIconImports from 'lucide-react/dynamicIconImports';

const fallback = <div style={{ background: '#ddd', width: 24, height: 24 }}/>



const Icon = ({ name, ...props }) => {
    
  const LucideIcon = lazy(dynamicIconImports[name]);

  return (
    
        name? (  <Suspense fallback={fallback}>
          <LucideIcon {...props} />
        </Suspense>):(

            <fallback/>
        )

    
  );
}

export default Icon