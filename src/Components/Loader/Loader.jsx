import React from 'react'

function Loader() {
  return (
    <>
        <div className="w-full h-screen fixed bg-transparent bg-opacity-5 backdrop-blur-sm flex z-60 top-0 left-0 items-center justify-center">
            <div className="p-8 border-t-transparent border-8 rounded-full border-rose-500 animate-spin ">
            </div>
        </div>
    </>
  )
}

export default Loader