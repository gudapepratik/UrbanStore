import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import authService from "../../../appwrite/auth.js";
import { UsBusinesslogo } from "../../../assets/asset.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import conf from "../../../conf/conf.js";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../../store/authSlice.js";
import Loader from "../../Loader/Loader.jsx";
import { ReactNotifications, Store } from "react-notifications-component"; // react notification component and Store to trigger the notifications
import "react-notifications-component/dist/theme.css"; // react notification css theme
import "animate.css/animate.min.css"; // react notification animation class

function SellerLogin() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  // loading state to handle the async operations
  const [isloading, setIsLoading] = useState(false);

  const [isnoaccount, setIsNoAccount] = useState(false);
  // const [userData,setUserData] = useState({})

  const dispatch = useDispatch();
  // const {} = useSelector()

  // navigate
  const navigate = useNavigate();

  // to verify the user
  const [searchparams] = useSearchParams();
  const userId = searchparams.get("userId");
  const secret = searchparams.get("secret");

  // dummy notification
  const notification = {
    title: "Add title message",
    message: "Configurable",
    type: "success",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated animate__fadeIn"], // `animate.css v4` classes
    animationOut: ["animate__animated animate__fadeOut"], // `animate.css v4` classes
  };

  const Onsubmit = async (data) => {
    setIsLoading(true);
    console.log(data);
    // setUserData(data)
    if (isnoaccount) {
      try {
        var seller = await authService.RegisterSeller(data);
        Store.addNotification({
          ...notification,
          type: "info",
          title: "Verification email sent successfully",
          message: "Please check your email for verification",
          container: "top-right",
          dismiss: {
            duration: 2000,
            pauseOnHover: true,
          },
        });
      } catch (error) {
        Store.addNotification({
          ...notification,
          type: "danger",
          title: "Unknown Error Occurred",
          message: `${error.message}`,
          container: "top-right",
          dismiss: {
            duration: 2000,
            pauseOnHover: true,
          },
        });
      }
    } else {
      try {
        seller = await authService.login(data, "Seller");
        const currentUser = await authService.getCurrentUser();
        dispatch(login([currentUser, "Seller"]));
        // then navigate to the dashboard after 2 seconds
        navigate("/sellerdashboard/");
        setIsLoading(false);
      } catch (error) {
        Store.addNotification({
          ...notification,
          type: "danger",
          title: "Error",
          message: `${error.message}`,
          container: "top-right",
          dismiss: {
            duration: 2000,
            pauseOnHover: true,
          },
        });
      }
    }
    setIsLoading(false);
  };

  const verifyUser = async (userId, secret) => {
    try {
      setIsLoading(true);
      const res = await authService.account.updateVerification(userId, secret);
      if (!res) throw new Error("User Verification Failed");

      Store.addNotification({
        ...notification,
        type: "info",
        title: "Verification Successfull",
        message: "Creating Seller account , Please wait",
        container: "top-right",
        dismiss: {
          duration: 2000,
          pauseOnHover: true,
        },
      });

      // after this create membership for the user as Seller
      // // if the user is created successfully  then add the user to the "seller" team using membership() method
      // Get details of current logged in user
      const userdetails = await authService.getCurrentUser();
      const addtoteamres = await authService.AddToTeam({
        userId: userdetails.$id,
        userName: userdetails.name,
        userEmail: userdetails.email,
      });

      // dispatch the user details to redux store
      dispatch(login([userdetails, "Seller"]));
      Store.addNotification({
        ...notification,
        type: "success",
        title: "Seller Account registered successfully",
        message: "Account created successfully and registered as seller",
        container: "top-right",
        dismiss: {
          duration: 2000,
          pauseOnHover: true,
        },
      });
      setTimeout(() => {
        navigate("/sellerdashboard/");
      }, 2000);
    } catch (error) {
      Store.addNotification({
        ...notification,
        type: "danger",
        title: "Unknown Error Occurred",
        message: `${error.message}`,
        container: "top-right",
        dismiss: {
          duration: 2000,
          pauseOnHover: true,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId && secret) {
      verifyUser(userId, secret);
    }
  }, [userId, secret]);

  return (
    <div className="flex items-center p-5 flex-col justify-center h-screen bg-[#00b75f]">
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
            {isnoaccount ? "Sign up" : "Login"}
          </h2>
          <div className="flex flex-col">
            {isnoaccount && (
              <>
                <h2 className="font-DMSans font-medium text-xl mb-2 mt-4">
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

            <h2 className="font-DMSans font-medium text-xl mb-2 mt-4">Email</h2>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded"
              {...register("email", { required: true, minLength: 3 })}
            />
            <h2 className="font-DMSans font-medium text-xl mb-2 mt-4">
              Password
            </h2>
            {isnoaccount ? (
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
            ) : (
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
                {/* {ispasswrong && <p>Incorrect Password</p>} */}
              </>
            )}
          </div>
          <button
            type="submit"
            className="w-full border-[#00b75f] border-[1px] text-[#00b75f] hover:text-white p-3 text-xl font-semibold rounded hover:bg-[#00b75f]"
          >
            {isnoaccount ? "Sign up" : "Sign in"}
          </button>
          {!isnoaccount && (
            <>
              <div className="flex justify-between">
                <h2>Don&lsquo;t have an Account?</h2>
                <button
                  className="text-blue-600"
                  onClick={() => setIsNoAccount(true)}
                >
                  Create Account
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
