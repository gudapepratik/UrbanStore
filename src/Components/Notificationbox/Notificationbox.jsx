import React, { useEffect, useState } from 'react'

function Notificationbox({type = "",message = ""}) {
    const [isslidein,SetIsSlideIn] = useState(false)

    useEffect(() => {
      
        initNotify()  
    },[])

    const initNotify = () => {
      setTimeout(() => {
        SetIsSlideIn(prev => !prev)
      }, 1000);
    }
   
  return ( 
    <div className='w-full h-full overflow-hidden absolute'>
        <div className={`flex absolute ${isslidein? "translate-x-0": "translate-x-full" } delay-200 ease-in-out transition-all  overflow-hidden z-50 top-8 right-0 w-72 h-12 border-[1px] ${type === 'success' ? "border-green-500":"border-red-500"} rounded-md  bg-opacity-90 backdrop-blur-lg shadow-md`}>
            <div className={`w-full h-full shadow-inner flex items-center gap-2 ${type === 'success' ? "bg-green-100":"bg-red-100"} `}>
                    <h2 className={`font-poppins  font-bold text-base text-white w-20 ${type === 'success' ? "bg-green-500":"bg-red-500"}  justify-center flex items-center h-full`}>{type}</h2>
                    <h4 className={`font-poppins text-xs  text-zinc-600 ${type === 'success' ? "text-green-500":"text-red-500"}`}>{message}</h4>
            </div>
        </div>
    </div>
  )
}

export default Notificationbox