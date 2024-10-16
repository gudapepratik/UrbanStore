import React from 'react'

function Popup({
    toggleshow = false,
}) {
  return (
    <>
    {
        !toggleshow && (
            <h1>Hello</h1>
        )
    }
    </>
  )
}

export default Popup