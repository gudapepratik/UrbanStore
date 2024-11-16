import React from "react";
import Navbar from "./Navbar";
import { Outlet ,useLocation} from "react-router";

function Layout({children}) {
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
