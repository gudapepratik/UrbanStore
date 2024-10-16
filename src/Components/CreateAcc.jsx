import React, { useState } from "react";
import authService from "../appwrite/auth";
import { image } from "./index";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../store/authSlice";
import { Navigate, useNavigate } from "react-router";
import { Link, NavLink } from "react-router-dom";

function CreateAcc() {
  // const [name,setName] = useState('')
  // const [email,setEmail] = useState('')
  // const [password, setPassword] = useState('')

  // or we can create a object
  // const [formData,setformData] = useState({
  //   name: '',
  //   email: '',
  //   password: '',
  // })

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   Createacc();
  //   setformData({
  //     name: '',
  //     email: '',
  //     password: '',
  //   })
  // }

  // const handleChange = (e) =>{
  //   setformData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   })
  //   console.log(e)
  // }

  // const Createacc = async () => {
  //     let x = await authService.createAccount(formData)
  //     let userlogin = await authService.login(formData.email,formData.password)
  //     console.log(x,userlogin);
  // }

  let dispatch = useDispatch();
  let navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm();

  const Onsubmit = async (data) => {
    console.log(data);
    try {
      let userData = await authService.createAccount(data);
      console.log(userData);
      if (userData) {
        dispatch(login(userData));
        // navigate('/')
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className=" h-screen z-30 top-0 absolute w-full flex justify-center items-center bg-transparent">
        <div className="flex w-3/6 border-2 bg-white">
          <div className="bg-white overflow-hidden w-3/5 hidden relative lg:block">
            <img
              src={image}
              alt="product logo image"
              className="object-contain absolute scale-150 top-20"
            />
          </div>
          <div>
            <form
              onSubmit={handleSubmit(Onsubmit)}
              className="w-full max-w-md h-full bg-white p-8 rounded space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-700 text-center">
                Create Account
              </h2>
              <div className="m-auto w-fit flex gap-3 text-sm">
                <h4>Already have an Account?</h4>
                <NavLink to={`/login`} className="text-blue-500 hover:text-blue-600">Login</NavLink>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full p-3 border border-gray-300 rounded"
                  {...register("name", {
                    required: true,
                    minLength: 3,
                    maxLength: 20,
                  })}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-3 border border-gray-300 rounded"
                  {...register("email", { required: true, minLength: 3 })}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
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
              </div>
              <button
                type="submit"
                className="w-full bg-rose-500 text-white p-3 rounded hover:bg-rose-600"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateAcc;
