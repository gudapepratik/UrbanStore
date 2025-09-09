import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import store from "./store/store.js";
import { Provider, useDispatch } from "react-redux";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import "./index.css";
import AuthService  from "./api/services/auth.services.js";

import Home from "./Components/Home.jsx";
import About from "./pages/Home.jsx";
import Login from "./Components/Login.jsx";
import Layout from "./Components/Layout.jsx";
import Productlist from "./pages/Productlist.jsx";
import ProductPage from "./pages/ProductPage/ProductPage.jsx";
import { CreateAcc } from "./Components/index.js";
import Cart from "./pages/CartPage/Cart.jsx";
import SellerLogin from "./pages/sellerPages/SellerLogin/SellerLogin.jsx";
import SellerDashboard from "./Components/SellerComponents/Dashboard/SellerDashboard.jsx";
import Productscomp from "./pages/sellerPages/sellerProduct/Productscomp.jsx";
import AddProduct from "./Components/SellerComponents/Products/AddProduct.jsx";
import Checkout from "./Components/Checkout/Checkout.jsx";
import Orders from "./pages/OrderPage/Orders.jsx";
import SellerOrders from "./Components/SellerComponents/SellerOrders/SellerOrders.jsx";
import ErrorPage from "./Components/ErrorPage/ErrorPage.jsx";
import { login, logout } from "./store/authSlice.js";
import ErrorHandler from "./utils/ErrorHandler.utils.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="login" element={<Login />} />
      <Route path="products" element={<Productlist />} />
      <Route path="products/:id" element={<ProductPage />} />
      <Route path="cart" element={<Cart />} />
      <Route path="orders" element={<Orders />} />
      <Route path="sellerdashboard/" element={<SellerDashboard />}>
        <Route path="login" element={<SellerLogin />} />
        <Route path="products" element={<Productscomp />} />
        <Route path="orders" element={<SellerOrders />} />
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Route>
  )
);

const CheckAuth = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const user = await AuthService.getCurrentUser() // Calls backend to check session
        if (user) {
          dispatch(login(user))
        } else {
          dispatch(logout())
        }
      } catch(error) {
        ErrorHandler(error)
      }
    };

    checkToken();
  }, [dispatch]);

  return children;
};

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <Provider store={store}>
      <CheckAuth>
        <RouterProvider router={router} />
      </CheckAuth>
      {/* <App /> */}
    </Provider>
  //{/* </StrictMode> */}
);
