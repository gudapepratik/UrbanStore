import React from 'react'
import { footerimg } from '../assets/asset'
import { NavLink } from 'react-router-dom'
import { RiArrowRightLine, RiForward30Line } from '@remixicon/react'
import FooterList from './Footer/FooterList'

function Footer() {
  return (
    <>
      <div className="w-full">
        <div className="w-full">
          <img src={footerimg} alt="" className="w-full h-12 md:h-14 object-cover" />
        </div>

        <div className="w-full h-auto lg:h-72">
          <div className="w-full py-10  md:pt-16 items-center md:px-10 flex flex-col md:flex-row md:justify-between md:items-start space-y-8 md:space-y-0 md:space-x-6 lg:space-x-10">
            <FooterList
              label={'Help & Information'}
              links={['Track Order', 'Delivery & Returns', 'Express Delivery', 'FAQs']}
            />
            <FooterList
              label={'About UrbanStore'}
              links={['About us', 'Career', 'Corporate', 'Investors']}
            />
            <FooterList
              label={'Online Shop'}
              links={['Shoes', 'Jackets', 'Kids Wear', 'Handbags']}
            />
            <FooterList
              label={'Language'}
              links={['English']}
              navclassName={'flex items-center gap-2'}
              symbolname="rightarrow"
            />
            <FooterList
              label={'Currency'}
              links={['INR']}
              navclassName={'flex items-center gap-2'}
              symbolname="rightarrow"
            />
          </div>
        </div>

        <div className="w-full border-t-[2px]">
          <div className="w-full h-auto py-4 md:h-14 flex flex-col md:flex-row items-center justify-between px-4 md:px-5 space-y-4 md:space-y-0">
            <h3 className="font-DMSans text-center md:text-left">
              © 2024 <span className="font-extrabold">UrbanStore</span> All Rights Reserved
            </h3>

            {/* <h3 className='font-DMSans'>Made with ❤️ by Pratik</h3> */}

            <ul className="flex gap-2 font-DMSans text-zinc-400 text-center">
              <li className="hover:text-zinc-500">
                <NavLink>Privacy Policy</NavLink>
              </li>
              <li className="hover:text-zinc-500">
                <NavLink>Terms Of Use</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer;
