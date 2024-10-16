import React from "react";
import Navbar from "./Navbar";
import { Outlet ,useLocation} from "react-router";

function Layout({children}) {
  const location = useLocation();

  const hideNavbar = location.pathname;

  return (
    <>
      {
        hideNavbar !== '/login' && <Navbar />
      }
      
      <Outlet/>
    </>
  );
}

export default Layout;
