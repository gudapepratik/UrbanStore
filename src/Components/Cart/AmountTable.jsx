import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeCoupon, setCoupon, setFinalAmount } from "../../store/cartSlice";
import { triggerNotification } from "../../utils/triggerNotification.utils";
import { RiCheckLine, RiCloseLine, RiCrossLine } from "@remixicon/react";

const AmountTable = ({setToShowBuyComp}) => {
    const billingStructure = {
        discountCoupons: [
        {
            couponCode: "first100",
            minLimit: 700, // minimum required total amount
            discount: 100, // in rupees
        },
        {
            couponCode: "give50",
            minLimit: 500, // minimum required total amount
            discount: 50, // in rupees
        },
        ],
        platFormFee: 40, // in rupees
        shippingFee: 40, // in rupees
    };

    const TotalCartAmount = useSelector((state) => state.cartSlice.totalAmount);
    const cartItems = useSelector((state) => state.cartSlice.cartitems);
    const dispatch = useDispatch();
    const finalAmount = useSelector((state) => state.cartSlice.finalAmount);
    const appliedCoupon = useSelector((state) => state.cartSlice.couponDetails)
    const [discount, setDiscount] = useState(0);
    const [couponInput,setCouponInput] = useState('')
    const [couponStatus, setCouponStatus] = useState('idle')
    const [statusMessage, setStatusMessage] = useState("")

    const calculateTotal = () => {
        setFinalAmount(TotalCartAmount);

        dispatch(setFinalAmount(finalAmount + billingStructure.platFormFee));
    };

    useEffect(() => {
        calculateTotal();
    }, []);

    // useEffect(() => {
    //     handleCouponMatch();
    // }, [couponCode]);

    // const handleCouponMatch = () => {
    //     billingStructure.Discount.map((coupon) => {
    //         if (coupon.couponCode === couponCode) {
    //             if (coupon.minLimit <= TotalCartAmount) {
    //                 dispatch(setFinalAmount(finalAmount - coupon.discount));
    //                 setDiscount(coupon.discount);
    //             } else {
    //                 dispatch(setFinalAmount(finalAmount+ coupon.discount));
    //                 setDiscount(0);
    //             }
    //         }
    //     });
    // }

    const handleClickBuybutton = async (e) => {
        e.preventDefault();
        try {
        // check if the sizes selected are in stock or not
        // cartItems (size, item.productDetails.stockInfo)
        cartItems.map((item) => {
            if(item.productDetails.stockInfo.find(sizeItem => sizeItem.size === item.size).quantity === 0) {
                throw new Error(`Size for product ${item.productDetails.name.slice(0,20)}.... is out of stock !!`)
            }
        })
        setToShowBuyComp(true);
        } catch (error) {
        // if any error comes then it will notify and break the further excecution
        triggerNotification({
            type: "warning",
            title: "Error While Checkout",
            message: `${error.message}`,
        });
        }
    };

    const handleCouponSubmit = (e) => {
        e.preventDefault()
        const inputcode = e.target[0].value
        
        const foundCoupon = billingStructure.discountCoupons.some((coupon) => {
            if (coupon.couponCode === inputcode) {
                if (coupon.minLimit <= TotalCartAmount) {
                    setCouponStatus("success");
                    setStatusMessage(`Coupon ${inputcode.toUpperCase()} applied successfully!`);
                    // store the changes in store
                    dispatch(setFinalAmount(finalAmount - coupon.discount));
                    dispatch(setCoupon(coupon))
                    setDiscount(coupon.discount)
                    return true;
                } else {
                    setCouponStatus("error");
                    setStatusMessage(`Coupon ${inputcode.toUpperCase()} requires a minimum purchase of ${coupon.minLimit}`);
                    return true;
                }
            }
            return false;
        });
        
        if (!foundCoupon) {
            setCouponStatus("error");
            setStatusMessage("Invalid coupon code. Please try again.");
        }
    }

    const handleRemoveCoupon = (e) =>{ 
        e.preventDefault()
        // if coupon was already applied, remove it
        if(couponStatus === 'success') {
            setStatusMessage('')
            // get the details of the applied coupon
            const couponDetails = billingStructure.discountCoupons.filter((coupon) => coupon.couponCode === couponInput)
            // reflect the changes in store also
            // console.log(couponDetails.at(0).discount)
            dispatch(setFinalAmount(finalAmount + couponDetails.at(0).discount));
            dispatch(removeCoupon())
            setDiscount(0);
        }  
        setCouponStatus('idle')
        setCouponInput('')
    }

    return (
        <div className="w-full md:w-2/6 md:mx-10 mt-4 px-6 flex flex-col gap-3 h-full">
            {/* coupon section  */}
            <div className="flex flex-col gap-1 font-DMSans">
                <h1 className="font-DMSans font-bold text-2xl">Have a Coupon ?</h1>
                <form className="w-full flex items-center" onSubmit={handleCouponSubmit}>
                    <input 
                        type="text" 
                        placeholder="Enter coupon code"  
                        className="w-[90%] p-3 border focus:outline-none focus:shadow-inner text-zinc-800" 
                        onChange={(e) => {
                            setCouponInput(e.target.value)
                        }} 
                        value={couponInput}
                        disabled={couponStatus !== 'idle'}
                    />
                    {couponStatus === 'idle'?
                        <button
                        type="submit"
                        className="bg-zinc-200 p-3 hover:bg-zinc-300 focus:outline-none"
                        >
                        <RiCheckLine size={24} className="text-zinc-700" />
                        </button>
                    :
                        <button
                        onClick={handleRemoveCoupon}
                        className="bg-zinc-200 p-3 hover:bg-zinc-300 focus:outline-none"
                        >
                        <RiCloseLine size={24} className="text-zinc-700" />
                        </button>
                    }
                </form>
                {couponStatus !== "idle" && (
                    <div
                    className={`p-3 rounded ${
                        couponStatus === "success"
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-red-100 text-red-800 border border-red-300"
                    }`}
                    >
                    {statusMessage}
                    </div>
                )}
            </div>
        
        {/* Order details section  */}
        <h1 className="font-DMSans font-bold text-2xl">Order Summary</h1>
        <div className="shadow-inner">
            <div className="w-full border-[1px] border-b-0 flex flex-col border-zinc-400 ">
            {/* subtotal  */}
            <div className="flex items-center justify-between p-3 border-b-[1px] border-zinc-400">
                <h2 className="font-DMSans font-semibold text-base">
                Items Subtotal
                </h2>
                <h3 className="font-DMSans text-md text-zinc-500">
                ₹{TotalCartAmount}
                </h3>
            </div>
            {/* Discount  */}
            <div className="flex items-center justify-between p-3 border-b-[1px] border-zinc-400">
                <h2 className="font-DMSans font-semibold text-base">Discount</h2>
                <h3 className="font-DMSans text-md text-green-500">{discount !== 0? '- ' + discount: '-'}</h3>
            </div>

            {/* platform fee  */}
            <div className="flex items-center justify-between p-3 border-b-[1px] border-zinc-400">
                <h2 className="font-DMSans font-semibold text-base">Platform fee</h2>
                <h3 className="font-DMSans text-md text-zinc-500">{billingStructure.platFormFee}</h3>
            </div>

            {/* Billing fee  */}
            {/* <div className="flex items-center justify-between p-3 border-b-[1px] border-zinc-400">
                <h2 className="font-DMSans font-semibold text-base">Shipping fee</h2>
                <h3 className="font-DMSans text-md text-zinc-500">{billingStructure.shippingFee}</h3>
            </div> */}

            {/* total  */}
            <div className="flex items-center justify-between p-3 ">
                <h2 className="font-DMSans font-semibold text-base">Total</h2>
                <h3 className="font-DMSans text-md font-bold text-zinc-500">
                ₹{finalAmount.toFixed(2)}
                </h3>
            </div>

            {/* place order button  */}
            </div>
            <button
            onClick={(e) => handleClickBuybutton(e)}
            className="bg-zinc-950 w-full font-DMSans font-bold text-white py-3 "
            >
            Proceed to checkout
            </button>
        </div>
        </div>
    );
};

export default AmountTable;
