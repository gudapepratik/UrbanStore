import React, { useState } from "react";
import {
  RiArrowGoBackLine,
  RiCarLine,
  RiHeart3Line,
  RiMenu2Line,
  RiProfileFill,
  RiSearchLine,
  RiShoppingCart2Line,
  RiUser3Line,
} from "@remixicon/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import authService from "../appwrite/auth";
import { logout } from "../store/authSlice";
import Loader from "./Loader/Loader";
import { clearCart } from "../store/cartSlice";
import Searchbar from "./SearchBar/Searchbar";

function Navbar() {
  const userdata = useSelector((state) => state.authSlice.userData);
  const userStatus = useSelector((state) => state.authSlice.status);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Responsive states
  const [showMenu, setShowMenu] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      if (userdata) {
        setIsLoading(true);
        await authService.logOut().then(() => {
          dispatch(logout());
          dispatch(clearCart());
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full sticky top-0 bg-white z-40 min-h-24 items-center px-4 md:px-8 lg:px-16 justify-between">
      {isloading && <Loader />}

      {/* Logo */}
      <div className="rounded-md px-2">
        <h3
          className="text-2xl md:text-3xl text-zinc-800 font-DMSans cursor-pointer font-extrabold"
          onClick={() => navigate("/")}
        >
          UrbanStore
        </h3>
      </div>

      {/* Search Bar */}
      <Searchbar/>

      {/* Nav Items */}
      <ul className="gap-10 hidden lg:flex items-center font-pathwayExtreme">
        <li>
          <NavLink
            to=""
            className={({ isActive }) =>
              `font-bold  ${
                isActive ? "text-red-400" : "text-black"
              }`
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `font-bold  ${
                isActive ? "text-red-400" : "text-black"
              }`
            }
          >
            Products
          </NavLink>
        </li>
        {userStatus ? (
          <li>
            <button
              className="text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-md"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        ) : (
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `font-bold  ${
                  isActive ? "text-red-400" : "text-black"
                }`
              }
            >
              Login
            </NavLink>
          </li>
        )}
        <li>
          <NavLink to="/cart" className="p-2">
            <RiShoppingCart2Line size={21} />
          </NavLink>
        </li>
      </ul>

      {/* Hamburger Menu for Mobile */}
      <div className="lg:hidden flex items-center">
        <button onClick={() => setShowMenu((prev) => !prev)}>
          <RiMenu2Line size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="absolute w-full h-screen top-0 left-0 bg-black bg-opacity-50 z-30">
          <div className="bg-white w-4/5 sm:w-2/3 h-full p-6">
            <div className="flex justify-between items-center">
              <h3
                className="text-2xl font-DMSans font-extrabold text-zinc-800"
                onClick={() => {
                  setShowMenu(false);
                  navigate("/");
                }}
              >
                UrbanStore
              </h3>
              <button onClick={() => setShowMenu(false)}>
                <RiArrowGoBackLine size={24} />
              </button>
            </div>
            <ul className="mt-10 flex flex-col gap-6">
              <li>
                <NavLink
                  to=""
                  onClick={() => setShowMenu(false)}
                  className={({ isActive }) =>
                    `text-xl  font-DMSans font-bold  ${
                      isActive ? "text-red-400" : "text-black"
                    }`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/products"
                  onClick={() => setShowMenu(false)}
                  className={({ isActive }) =>
                    `text-xl  font-DMSans font-bold  ${
                      isActive ? "text-red-400" : "text-black"
                    }`
                  }
                >
                  Products
                </NavLink>
              </li>
              <li>
                {userStatus ? (
                  <button
                    className="text-white font-DMSans bg-red-500 hover:bg-red-600 px-2 py-1 rounded-md"
                    onClick={() => {
                      handleLogout();
                      setShowMenu(false);
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <NavLink
                    to="/login"
                    onClick={() => setShowMenu(false)}
                    className={({ isActive }) =>
                      `text-xl  font-DMSans font-bold  ${
                        isActive ? "text-red-400" : "text-black"
                      }`
                    }
                  >
                    Login
                  </NavLink>
                )}
              </li>
              <li>
                <NavLink to="/cart" onClick={() => setShowMenu(false)} className={`flex gap-2`}>
                  <p className="font-bold font-DMSans text-xl">Cart</p> <RiShoppingCart2Line size={24} className="text-black" />
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
