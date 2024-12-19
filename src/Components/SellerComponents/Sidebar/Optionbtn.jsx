import { RiAccountCircleLine,RiReceiptLine,RiShoppingBag3Line, RiBox3Line, RiDashboard2Line, RiDashboard3Line, RiDashboardLine, RiHome5Line, RiMessage2Line, RiSettings3Line} from '@remixicon/react'
import React from 'react'
import { NavLink } from 'react-router-dom'

function Optionbtn({label,path,iconname,exact}) {

    // Store all icons in an object
    const icons = {
        RiAccountCircleLine,
        RiBox3Line,
        RiDashboard2Line,
        RiDashboard3Line,
        RiDashboardLine,
        RiHome5Line,
        RiMessage2Line,
        RiSettings3Line,
        RiShoppingBag3Line,
        RiReceiptLine
    };
    const Icon = icons[iconname]
  return (
    <>
        <NavLink className={({isActive}) => 
          `w-full flex px-8 py-3 cursor-pointer hover:bg-[#00B75F] ${isActive? 'bg-[#00B75F]' : 'bg-white'} ${isActive? 'text-white' : 'text-zinc-800'} hover:text-white rounded-md gap-5 shadow-inner`
        }
        to={`${path}`}
        end={exact}
        >
            {Icon && <Icon className = ' text-current'/>}
            <h3 className='font-DMSans font-semibold text-current'>{label}</h3>
        </NavLink>
    
    </>
  )
}

export default Optionbtn