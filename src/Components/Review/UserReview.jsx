import { RiStarFill, RiStarHalfFill, RiUser2Fill, RiUserFill } from '@remixicon/react'
import React, { useEffect, useState } from 'react'
import { loginimg } from '../../assets/asset'
import { getTimeAgo } from '../../utils/DateParsers/DateParser'

function UserReview({reviewDetails}) {
    const [date, setDate] = useState("")

    useEffect(() => {
        setDate(getTimeAgo(reviewDetails.createdAt))
    },[])

  return (
    <div className='w-full flex border flex-col text-stone-800 p-5 gap-2 justify-start'>
        {/* Profile and ratings  */}
        <div className='w-full flex items-center justify-between'>
            {/* Customer profile  */}
            <div className='w-80%  flex gap-4'>   
                <div className='flex items-center justify-center h-10 w-10 bg-zinc-100 rounded-full'>
                    <RiUserFill className='text-zinc-300'/>
                </div>
                <div className='flex flex-col justify-start'>
                    <h1 className='font-bold'>{reviewDetails.customerInfo[0].name}</h1>
                    <h3 className='text-xs'>{date}</h3>
                </div>
            </div>

            {/* Ratings */}
            <div className="flex gap-1 scale-75 md:scale-100 text-rose-500">
                {[...Array(reviewDetails.rating)].map((_, index) => (
                    <RiStarFill key={index} />
                ))}
            </div>
        </div>

        {/* Review text  */}
        <div className='w-full'>
            <h2>{reviewDetails.review}</h2>
        </div>

        {/* Images section  */}
        {reviewDetails.imageUrls && (
            <div className='w-full flex gap-4'>
                {reviewDetails.imageUrls.map((item,key) => (
                    <div key={key} className='w-20 h-20 rounded-lg overflow-hidden hover:cursor-pointer'>
                        <img src={item.publicUrl} alt="image" className='object-contain'/>
                    </div>
                ))}
            </div>
        )}
    </div>
  )
}

export default UserReview