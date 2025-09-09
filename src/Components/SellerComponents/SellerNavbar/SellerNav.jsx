import { RiSearchLine, RiUserLine } from '@remixicon/react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import authService from '../../../appwrite/auth'
import { logout } from '../../../store/authSlice'
import { useNavigate } from 'react-router'
import Loader from '../../Loader/Loader'
import { ReactNotifications, Store } from 'react-notifications-component' // react notification component and Store to trigger the notifications
import 'react-notifications-component/dist/theme.css' // react notification css theme
import 'animate.css/animate.min.css' // react notification animation class
import { NavLink } from 'react-router-dom'
import { triggerNotification } from '../../../utils/triggerNotification.utils'
import AuthService from '../../../api/services/auth.services.js'


// color - #00B75F
function SellerNav() {

    // loading state for async operations
    const [isloading,setIsLoading] = useState()

    // get the details of the current loggin in user(Seller) from redux store
    const userData = useSelector(state => state.authSlice.userData)

    // is logged in 
    const loginstatus = useSelector(state => state.authSlice.status)

    // dispatch to make changes in redux store
    const dispatch = useDispatch()

    // navigate to navigate through pages
    const navigate = useNavigate()

    const LogoutSeller = async () => {
        try {
            setIsLoading(true)
            console.log('saf')
            await AuthService.logoutUser()
            .then(() => {
                dispatch(logout())
                navigate('/sellerdashboard/login')
            })
            setIsLoading(false)
            triggerNotification({type: "info", title: "Logged out successfully", message: "You've successfully logged out of your account"})
        } catch(error){
            triggerNotification({type: "danger", title: "Unknown Error Occurred", message: `Logout Failed: ${error.message}`})
        } finally{
            setIsLoading(false)
        }
    }

  return (
    <>
        <div className='w-full py-6 flex justify-between items-center px-20'>
            {/* loading component  */}
            {isloading && <Loader/>}

            {/* Notification component  */}
            <ReactNotifications/>
            
            {/* search bar (not working / dummy) */}
            <div className='flex items-center shadow-inner border-[1px] border-zinc-700 bg-white rounded-md'>
                <RiSearchLine size={18} className='bg-none text-zinc-800  m-2'/>
                <input type="text" className='px-3 py-2 bg-transparent focus:outline-none font-DMSans text-zinc-900 font-medium' placeholder='search for...'/>
            </div>

            <div className='flex gap-2 items-center justify-center'> 
                {/* seller account details  */}
                {/* if user is logged out, make it as a Navlink */}
                {loginstatus ? 
                    <div className='flex items-center gap-5 px-5 py-2 text-white bg-[#00B75F] shadow-inner rounded-md'>
                        <RiUserLine/>
                        <div className='flex flex-col '>
                            <h3 className='font-DMSans font-bold'>{userData? userData.name: "Login"}</h3>
                            <h4 className='font-DMSans text-xs'>seller account</h4>
                        </div>
                    </div>
                
                :
                    <NavLink to={'/sellerdashboard/login'} className='flex items-center gap-5 px-5 py-2 text-white bg-[#00B75F] shadow-inner rounded-md'>
                        <RiUserLine/>
                        <div className='flex flex-col '>
                            <h3 className='font-DMSans font-bold'>{userData? userData.name: "Login"}</h3>
                            <h4 className='font-DMSans text-xs'>seller account</h4>
                        </div>
                    </NavLink>
                }

                {/* Logout button  */}
                {loginstatus && 
                    <button 
                    className='bg-rose-500 px-6 py-4 text-white text-base font-DMSans font-bold rounded-md'
                    onClick={LogoutSeller}
                    >
                        Logout
                    </button>
                }
            </div>
        </div>
    </>
  )
}

export default SellerNav