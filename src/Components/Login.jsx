import React, { useState } from "react";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../store/authSlice";
import { Navigate, useNavigate } from "react-router";
import { loginimg } from "../assets/asset";
import Loader from "./Loader/Loader";
import { ReactNotifications, Store } from 'react-notifications-component' // react notification component and Store to trigger the notifications
import 'react-notifications-component/dist/theme.css' // react notification css theme
import 'animate.css/animate.min.css' // react notification animation class
import AuthService  from "../api/services/auth.services.js";
import { triggerNotification } from "../utils/triggerNotification.utils.js";

function Login() {

  let dispatch = useDispatch();
  let navigate = useNavigate();

  //  login-register toggler
  const [isLogin,setIsLogin] = useState(true);
  // incorrect password
  const [ispasswrong,setisPassWrong] = useState(false)
  // loading state
  const [isloading, setIsLoading] = useState(false)

  // react hook form
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset
  } = useForm();

  // form submit handler
  const Onsubmit = async (data) => {
    try {
      setIsLoading(true)
      if(!isLogin){
        console.log(data)
        const userResponse = await AuthService.registerUser({
          name: data.name,
          email: data.email,
          contactNumber: data.contactNumber,
          password: data.password,
          role: 'customer'
        })

        // give a success message
        triggerNotification({
          type: "success",
          title: 'Account Created Successfully',
          message: 'Your account is registered successfully !! login now'
        })

        // toggle the login page
        setIsLogin(true)
        // reset the input fields
        reset()
        return;
      } else{
        const userResponse = await AuthService.loginUser({email: data.email, password: data.password, role: 'customer'})
        // console.log("Asf")
        // store user details in redux
        dispatch(login(userResponse.data.data.user))

        // give a success message
        triggerNotification({
          type: "success",
          title: 'Login Successfull',
          message: 'Your account is logged in successfully!!'
        })

        // navigate to home page after 2 sec timeout
        setTimeout(() => {
          navigate('/')
        }, 2000);
      }
    } catch (error) {
      if(isLogin) {
        triggerNotification({
          type: 'warning',
          title: 'Login Failed !',
          message: `${error.message}`
        })
      } else if(!isLogin) {
        triggerNotification({
          type: 'danger',
          title: 'Registration Failed !',
          message: `${error.message}`
        })
      } else{
        triggerNotification({
          type: 'danger',
          title: 'Unknown Error Occurred !',
          message: `${error.message}`
        })
      }
    } finally {
      setIsLoading(false)
    }
  };


  return (
    <>
      <div className=" w-full max-h-screen flex">
      {/* loading  */}
      {isloading && <Loader/>}

        {/* notifications component  */}
        <ReactNotifications/>
        
        <div className="w-9/12 hidden md:block -z-10 overflow-hidden">
            <img src={loginimg} alt="" className="-translate-y-28"/>
        </div>

          <div className="w-full md:w-4/12 h-full mt-20 md:mt-10">
            <div>
              <form
                onSubmit={handleSubmit(Onsubmit)}
                className={`w-full ${isLogin? 'p-8 px-8 space-y-8': 'p-1 px-8 space-y-8'}`}
              >
                <h2 className="text-5xl font-DMSans font-bold text-gray-700 text-center">
                  {!isLogin ? 'Sign up' : 'Login'}
                </h2>
                <div className="flex flex-col">

                  {
                    !isLogin && 
                    <>
                      <h2 className="font-DMSans text-zinc-800 font-medium text-lg mb-2 mt-4">Name</h2>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        className="w-full p-3 border border-gray-300 rounded"
                        {...register("name", { required: true, minLength: 3 })}
                      />
                    </>
                  }

                  
                  <h2 className="font-DMSans text-zinc-800 font-medium text-lg mb-2 mt-4">Email</h2>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full p-3 border border-gray-300 rounded"
                    {...register("email", { required: true, minLength: 3 })}
                  />
                  {
                    !isLogin ? 
                    <>
                        <h2 className="font-DMSans text-zinc-800 font-medium text-lg mb-2 mt-4">Phone number</h2>
                        <input
                          type="text"
                          name="contactNumber"
                          placeholder="Enter your phone no."
                          className="w-full p-3 border border-gray-300 rounded"
                          {...register("contactNumber", {
                            required: true,
                            minLength: 10,
                            maxLength: 10
                          })}
                        />
                        <h2 className="font-DMSans text-zinc-800 font-medium text-lg mb-2 mt-4">Password</h2>
                        <input
                          type="password"
                          name="password"
                          placeholder="**********"
                          className="w-full p-3 border border-gray-300 rounded"
                          {...register("password", {
                            required: true,
                            // pattern: {
                            //   value:
                            //     /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            //   message:
                            //     "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &)",
                            // },
                          })}
                        />
                        {errors.password && <p>{errors.password.message}</p>}
                    </>
                    :
                    <>
                        <h2 className="font-DMSans text-zinc-800 font-medium text-lg mb-2 mt-4">Password</h2>
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
                    </>
                  }
                </div>
                <button
                  type="submit"
                  className="w-full border-rose-500 border-[1px] text-rose-500 hover:text-white p-3 text-xl font-semibold rounded hover:bg-rose-600"
                > {!isLogin ? 'Sign up': 'Sign in'}
                </button>
                {isLogin ?
                <>
                  <div className="flex justify-between">
                    <h2>Don&lsquo;t have an Account?</h2>
                    <button 
                    className="text-blue-600"
                    onClick={() => setIsLogin(false)}
                    >Create Account</button>
                  </div>
                </>
                :
                <>
                  <div className="flex justify-between">
                    <h2>Already have an Account?</h2>
                    <button 
                    className="text-blue-600"
                    onClick={() => setIsLogin(true)}
                    >Login</button>
                  </div>
                </>
                }
              </form>

            </div>
          </div>
        
      </div>
    </>
  );
}

export default Login;
