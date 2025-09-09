import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import authService from "../../../appwrite/auth.js";
import { UsBusinesslogo } from "../../../assets/asset.js";
import { useNavigate, useSearchParams } from "react-router-dom";
// import conf from "../../../conf/conf.js";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../../store/authSlice.js";
import Loader from "../../../Components/Loader/Loader.jsx";
import { ReactNotifications, Store } from "react-notifications-component"; // react notification component and Store to trigger the notifications
import "react-notifications-component/dist/theme.css"; // react notification css theme
import "animate.css/animate.min.css"; // react notification animation class
import { triggerNotification } from "../../../utils/triggerNotification.utils.js";
import AuthService from "../../../api/services/auth.services.js";

function SellerLogin() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  // loading state to handle the async operations
  const [isloading, setIsLoading] = useState(false);

  // login-signup toggle state
  const [isLogin, setIsLogin] = useState(true);

  // dispather to make changes in redux state
  const dispatch = useDispatch();

  // navigate instance
  const navigate = useNavigate();

  // form submit handler
  const Onsubmit = async (data) => {
    try {
      setIsLoading(true);
      if (!isLogin) {
        console.log(data);
        const userResponse = await AuthService.registerUser({
          name: data.name,
          email: data.email,
          contactNumber: data.contactNumber,
          password: data.password,
          role: "seller",
        });

        // give a success message
        triggerNotification({
          type: "success",
          title: "Account Created Successfully",
          message: "Your account is registered successfully !! login now",
        });

        // toggle the login page
        setIsLogin(true);
        // reset the input fields
        reset();
        return;
      } else {
        const userResponse = await AuthService.loginUser({
          email: data.email,
          password: data.password,
          role: "seller",
        });

        // store user details in redux
        dispatch(login(userResponse.data.data.user));

        // give a success message
        triggerNotification({
          type: "success",
          title: "Login Successfull",
          message: "Your account is logged in successfully!!",
        });

        // navigate to home page after 2 sec timeout
        setTimeout(() => {
          navigate("/sellerdashboard");
        }, 2000);
      }
    } catch (error) {
      if (isLogin) {
        triggerNotification({
          type: "warning",
          title: "Login Failed !",
          message: `${error.message}`,
        });
      } else if (!isLogin) {
        triggerNotification({
          type: "danger",
          title: "Registration Failed !",
          message: `${error.message}`,
        });
      } else {
        triggerNotification({
          type: "danger",
          title: "Unknown Error Occurred !",
          message: `${error.message}`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex items-center p-5 flex-col ${
        isLogin ? "h-screen" : ""
      } justify-center bg-[#00b75f]`}
    >
      {/* loading bar  */}
      {isloading && <Loader />}

      {/* React notification component  */}
      <ReactNotifications />

      <div className="bg-zinc-800  max-w-md w-full shadow-inner rounded-t-lg flex justify-center items-center py-5">
        <img src={UsBusinesslogo} alt="" className="w-[200px]" />
      </div>
      <div className="w-full max-w-md bg-white shadow-inner rounded-b-lg ">
        <form
          onSubmit={handleSubmit(Onsubmit)}
          className="w-full p-8 space-y-8"
        >
          <h2 className="text-3xl font-DMSans font-bold text-[#00b75f]     text-center">
            {!isLogin ? "Sign up" : "Login"}
          </h2>
          <div className="flex flex-col">
            {!isLogin && (
              <>
                <h2 className="font-DMSans text-zinc-800 font-medium text-lg mb-2 mt-4">
                  Name
                </h2>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  className="w-full p-3 border border-gray-300 rounded"
                  {...register("name", { required: true, minLength: 3 })}
                />
              </>
            )}

            <h2 className="font-DMSans text-zinc-800 font-medium text-lg mb-2 mt-4">
              Email
            </h2>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded"
              {...register("email", { required: true, minLength: 3 })}
            />
            {!isLogin ? (
              <>
                <h2 className="font-DMSans text-zinc-800 font-medium text-lg mb-2 mt-4">
                  Phone number
                </h2>
                <input
                  type="text"
                  name="contactNumber"
                  placeholder="Enter your phone no."
                  className="w-full p-3 border border-gray-300 rounded"
                  {...register("contactNumber", {
                    required: true,
                    minLength: 10,
                    maxLength: 10,
                  })}
                />
                <h2 className="font-DMSans text-zinc-800 font-medium text-lg mb-2 mt-4">
                  Password
                </h2>
                <input
                  type="password"
                  name="password"
                  placeholder="**********"
                  className="w-full p-3 border border-gray-300 rounded"
                  {...register("password", {
                    required: true,
                    pattern: {
                      value:
                        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message:
                        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &)",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-xs ">{errors.password.message}</p>
                )}
              </>
            ) : (
              <>
                <h2 className="font-DMSans text-zinc-800 font-medium text-lg mb-2 mt-4">
                  Password
                </h2>
                <input
                  type="password"
                  name="password"
                  placeholder="**********"
                  className="w-full p-3 border border-gray-300 rounded"
                  {...register("password", {
                    required: true,
                  })}
                />
                {errors.password && <p>{errors.password.message}</p>}
                {/* {ispasswrong && <p>Incorrect Password</p>} */}
              </>
            )}
          </div>
          <button
            type="submit"
            className="w-full border-[#00b75f] border-[1px] text-[#00b75f] hover:text-white p-3 text-xl font-semibold rounded hover:bg-[#00b75f]"
          >
            {!isLogin ? "Sign up" : "Sign in"}
          </button>
          {isLogin ? (
            <>
              <div className="flex justify-between">
                <h2>Don&lsquo;t have an Account?</h2>
                <button
                  className="text-blue-600"
                  onClick={() => {
                    setIsLogin(false);
                    reset();
                  }}
                >
                  Create Account
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <h2>Already have an Account?</h2>
                <button
                  className="text-blue-600"
                  onClick={() => {
                    setIsLogin(true);
                    reset();
                  }}
                >
                  Login
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default SellerLogin;
