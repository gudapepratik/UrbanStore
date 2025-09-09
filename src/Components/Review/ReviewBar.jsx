import { RiStarFill } from '@remixicon/react'
import React, { useEffect } from 'react'

function ReviewBar({stars, count, total}) {
    let x = (count/total)*100;

  return (
    <div className='w-full font-DMSans scale-95 md:scale-100 text-zinc-800 flex gap-4 items-center'>
        
        <div className=''>
            <h3 className='text-xl flex gap-1 text-right w-10 justify-between items-center font-bold'>{stars} <RiStarFill className='text-rose-500'/></h3>
        </div>

        {/* bar  */}
        <div className='w-[90%]  h-2 bg-blue-300 rounded-full'>
            <div style={{ width: `${x}%` }} className={`bg-blue-500 h-full rounded-full`}>
            </div>
        </div>

        {/* review count  */}
        <div>
            <h1 className='font-bold text-lg text-left w-10'>{count}</h1>
        </div>
    </div>
  )
}

export default ReviewBar