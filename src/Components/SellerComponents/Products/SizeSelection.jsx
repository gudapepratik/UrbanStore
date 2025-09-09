import React, { useState } from "react";

function SizeSelection({ isChecked,setIsChecked,availableSizes,sizesInfo, setSizes }) {
//   const [isChecked, setIsChecked] = useState([]);

  const handleSizeToggle = (key) => {
    setIsChecked((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  const sizeInfoHandler = (size, quantity) => {
    setSizes((prev) =>
      prev.map((item) =>
        item.size === String(size)
          ? { ...item, quantity: Number(quantity) }
          : item
      )
    );
  };

  const sizeInfoToggler = (size) => {
    setSizes((prev) => {
      console.log(prev);
      if (prev.some((item) => item.size === String(size))) {
        // Remove the item if it exists
        return prev.filter((item) => item.size !== String(size));
      } else {
        // Add the item if it does not exist
        return [...prev, { size: String(size), quantity: 1 }]; // Default quantity can be changed
      }
    });
  };

  return (
    <>
      <div className="w-full p-5 flex font-DMSans flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-lg font-medium">
            Select Sizes
          </label>
          <div className="grid grid-cols-3 gap-3 gap-x-12 w-fit items-center">
            {availableSizes.map((size, key) => (
              <div
                key={key}
                className="flex gap-2 font-DMSans font-medium justify-end items-center"
              >
                <label htmlFor={size}>{size}</label>
                <input
                  type="checkbox"
                  name={size}
                  className="size-4  cursor-pointer"
                  checked={isChecked.includes(key)}
                  onChange={() => {
                    sizeInfoToggler(size);
                    handleSizeToggle(key);
                  }}
                />

                <input
                  type="number"
                  min={1}
                  value={
                    sizesInfo.find((obj) => obj.size === String(size))
                      ?.quantity || 0
                  }
                  onChange={(e) => sizeInfoHandler(size, e.target.value)}
                  disabled={!isChecked.includes(key)}
                  className="px-3 py-2 w-28 rounded-md border border-zinc-400 focus:outline-none focus:ring-1 font-normal"
                  placeholder="quantity"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default SizeSelection;
