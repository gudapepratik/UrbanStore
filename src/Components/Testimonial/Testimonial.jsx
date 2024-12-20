import React, { useState } from 'react'
import { ReactNotifications, Store } from 'react-notifications-component'
import { NavLink } from 'react-router-dom'

function Testimonial({notificationTrigger}) {

    // notification triggerer helper function
    const triggerNotification = ({type, title, message}) => {
        // dummy notification to handle notifications
        const notification = {
            title: "Add title message",
            message: "Configurable",
            type: "success",
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated animate__fadeIn"], // `animate.css v4` classes
            animationOut: ["animate__animated animate__fadeOut"] // `animate.css v4` classes
        };
        
        Store.addNotification({
            ...notification,
            type: type,
            title: title,
            message: message,
            container: 'top-right',
            dismiss: {
                duration: 2000,
                pauseOnHover: true,
            }
        });
    };

    const [email,setEmail] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        // console.log(e)
        if(email !== '') {
            notificationTrigger({
                type: 'success',
                title: 'Subscription Successful',
                message: `Thank you for subscribing to our newsletter! We're thrilled to have you on board`
            })
        } else{
            notificationTrigger({
                type: 'info',
                title: 'Email Required',
                message: `Please enter a valid email address to subscribe to our newsletter and enjoy the benefits!`
            })
        }
    }
    return (
        <>
            <div className='w-full flex py-10 justify-center items-center '>
                    <div className='md:w-6/12 w-10/12 flex flex-col bg-zinc-50 px-5 rounded-lg py-3 gap-2 items-center justify-center selection:bg-rose-500 selection:text-white'>
                        <div className='text-center '>
                                <div className=''>
                                    <h1 className='md:text-4xl text-xl font-DMSans font-extrabold text-zinc-800 text-center '>Subscribe to our newsletter to get updates to our latest collections</h1>
                                </div>

                                <div>
                                    <h3 className='md:text-base text-sm font-medium font-DMSans text-zinc-500'>Get 20% off on your first order just by subscribing to our newsletter</h3>
                                </div>

                        </div>

                        <div className='flex gap-2 '>
                        <form onSubmit={handleSubmit} className='flex gap-2'>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Enter your email"
                                className="font-DMSans shadow-inner font-bold px-4 py-2 focus:outline-none border-[1px] border-zinc-600 rounded-md placeholder:font-normal placeholder:text-sm text-zinc-700"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button
                                className="bg-zinc-800 text-white p-2 font-DMSans font-bold rounded-md"
                                type="submit"
                            >
                                Subscribe
                            </button>
                        </form>
                        </div>

                        <div className='text-center'>
                            <h3 className='text-sm font-DMSans text-zinc-400'>You will be able to unsubscribe at any time.</h3>
                            <h3 className='text-sm font-DMSans text-zinc-400'>Read our privacy policy <NavLink to={'/'} className={`underline text-zinc-800`}>here</NavLink></h3>
                        </div>

                    </div>
            </div>
        
        </>
    )
}

export default Testimonial