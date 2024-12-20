import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet ,useLocation} from "react-router";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { logout } from "../store/authSlice";

function Layout({children}) {

  // logout user from authservice and authslice
  const dispatch = useDispatch()

  // handle the user logout when the user reloads or closed the tab unexpecteadly 
  // firstly the set the reloaded flag in local storage, which will tell that the site has been reloaded
  // as we have to unsyncronously handle the appwrite logout, it will happen after the user reloads
  useEffect(() => {
    const handleUnload = () => {
      localStorage.setItem("reloaded", "true");
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

// now check the flag "reloaded", if it is set, then logout the user from appwrite and clear the redux store
// after that clear the "reloaded" flag (reloaded = 0)
  useEffect(() => {
    const checkReload = async () => {
      const wasReloaded = localStorage.getItem("reloaded");

      if (wasReloaded) {
        try {
          // Log out the user from appwrite and redux both
          await authService.logOut();
          dispatch(logout());
        } catch (error) {
          // console.log(error);
        } finally {
          localStorage.removeItem("reloaded"); // clear the flag (equals to 0)
        }
      }
    };

    checkReload();
  }, []);

  const location = useLocation();

  const currentLocation = location.pathname;

  return (
    <>
      {
        currentLocation !== '/login' && !currentLocation.startsWith('/sellerdashboard') && <Navbar />
      }
      
      <Outlet/>
    </>
  );
}

export default Layout;
