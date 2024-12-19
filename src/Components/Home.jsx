import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {login,logout} from '../store/authSlice'
import CreateAcc  from './CreateAcc'
import {dashboardimg1, Home1, Home2, Home3, Home4, HomeCardimg1, HomeCardimg2, HomeCardimg3, HomeCardimg4, HomeCardimg5, shopusbox, shopusguarantee, shopusvan} from '../assets/asset.js'
import Footer from './Footer.jsx'
import Testimonial from './Testimonial/Testimonial.jsx'
import { Swiper, SwiperSlide } from 'swiper/react';
// import required modules
import { EffectFade,Autoplay, Pagination, Navigation, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router'
import { setFilter } from '../store/productSlice.js'
import { ReactNotifications, Store } from 'react-notifications-component'

function Home() {
  const user = useSelector(state => state.authSlice.userData)
  const status = useSelector(state => state.authSlice.status)
  // console.log(user)

  // navigate
  const navigate = useNavigate()

  // dispatch
  const dispatch = useDispatch()

  const filterCategory = useSelector(state => state.productSlice.filterCategories)

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

  useEffect(() => {
    // use window.scrollTo() method to scroll to top smoothly whenever user clicks on next or prev buttons
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  },[])

  const handleNavigateToProducts = (filterToSearch,type) => {
    if(type === 'single') {
      dispatch(setFilter([filterToSearch]))
    }
    if(type === 'multi'){
      dispatch(setFilter(filterToSearch))
    }
    navigate('/products')
  }

  return (

    <>
      {/* main part */}
      <div>
        {/* first image corousal */}
      <ReactNotifications/>
        
        <div className='w-full mb-4 md:mb-0 relative md:-top-32 snap-x scrollbar-hide overflow-scroll'>
              {/* <img src={dashboardimg1} alt="" className=' object-cover -z-10'/> */}
              <Swiper
                style={{
                  '--swiper-pagination-color': '#e11d48',
                }}
                spaceBetween={10}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                loop = {Infinity}
                modules={[Autoplay, Pagination, Navigation]}
                className="w-full"
              >
                <SwiperSlide className="w-full">
                  <img
                    src={Home3}
                    alt=""
                    className="w-full h-auto object-cover shadow-md transition-all duration-300 "
                  />
                </SwiperSlide>
                <SwiperSlide className="w-full">
                  <img
                    src={Home1}
                    alt=""
                    className="w-full h-auto object-cover shadow-md transition-all duration-300"
                  />
                </SwiperSlide>
                <SwiperSlide className="w-full">
                  <img
                    src={Home4}
                    alt=""
                    className="w-full h-auto object-cover shadow-md transition-all duration-300 "
                  />
                </SwiperSlide>
                <SwiperSlide className="w-full">
                  <img
                    src={Home2}
                    alt=""
                    className="w-full h-auto object-cover  transition-all duration-300"
                  />
                </SwiperSlide>
              
          </Swiper>
        </div>
        
        <div className=''>
            {/* Why shop from here section  */}
            <div className='flex w-full items-center justify-around md:justify-evenly'>   
                <div className='flex flex-col items-center gap-2 selection:bg-rose-500 selection:text-white'>
                  <svg viewBox="-0.5 -0.5 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" id="Delivery-Truck--Streamline-Iconoir" className=' stroke-zinc-800 w-6 md:w-14'><desc>Delivery Truck Streamline Icon: https://streamlinehq.com</desc><path d="M7.663408333333334 17.734437500000002c1.0594375 0 1.9182958333333335 -0.8587625000000001 1.9182958333333335 -1.9182958333333335s-0.8588583333333334 -1.9182958333333335 -1.9182958333333335 -1.9182958333333335 -1.9182958333333335 0.8588583333333334 -1.9182958333333335 1.9182958333333335 0.8588583333333334 1.9182958333333335 1.9182958333333335 1.9182958333333335Z"  stroke-miterlimit="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path><path d="M17.2548875 17.734437500000002c1.0594375 0 1.9182958333333335 -0.8587625000000001 1.9182958333333335 -1.9182958333333335s-0.8588583333333334 -1.9182958333333335 -1.9182958333333335 -1.9182958333333335 -1.9182958333333335 0.8588583333333334 -1.9182958333333335 1.9182958333333335 0.8588583333333334 1.9182958333333335 1.9182958333333335 1.9182958333333335Z"  stroke-miterlimit="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path><path d="M9.629620833333334 15.816141666666665h4.747870833333334V5.8410416666666665c0 -0.31787916666666666 -0.2576958333333333 -0.5754791666666668 -0.5755750000000001 -0.5754791666666668H0.9493250000000001"  stroke-linecap="round" stroke-width="1"></path><path d="M5.409408333333333 15.816141666666665H3.4431000000000003c-0.31778333333333336 0 -0.5754791666666668 -0.2576 -0.5754791666666668 -0.5754791666666668v-4.6997625" stroke-linecap="round" stroke-width="1"></path><path d="M1.9085208333333334 8.142958333333334h3.836591666666667"  stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path><path d="M14.377491666666666 8.142958333333334h5.38085c0.22741250000000002 0 0.43355000000000005 0.133975 0.5259333333333334 0.34174166666666667l1.7167583333333336 3.8628500000000003c0.03267916666666667 0.0736 0.04964166666666667 0.1532375 0.04964166666666667 0.23373750000000001v2.659375c0 0.31787916666666666 -0.2576958333333333 0.5754791666666668 -0.5755750000000001 0.5754791666666668h-1.8223666666666667"  stroke-linecap="round" stroke-width="1"></path><path d="M14.377491666666666 15.816141666666665h0.9591"  stroke-linecap="round" stroke-width="1"></path></svg>
                  <div className='flex items-center justify-center flex-col '>
                    <h3 className='font-extrabold text-rose-500 font-DMSans text-[0.6rem] md:text-lg'>Free Delivery</h3>
                    <h3 className='font-DMSans text-zinc-500 text-[0.5rem] md:text-sm' >Within 5 days</h3>
                  </div>
                </div>
                <div className='flex flex-col items-center gap-2 selection:bg-rose-500 selection:text-white'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-0.5 -0.5 24 24" id="Shipment-Return--Streamline-Sharp" className=' stroke-zinc-800 w-6 md:w-14' ><desc>Shipment Return Streamline Icon: https://streamlinehq.com</desc><g id="shipment-return--shipment-return-parcel-shipping-box-arrow" ><path id="Vector 1144"  d="M7.3366741666666675 11.745237500000002h5.605042500000001c1.5152208333333332 0 2.743516666666667 1.2282958333333334 2.743516666666667 2.743516666666667 0 1.515125 -1.2282958333333334 2.7434208333333334 -2.743516666666667 2.7434208333333334H7.468540833333334" stroke-width="1"></path><path id="Vector 2758"  d="M10.1683 8.893649583333334 7.316750416666667 11.745237500000002l2.8515495833333335 2.8515208333333333" stroke-width="1"></path><path id="Vector 5"  d="M11.5 1.9512912500000001v4.791666666666667" stroke-width="1"></path><path id="Vector 6"  d="M11.5 21.11792916666667H1.9166666666666667V5.648617916666667l3.354166666666667 -3.697326666666667h12.458333333333334L21.083333333333336 5.648617916666667l0 15.46931125H11.5Z" stroke-width="1"></path><path id="Vector 3896"  d="M1.9166666666666667 6.708333333333334h19.166666666666668" stroke-width="1"></path></g></svg>
                  <div className='flex items-center justify-center flex-col '>
                    <h3 className='font-extrabold text-rose-500 font-DMSans text-[0.6rem] md:text-lg'>10 days returns</h3>
                    <h3 className='font-DMSans text-zinc-500 text-[0.5rem] md:text-sm' >no questions asked</h3>
                  </div>
                </div>
                <div className='flex flex-col items-center gap-2 selection:bg-rose-500 selection:text-white'>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="Award-Ribbon-Star-1--Streamline-Ultimate" className='text-zinc-800 w-6 md:w-14'><desc>Award Ribbon Star 1 Streamline Icon: https://streamlinehq.com</desc><path d="m4.238 14.416 -3.171 5.475a0.5 0.5 0 0 0 0.516 0.744l2.8 -0.474 0.975 2.679a0.5 0.5 0 0 0 0.9 0.085l2.723 -4.607" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path><path d="m19.762 14.416 3.171 5.475a0.5 0.5 0 0 1 -0.516 0.744l-2.8 -0.474 -0.975 2.679a0.5 0.5 0 0 1 -0.9 0.085l-2.723 -4.607" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path><path d="M2.984 9.83a9 9 0 1 0 18 0 9 9 0 1 0 -18 0Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path><path d="m12.572 5.189 1.282 2.644h2.5a0.613 0.613 0 0 1 0.427 1.067l-2.166 2.135 1.2 2.761a0.654 0.654 0 0 1 -0.931 0.818l-2.9 -1.634 -2.9 1.634a0.654 0.654 0 0 1 -0.931 -0.818l1.2 -2.761L7.187 8.9a0.612 0.612 0 0 1 0.429 -1.069h2.5L11.4 5.189a0.661 0.661 0 0 1 1.172 0Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path></svg>
                  
                  <div className='flex items-center justify-center flex-col '>
                    <h3 className='font-extrabold text-rose-500 font-DMSans text-[0.6rem] md:text-lg'>3* Year Warranty</h3>
                    <h3 className='font-DMSans text-zinc-500 text-[0.5rem] md:text-sm' >Dedicated Customer support</h3>
                  </div>
                </div>
            </div>

            {/* slider  */}
            {/* <div className='relative m-auto w-[500px] flex overflow-hidden bg-rose-500 before:absolute before:left-0 before:top-0 before:z-[2] before:h-full before:w-[100px] before:bg-[linear-gradient(to_right,white_0%,rgba(255,255,255,0)_100%)] before:content-[""] after:absolute after:right-0 after:top-0 after:z-[2] after:h-full after:w-[100px] after:-scale-x-100 after:bg-[linear-gradient(to_right,white_0%,rgba(255,255,255,0)_100%)] after:content-[""]'>
                <ul className='flex items-center justify-center gap-2 animate-infinite-slider text-sm font-DMSans font-bold text-white'>
                  <li className='text-nowrap'>UrbanStore * </li>
                  <li className='text-nowrap'>UrbanStore * </li>
                  <li className='text-nowrap'>UrbanStore * </li>
                  <li className='text-nowrap'>UrbanStore * </li>
                  <li className='text-nowrap'>UrbanStore * </li>
                  <li className='text-nowrap'>UrbanStore * </li>
                  <li className='text-nowrap'>UrbanStore * </li>
      
                </ul>
                <ul className='flex items-center justify-center animate-infinite-slider text-sm font-DMSans font-bold text-white'>
                  <li className='text-nowrap'>UrbanStore * </li>
                  <li className='text-nowrap'>UrbanStore * </li>
                  <li className='text-nowrap'>UrbanStore * </li>
                  <li className='text-nowrap'>UrbanStore * </li>
                  <li className='text-nowrap'>UrbanStore * </li>
                  <li className='text-nowrap'>UrbanStore * </li>
                  <li className='text-nowrap'>UrbanStore * </li>
      
                </ul>
            </div> */}

            {/* Image section  */}
            <div className='w-full  py-8'>
              <div className='w-full text-center md:text-3xl selection:bg-rose-500 selection:text-white text-2xl font-DMSans font-bold text-zinc-800'>Shop the best</div>
              <div className='w-fit md:px-60 sm:px-20  flex justify-center'>

                <div className='w-full md:justify-center md:h-svh flex'>
                  {/* left part */}
                  <div className='w-3/5 h-96 md:h-full flex flex-col gap-3 p-4 pr-1.5'>
                    <div className='w-full h-1/2  overflow-hidden'>
                      <img src={dashboardimg1}  alt=""  
                      className='  scale-125 translate-y-4 -translate-x-5 md:-translate-x-0  md:hover:scale-110 md:-translate-y-2 md:scale-105    transition-all duration-300'
                      onClick={() => handleNavigateToProducts(filterCategory['unisex']['general'],'multi')}
                      />

                    </div>
                    <div className='grid grid-cols-2 w-full h-1/2 gap-3'>
                          <div className='overflow-hidden'>  
                            <img src={HomeCardimg2} alt="" 
                            className='md:object-cover object-contain scale-150 translate-x-5 md:scale-100 md:translate-x-0  h-full md:hover:scale-105 transition-all  duration-300'
                            onClick={() => handleNavigateToProducts(filterCategory['men']['winterWear'],'multi')}
                            
                            />

                          </div>
                          <div className=' overflow-hidden'>
                          <img 
                            src={HomeCardimg3} 
                            alt="" 
                            className='object-cover  h-full md:hover:scale-105 transition-all duration-300'
                            onClick={() => handleNavigateToProducts(filterCategory['men']['footwear'],'multi')}
                            />
                          </div>
                    </div>
                  </div>
                  
                  {/* right part  */}
                  <div className='w-2/5 h-96 md:h-svh'>
                        <div className='flex flex-col h-full p-4 pl-1.5 gap-3'>
                          <div className='w-full h-3/5  overflow-hidden'>
                          <img 
                          src={HomeCardimg5} alt="" 
                          className='md:hover:scale-110 h-full object-cover  md:scale-105 transition-all duration-300'
                          onClick={() => handleNavigateToProducts(`Men's Hoodies & Sweatshirts`,'single')}
                          />

                          </div>
                          <div className='w-full h-2/5  overflow-hidden'>
                            <img src={HomeCardimg4} alt="" 
                            className='md:hover:scale-105 md:-translate-y-20 -translate-y-5  transition-all duration-300'
                            onClick={() => handleNavigateToProducts(`Men's Sunglasses`,'single')}
                            />
                          </div>

                        </div>
                  </div>
                </div>
              </div>
            </div>


            {/* cards (under implementation) */}
            {/* <div className='w-full px-3 md:px-0 flex justify-center'>
              <Swiper
              slidesPerView={4}
              className="md:w-[calc(100vw-28rem)] w-full"
              freeMode = {true}
              modules={[FreeMode, Pagination]}
              >
              
                <SwiperSlide className="">
                    <div className='md:w-64 w-28 h-40 md:h-72 bg-red-200'></div>
                </SwiperSlide>
                <SwiperSlide className="">
                    <div className='md:w-64 w-28 h-40 md:h-72 bg-red-200'></div>
                </SwiperSlide>
                <SwiperSlide className="">
                    <div className='md:w-64 w-28 h-40 md:h-72 bg-red-200'></div>
                </SwiperSlide>
                <SwiperSlide className="">
                    <div className='md:w-64 w-28 h-40 md:h-72 bg-red-200'></div>
                </SwiperSlide>
                <SwiperSlide className="">
                    <div className='md:w-64 w-28 h-40 md:h-72 bg-red-200'></div>
                </SwiperSlide>

              </Swiper>


            </div> */}

            {/* Testimonial page  */}
            <Testimonial notificationTrigger={triggerNotification}/>
        {/* footer render */}
          <Footer/>
        </div>

      </div>
    </>
  )
}

export default Home