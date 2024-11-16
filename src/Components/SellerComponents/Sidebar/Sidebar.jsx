import React from 'react'
import { UsBusinesslogo } from '../../../assets/asset'
import Optionbtn from './Optionbtn'

function Sidebar() {
  return (
    <>
        <div className='w-96 bg-zinc-200 h-screen flex flex-col'>
            {/* Logo section  */}
            <div className='w-full flex justify-center items-center p-8 bg-zinc-700 shadow-inner'>
                <img src={UsBusinesslogo} alt="UrbanStore business logo" className='w-[163px]'/>
            </div>

            {/* Options section  */}
            <div className='w-full py-10 px-5 gap-3 flex flex-col items-center'>
                <Optionbtn label={'Dashboard'} path={'/sellerdashboard'} iconname={'RiHome5Line'}/>
                <Optionbtn label={'Orders'} path={'/sellerdashboard/orders'} iconname={'RiReceiptLine'}/>
                <Optionbtn label={'Products'} path={'/sellerdashboard/products'} iconname={'RiShoppingBag3Line'}/>
                <Optionbtn label={'Customers'} path={'/sellerdashboard/customers'} iconname={'RiAccountCircleLine'}/>
                <Optionbtn label={'Messages'} path={'/sellerdashboard/messages'} iconname={'RiMessage2Line'}/>
                <Optionbtn label={'Settings'} path={'/sellerdashboard/settings'} iconname={'RiSettings3Line'}/>
            </div>

        </div>
    
    </>
  )
}

export default Sidebar