import React, { useState } from "react";
import authService from "../appwrite/auth";
import { image } from "./index";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../store/authSlice";
import { Navigate, useNavigate } from "react-router";
import { loginimg } from "../assets/asset";
import Loader from "./Loader/Loader";

function Login() {

  let dispatch = useDispatch();
  let navigate = useNavigate();

  //  Create account
  const [isnoaccount,setIsNoAccount] = useState(false);
  // incorrect password
  const [ispasswrong,setisPassWrong] = useState(false)
  // loading state
  const [isloading, setIsLoading] = useState(false)

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm();
  let user = useSelector(state => state.authSlice.useData)

  const Onsubmit = async (data) => {
    console.log(data);
    try {
      setIsLoading(true)
      if(isnoaccount){
        // console.log("yaha aagya")
        var user = await authService.createAccount(data);
      } else{
        // console.log("sahi hai")
        user = await authService.login(data);
      }
      //console.log(userData);
      if (user) {
        console.log("yaha aaja")
        // now once the user is logged in call the get method to get the user data and then store it to redux userdata state
        const userData = await authService.getCurrentUser();
        if(userData){
          dispatch(login(userData));
        }
        // console.log(user)
        navigate('/')
        setIsLoading(false)
      } else{
        if(!isnoaccount) {
          setisPassWrong(true);
          setIsLoading(false)
        }
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <>
      <div className=" w-full max-h-screen flex">
        {isloading && <Loader/>}
        <div className="w-9/12 overflow-hidden">
            <img src={loginimg} alt="" className="-translate-y-28"/>
        </div>

          <div className=" w-4/12 h-full mt-20">
            <div>
              <form
                onSubmit={handleSubmit(Onsubmit)}
                className="w-full p-8 space-y-8"
              >
                <h2 className="text-5xl font-DMSans font-bold text-gray-700 text-center">
                  {isnoaccount ? 'Sign up' : 'Login'}
                </h2>
                <div className="flex flex-col">

                  {
                    isnoaccount && 
                    <>
                      <h2 className="font-DMSans font-medium text-xl mb-2 mt-4">Name</h2>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        className="w-full p-3 border border-gray-300 rounded"
                        {...register("name", { required: true, minLength: 3 })}
                      />
                    </>
                  }

                  
                  <h2 className="font-DMSans font-medium text-xl mb-2 mt-4">Email</h2>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full p-3 border border-gray-300 rounded"
                    {...register("email", { required: true, minLength: 3 })}
                  />
                  <h2   className="font-DMSans font-medium text-xl mb-2 mt-4">Password</h2>
                  {
                    isnoaccount ? 
                    <>
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
                        {errors.password && <p>{errors.password.message}</p>}
                    </>
                    :
                    <>
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
                        {ispasswrong && <p>Incorrect Password</p>}
                    </>
                  }
                </div>
                <button
                  type="submit"
                  className="w-full border-rose-500 border-[1px] text-rose-500 hover:text-white p-3 text-xl font-semibold rounded hover:bg-rose-600"
                > {isnoaccount ? 'Sign up': 'Sign in'}
                </button>
                {!isnoaccount && 
                <>
                
                <div className="flex justify-between">
                  <h2>Don&lsquo;t have an Account?</h2>
                  <button 
                  className="text-blue-600"
                  onClick={() => setIsNoAccount(true)}
                  >Create Account</button>
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
