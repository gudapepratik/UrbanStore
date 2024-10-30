import { RiArrowRightLine } from '@remixicon/react'
import React, {useRef, useState} from 'react'
import { NavLink } from 'react-router-dom'

function FooterList({
    label,
    links = [],
    symbolname = '',
    navclassName = '',
}) {
    const [toshow,SetToShow]  = useState(false)
    const handleresponse = () => {
        SetToShow(prev => !prev)
    }

  return (
    <>
        <div className='flex gap-3 flex-col items-start'>
            <h3 
            onClick={handleresponse}
            className='font-DMSans font-bold md:text-[1.1rem]  selection:bg-none cursor-pointer md:cursor-none'>{label}</h3>
            <ul className={`gap-2 flex-col font-DMSans ${toshow? "flex": "hidden"} md:flex text-zinc-400 `}>

                {
                    links && links.length > 0? 
                    links.map((link,index) => (
                        <li key={index} className='hover:text-zinc-500'>
                                <NavLink className={`${navclassName}`}>
                                    {link} {symbolname === 'rightarrow'? <RiArrowRightLine size={12}/> : null}
                                </NavLink>
                        </li>
                    ))
                    : <li>No links</li>
                }
            </ul>
        </div>
    
    </>
  )
}

export default FooterList