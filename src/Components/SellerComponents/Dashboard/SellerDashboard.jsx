import React, { useEffect } from 'react'
import { Outlet, useLocation, useParams } from 'react-router'
import SellerNav from '../SellerNavbar/SellerNav'
import Sidebar from '../Sidebar/Sidebar'
import authService from '../../../appwrite/auth'
import { useSearchParams } from 'react-router-dom'

function SellerDashboard() {
  const location = useLocation()

  return (
    <>
      <div className='flex '>
        {location.pathname !== '/sellerdashboard/login' && <Sidebar/>}

        <div className='w-full flex flex-col bg-zinc-100 shadow-inner'>
          {location.pathname !== '/sellerdashboard/login' && <SellerNav/>}
          {location.pathname !== '/sellerdashboard/login' && <Outlet/>}
        </div>
      </div>
      {location.pathname === '/sellerdashboard/login' && <Outlet/>}
    </>
  )
}

export default SellerDashboard