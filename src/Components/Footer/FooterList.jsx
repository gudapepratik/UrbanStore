import { RiArrowRightLine } from '@remixicon/react'
import React, {useState} from 'react'
import { NavLink } from 'react-router-dom'

function FooterList({
    label,
    links = [],
    symbolname = '',
    navclassName = '',
}) {


  return (
    <>
        <div className='flex gap-3 flex-col items-start'>
            <h3 className='font-DMSans font-bold text-[1.1rem]'>{label}</h3>
            <ul className='gap-2 flex flex-col font-DMSans text-zinc-400 '>

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