import React from 'react'
import { NavLink } from 'react-router-dom'

function Testimonial() {
  return (
    <>
        <div className='w-full flex py-10 justify-center items-center '>
                <div className='md:w-6/12 w-10/12 flex flex-col bg-zinc-50 px-5 rounded-lg py-3 gap-5 items-center justify-center selection:bg-rose-500 selection:text-white'>
                    <div className='text-center '>
                            <div className=''>
                                <h1 className='md:text-4xl text-2xl font-DMSans font-extrabold text-zinc-800 text-center'>Subscribe to our newsletter to get updates to our latest collections</h1>
                            </div>

                            <div>
                                <h3 className='md:text-base text-sm font-medium font-DMSans text-zinc-500'>Get 20% off on your first order just by subscribing to our newsletter</h3>
                            </div>

                    </div>

                    <div className='flex gap-2 '>
                        <input type="email" name="email" id="" placeholder='Enter your email' className='font-DMSans shadow-inner font-bold px-4 py-2 focus:outline-none border-[1px] border-zinc-600 rounded-md placeholder:font-normal placeholder:text-sm text-zinc-700'/>
                        <button className='bg-zinc-800 text-white p-2 font-DMSans font-bold rounded-md'>Subscribe</button>
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