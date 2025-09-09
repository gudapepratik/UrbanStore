import React, { useEffect, useState } from 'react'
import ReviewBar from './ReviewBar'
import ReviewForm from './ReviewForm'
import UserReview from './UserReview'
import reviewsServices from '../../api/services/reviews.services'
import { triggerNotification } from '../../utils/triggerNotification.utils'

function ReviewPage({productId}) {
    const [reviews,setReviews] = useState(null)
    const [reviewMetrics, setReviewMetrics] = useState(null)

    const [reviewFormData, setReviewFormData] = useState({
        review: "",
        rating: 0,
        images: {}
    })

    useEffect(() => {
        fetchReviews()
        fetchReviewMetrics()
    },[productId])

    const fetchReviews = async () => {
        try {
            const reviewsResponse = await reviewsServices.getProductReviews({productId: productId})
            setReviews(reviewsResponse.data.data)
        } catch (error) {
            console.log(error)
        }

        
    }

    const fetchReviewMetrics =async () => {
        try {
            const response = await reviewsServices.getProductReviewMetrics({productId}) 
            setReviewMetrics(response.data.data[0])
        } catch (error) {
            console.log(error)
        }
    }

    const submitFormHandler = async () => {
        try {
            if(!reviewFormData.review || !reviewFormData.rating ) throw new Error("Fields missing, Ensure all fields are fields")

            const response = await reviewsServices.addProductReview({
                productId: productId,
                images: reviewFormData.images,
                review: reviewFormData.review,
                rating: reviewFormData.rating
            })

            triggerNotification({
                type: "success",
                title: "Review Submitted!",
                message: "Thank you for your feedback! Your review will be added soon after approval."
            });

            setReviewFormData({
                review: "",
                rating: 0,
                images: {}
            })

            // add the new 
        } catch (error) {
            console.log(error)
            alert(`${error?.message || "Something went wrong"}`)
            // triggerNotification({
            //     type: "error",
            //     title: "Submission Failed!",
            //     message: `${error?.message || "Something went wrong"}`
            // });
        }
    }

  return (
    <>
        <div className='w-full font-DMSans mb-40 flex flex-col gap-2 items-center p-4'>
            {/* heading  */}
            <div className='w-full'>
                <h1 className='text-start font-bold text-xl md:text-3xl text-zinc-800'>Customer Review & Ratings</h1>
            </div>

            {/* Top review metrics container  */}
            <div className='w-full flex gap-2 flex-col md:flex-row justify-between'>
                {/* Ratings section  */}
                <div className='md:w-[calc(100%-40%)] w-full'>
                    <div className='w-full border flex items-center flex-col gap-2 p-6'>
                        {reviewMetrics ? (
                            <>
                                <div className='justify-center text-blue-800 p-2 rounded-xl w-fit bg-blue-200  flex items-center gap-2'>
                                    <h1 className='font-bold font-DMSans text-2xl'>{reviewMetrics.avgRating}</h1>
                                    <h2 className='font-DMSans text-sm'>{reviewMetrics.totalReviews + " ratings"}</h2>
                                </div>
                                {Object.keys(reviewMetrics?.ratingCounts).map((key) => (
                                    <ReviewBar key={key} stars={key} count={reviewMetrics?.ratingCounts[key]} total={reviewMetrics.totalReviews}/>
                                ))}
                            </>
                        )
                        :
                        (
                            <div className='w-full text-zinc-800 justify-center flex items-center text-lg md:text-2xl font-medium text-center md:h-60'>
                                No Reviews
                            </div>
                        )}
                    </div>
                </div>

                {/* write review button  */}
                <div className='md:w-[calc(100%-60%)] w-full flex justify-start p-2 border '>
                    <ReviewForm formData={reviewFormData} setFormData={setReviewFormData} submitFormHandler={submitFormHandler}/>
                </div>
            </div>

            {/* Customer reviews section  */}
            <div className='w-full flex flex-col gap-4'>
                    {reviews && reviews.map((item,key) => (
                        <UserReview key={key} reviewDetails={item}/>
                    ))}
            </div>
        </div>
    </>
  )
}

export default ReviewPage