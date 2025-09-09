import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { emptycartimg } from '../../assets/asset'

const EmptyCart = () => {
    const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background selection:bg-rose-500 selection:text-white font-DMSans">
      <div className="text-center">
        <img src={emptycartimg} alt="empty cart" className="mx-auto h-40 w-40 text-muted-foreground mb-4 selection:bg-none"/>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added any items to your cart yet.</p>
        <button className={`border p-3 rounded-lg hover:ring-1 hover:text-white text-rose-500 hover:bg-rose-500 font-DMSans font-medium transition-all border-rose-500 ring-rose-500`}
        onClick={() => navigate('/products')}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}

export default EmptyCart