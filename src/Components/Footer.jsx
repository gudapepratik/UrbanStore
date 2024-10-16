import React from 'react'
import { footerimg } from '../assets/asset'
import { NavLink } from 'react-router-dom'
import { RiArrowRightLine, RiForward30Line } from '@remixicon/react'
import FooterList from './Footer/FooterList'
function Footer() {
  return (
    <>
        <div className=' w-full'>
            <div>
                <img src={footerimg} alt="" />
            </div>

            <div className='w-full h-72 '>

                <div className=' w-full pt-16 flex justify-evenly items-start'>
                    <FooterList label={'Help & Information'} links={['Track Order','Delivery & Returns','Express Delivery','FAQs']}/>
                    <FooterList label={'About UrbanStore'} links={['About us','Career','Corporate','Investors']}/>
                    <FooterList label={'Online Shop'} links={['Shoes','Jackets','Kids Wear','Handbags']}/>
                    <FooterList label={'Language'} links={['English']} navclassName= {'flex items-center gap-2'} symbolname='rightarrow'/>
                    <FooterList label={'Currency'} links={['INR']} navclassName= {'flex items-center gap-2'} symbolname='rightarrow'/>
                </div>
            </div>

            <div className='w-full h-14 border-t-[2px] '>
                <div className='w-full h-full flex items-center justify-between px-5'>
                    <ul>
                        <h3 className='font-DMSans'>© 2024 <span className='font-extrabold'>UrbanStore</span> All Rights Reserved</h3>
                    </ul>

                    {/* <ul>
                        <h3 className='font-DMSans'>Made with ❤️ by Pratik</h3>
                    </ul> */}

                    <ul className='gap-2 flex font-DMSans text-zinc-400 '>
                            <li className='hover:text-zinc-500'>
                                <NavLink>
                                    Privacy Policy
                                </NavLink>
                            </li>
                            <li className='hover:text-zinc-500'>
                                <NavLink>
                                    Terms Of Use
                                </NavLink>
                            </li>
                    </ul>
                </div>
            </div>
        </div>
    
    </>
  )
}

export default Footer