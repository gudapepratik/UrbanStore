import React, { useEffect } from 'react'

function SizeSelector({sizes,setSelectedSize,selectedSize}) {

    const handleToggle = (sizeObj) => {
        setSelectedSize(prev => prev.size === sizeObj.size ? {}: sizeObj)
    }
    // useEffect(() => {
    //     console.log(selectedSize)
    // },[selectedSize])

    return (
        <>
            <div className="flex gap-2">
                {sizes.map((item,key) => (
                    <div 
                        key={key} 
                        className={`w-10 h-10 flex items-center justify-center font-poppins ${item?.quantity === 0 ? "pointer-events-none opacity-50" : ""} ${selectedSize?.size === item?.size? "": "hover:bg-zinc-200"} ${selectedSize?.size === item?.size? "bg-rose-500": "bg-white"} ${selectedSize?.size === item?.size? "text-white": "text-zinc-900"} ${selectedSize?.size === item?.size? "": "border-zinc-300 border-[1px]"} duration-100 rounded-sm cursor-pointer `}
                        onClick={() => handleToggle(item)}
                        >
                        {item?.size}
                    </div>
                ))}
            </div>
        </>
    )
}

export default SizeSelector