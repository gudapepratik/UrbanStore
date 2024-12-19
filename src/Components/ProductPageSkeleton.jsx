import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


function ProductPageSkeleton() {
  return (
    <>
        <SkeletonTheme baseColor="#f5f5f5" highlightColor="#e8e6e6">
            <div className='md:w-80 md:h-auto w-44 relative'>
                    <Skeleton className='w-full h-64 md:h-72'/>
                <div className=' w-full '>
                    <div className='flex w-full flex-col '>
                        <Skeleton/>
                    </div>
                        <div className='w-full flex justify-between'>
                            <Skeleton className='w-20 md:w-40 h-4'/>
                            <Skeleton className='w-10 h-7 md:h-10'/>
                        </div>
                </div>
            </div>
        </SkeletonTheme>
    </>
  )
}

export default ProductPageSkeleton




