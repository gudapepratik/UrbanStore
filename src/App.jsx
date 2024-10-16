import { useState } from "react";
import "./App.css";
import { Login, CreateAcc } from "./Components/index";
import Navbar from "./Components/Navbar";
import Product from "./Components/Product";
import About from "./Components/About";
import Home from "./Components/Home";

function App() {
  return (
    <>
      <div className="flex flex-col w-full h-screen">
        {/* <Navbar/> */}
        {/* <Login/> */}
        {/* <CreateAcc/> */}
        {/* <div className='grid grid-cols-4 w-full'>
          <Product/>
        </div> */}
      </div>
    </>
  );
}

export default App;
