import { RiCloseLine, RiCrossLine, RiUpload2Line } from "@remixicon/react";
import React, { useState } from "react";

function ReviewForm({ formData, setFormData, submitFormHandler }) {

  const [imagePreviews, setImagePreview] = useState(null)

  const handleFormInput = (type, data) => {
    setFormData((prev) => ({ ...prev, [type]: data }));
    if(type === 'images') {
      handleImageInput(data);
    }
  };

  const handleImageInput = (data) => {
    const files = Array.from(data)

      if(files.length > 4){
        alert('Maximum 4 images can be uploaded')
        setImagePreview(null)
      } else{
        const urls = files.map((file) => URL.createObjectURL(file))
        setImagePreview(urls.map(url => {return url}))
      }
  }

  const handleRemoveImages = () => {
    setImagePreview(null)
    setFormData((prev) => ({ ...prev, "images": {} }));
  }

  return (
    <div className="w-full text-zinc-800 font-DMSans flex flex-col gap-2">
      <h1 className="font-medium text-zinc-800 text-lg">Submit your review</h1>

      <div className="w-full flex flex-col justify-start gap-4">
        <div className="flex flex-col">
          <label htmlFor="rating" className="text-sm font-medium">Rating</label>
          <input
            type="number"
            id="rating"
            placeholder="How much would you rate this product ?"
            value={formData.rating}
            className="p-2 w-full  text-sm bg-zinc-100 focus:outline-none border"
            max={5}
            min={0}
            onChange={(e) => handleFormInput("rating", e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="review" className="text-sm font-medium">Feedback</label>
          <textarea
            id="review"
            placeholder="How was your experience with the product?"
            value={formData.review}
            className="p-2 w-full text-sm bg-zinc-100 min-h-16 max-h-40 focus:outline-none border"
            maxLength={200}
            onChange={(e) => handleFormInput("review", e.target.value)}
          />
        </div>

        <div className="w-full flex items-center flex-wrap justify-between gap-5 pr-10">
            {!imagePreviews && <label htmlFor="images" className="bg-zinc-100 px-2 py-2 rounded-lg flex gap-2 items-center text-sm"><RiUpload2Line size={18}/> upload images</label>}
            {imagePreviews && (
              <div className="w-[70%] flex gap-2 items-center">
                <div className="  p-1 flex items-center gap-2">
                  {imagePreviews.map((item,key) => (
                    <div key={key} className="w-10 h-10 bg-red-300 rounded-md overflow-hidden">
                      <img src={item} alt="image" className="w-full h-full object-cover object-center"/>
                    </div>
                  ))}
                </div>
                <button className="bg-zinc-100 p-1 rounded-lg" onClick={handleRemoveImages}><RiCloseLine/></button>
                <label htmlFor="images" className="bg-zinc-100 px-2 py-2 rounded-lg flex gap-2 items-center text-sm"><RiUpload2Line size={18}/> upload</label>
              </div>
            )}
            <input type="file" id="images" className="hidden" multiple onChange={(e) => handleFormInput("images", e.target.files)}/>

            <button className="bg-blue-500 px-4 py-2 text-white rounded-md" onClick={submitFormHandler}>Submit review</button>
        </div>
      </div>
    </div>
  );
}

export default ReviewForm;
