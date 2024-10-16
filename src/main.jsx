import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import store from "./store/store.js";
import { Provider } from "react-redux";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import "./index.css";

import Home from "./Components/Home.jsx";
import About from "./Components/About.jsx";
import Login from "./Components/Login.jsx";
import Layout from "./Components/Layout.jsx";
import Productlist from "./Components/Productlist.jsx";
import ProductPage from "./Components/ProductInfo/ProductPage.jsx";
import { CreateAcc } from "./Components/index.js";
import Cart from "./Components/Cart/Cart.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="login" element={<Login />} />
      <Route path="products" element={<Productlist />} />
      <Route path="products/:id" element={<ProductPage />} />
      <Route path="cart" element = {<Cart/>} />
    </Route>
  )
);

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Layout/>,
//     children: [
//         {
//           path: '',
//           element: <Home/>
//         },
//     ]
//   },
// ])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      {/* <App /> */}
    </Provider>
  </StrictMode>
);
