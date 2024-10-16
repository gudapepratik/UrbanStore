import React, { useState } from "react";
import {
  RiCarLine,
  RiHeart3Line,
  RiMenu2Line,
  RiProfileFill,
  RiSearchLine,
  RiShoppingCart2Line,
  RiUser3Line,
} from "@remixicon/react";
import Home from "./Home";
import About from "./About";
import Login from "./CreateAcc";

import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import Popup from "./Popup";
import FooterList from "./Footer/FooterList";
import authService from "../appwrite/auth";
import { logout } from "../store/authSlice";
import Loader from "./Loader/Loader";
import { clearCart } from "../store/cartSlice";

function Navbar() {
  const userdata = useSelector((state) => state.authSlice.userData);
  const userStatus = useSelector((state) => state.authSlice.status)
  const navigate = useNavigate();
  const dispatch = useDispatch();


  // responsivness states
  const [showMenu, setShowMenu] = useState(false);

  // Popup widget toggle
  const [showpopup,setShowPopup] = useState(false)

  // login, logout loading state
  const [isloading,setIsLoading] = useState(false)

  const handlemouseenter = () => {
    setShowPopup((prev)=> !prev)
  }
  const handlemouseleave = () => {
    setShowPopup((prev) => !prev)
  }

  const handleLogout = async () => {
    try{
      if(userdata){
        setIsLoading(true)
        await authService.logOut()
        .then(() => {
          dispatch(logout())
          dispatch(clearCart())
        })
        setIsLoading(false)
      }
    } catch(error){
      console.log(error)
    }
  }

  return (
    <div className="flex w-full sticky top-0 bg-white z-40 min-h-24 items-center px-16 justify-between">

      {/* <--------------------Loader-------------------> */}
      {
        isloading && <Loader/>
      }

      {/* <--------------------LOGO-------------------> */}
      <div className="rounded-md px-2">
        <h3
          className="text-3xl text-zinc-800 font-DMSans cursor-pointer font-extrabold"
          onClick={() => navigate("/")}
        >
          UrbanStore
        </h3>
      </div>

      {/* <--------------------Search Bar-------------------> */}
      <div className=" focus:bg-white hidden sm:flex items-center">
        <input
          type="text"
          name="search"
          id=""
          placeholder="Search for products"
          className="px-4 pr-12 py-3 bg-transparent border-[1px] border-r-0 focus:outline-none rounded-l-full text-zinc-800 text-sm font-DMSans placeholder:opacity-85"
        />
        <button className="bg-transparent border-l-0 border-[1px] px-4 py-3 rounded-r-full">
          <RiSearchLine className="text-zinc-400" size={20} />
        </button>
      </div>

      {/* <--------------------Nav items-------------------> */}
      <div className="">
        <ul className="gap-12 hidden lg:flex font-pathwayExtreme items-center">
          <li 
          className="font-[600] hover:text-zinc-700 cursor-pointer relative text-gray-700 before:content-[''] before:absolute before:left-1/2 before:bottom-0 before:w-0 before:h-[2px] before:bg-current before:transition-all before:duration-300 hover:before:left-0 hover:before:w-full"
          onMouseEnter={() => handlemouseenter()}
          onMouseLeave={() => handlemouseleave()}
          >
            <NavLink
              to=""
              className={({ isActive }) =>
                `${isActive ? "text-red-400" : "text-black"}`
              }
            >
              Home
            </NavLink>
            
          </li>
          <li className="font-[600] hover:text-zinc-700 cursor-pointer relative text-gray-700 before:content-[''] before:absolute before:left-1/2 before:bottom-0 before:w-0 before:h-[2px] before:bg-current before:transition-all before:duration-300 hover:before:left-0 hover:before:w-full">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `${isActive ? "text-red-400" : "text-black"}`
              }
            >
              Products
            </NavLink>
          </li>
          
            {userStatus ? 
            <li>
              <button 
              className="text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-md"
              onClick={handleLogout}
              >
              Logout
              </button>

            </li>
            
            :
            <li className="font-[600] hover:text-zinc-700 cursor-pointer relative text-gray-700 before:content-[''] before:absolute before:left-1/2 before:bottom-0 before:w-0 before:h-[2px] before:bg-current before:transition-all before:duration-300 hover:before:left-0 hover:before:w-full">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `${isActive ? "text-red-400" : "text-black"}`
                  }
                >
                  Login
                </NavLink>
            </li>
            }
            
            
          <div className="hidden items-center lg:flex ml-3 ">
            <li className={` p-3 rounded-full cursor-pointer `}>
              <RiUser3Line size={21} />
            </li>
            <li className=" p-3 rounded-full cursor-pointer">
              <RiHeart3Line size={21} />
            </li>
            <NavLink to={'/cart'}>

              <li className=" p-3 rounded-full cursor-pointer">
                <RiShoppingCart2Line size={21} />
              </li>
            </NavLink>
          </div>
        </ul>
      </div>

      {/* <--------------------Hamburger Toggle-------------------> */}

      <div className="lg:hidden flex transition-opacity">
        <div className="p-3 rounded-full">
          <RiMenu2Line onClick={() => setShowMenu((prev) => !prev)} size={21} />
        </div>
        {showMenu ? (
          <div className="absolute w-screen h-3/5 flex flex-col items-end z-20 p-4 top-0 backdrop-filter backdrop-blur-sm bg-opacity-85 right-8 left-2 bg-zinc-200">
            <div className="p-3 bg-zinc-200 rounded-full relative right-6">
              <RiMenu2Line
                onClick={() => setShowMenu((prev) => !prev)}
                size={21}
              />
            </div>
            <div className="w-full flex items-start flex-col mt-12">
              <div className="flex items-center bg-zinc-100 w-full rounded-lg gap-4 shadow-sm  py-6 px-5">
                <div className="bg-zinc-200 p-4 rounded-full cursor-pointer">
                  <RiUser3Line size={23} />
                </div>
                <div>
                  <h3 className="font-pathwayExtreme text-xl">UserName</h3>
                </div>
              </div>
              <ul className="text-2xl flex flex-col gap-6 mt-6 ">
                <li className="font-bold hover:text-zinc-700 cursor-pointer">
                  <NavLink
                    to=""
                    className={({ isActive }) =>
                      `${isActive ? "text-red-400" : "text-black"}`
                    }
                  >
                    Home
                  </NavLink>
                </li>
                <li className="font-bold hover:text-zinc-700 cursor-pointer">
                  <NavLink
                    to="/products"
                    className={({ isActive }) =>
                      `${isActive ? "text-red-400" : "text-black"}`
                    }
                  >
                    Products
                  </NavLink>
                </li>
                <li className="font-bold hover:text-zinc-700 cursor-pointer">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `${isActive ? "text-red-400" : "text-black"}`
                    }
                  >
                    {userStatus? 'Logout': 'Login'}
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Navbar;
