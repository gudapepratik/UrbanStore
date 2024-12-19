import React from 'react'
// trial imports
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function OrderCardSkeleton({howmany}) {
  return (
    <>
      <div className='w-full '>

      <SkeletonTheme baseColor="#f5f5f5" highlightColor="#e8e6e6">
        <div className='w-full flex items-center gap-2 p-2 border-[1px] border-[#e8e6e6]'>
          {/* image section left  */}
          <div className='w-32 '>
            <Skeleton className='w-24 h-36'/>
          </div>

          {/* right section -details  */}
          <div className='flex w-full flex-col gap-1 justify-start'>
            {/* brand name and title section  */}
            <div className='flex w-full flex-col justify-start'>
            
              <div className='flex w-full justify-between'>
                <Skeleton width={200} height={20} />
              </div>
              <Skeleton width={300} height={20} />
            </div>

            {/* price and quantity  */}
            <div className='flex w-full justify-between'>
            <Skeleton width={100} height={20} />
            <Skeleton width={200} height={20} />
            </div>

            {/* placed on and paymnet method  */}
            <div className='flex w-full justify-between'>
            <Skeleton width={200} height={20} />
            <Skeleton width={200} height={20} />
            </div>

            {/* orderStatus and cancel order button  */}
            <div className='flex w-full justify-between items-start'>
            <Skeleton width={200} height={20} />
            <Skeleton width={100} height={20} />
            </div>

          </div>
        </div>
        </SkeletonTheme>
      </div>
      
    </>
  )
}

export default OrderCardSkeleton