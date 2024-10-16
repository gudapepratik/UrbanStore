import React from 'react'
import { useSelector } from 'react-redux'
import {login,logout} from '../store/authSlice'
import CreateAcc  from './CreateAcc'
import {dashboardimg1} from '../assets/asset.js'
import Footer from './Footer.jsx'

function Home() {
  const user = useSelector(state => state.authSlice.userData)
  const status = useSelector(state => state.authSlice.status)
  // console.log(user)

  return (

    <>
      <div>
        {status? 
        // no need to show anything
        null
        :
        <>
        <div className=''>
          {/* just show the popup of create account here */}
          {/* <h1 className='text-2xl text-black'>Hello bhai me piche huuu</h1> */}
          {/* <CreateAcc/> */}
        </div>
        </>
        
        }
      </div>
      
      {/* main part */}
      <div>
        {/* first image corousal */}
        <div className='w-full h-screen'>
              <img src={dashboardimg1} alt="" className='absolute -top-4 -z-10'/>
        </div>
        <div className='h-screen'>

        </div>

        {/* footer render */}
        <Footer/>
      </div>
    </>
  )
}

export default Home