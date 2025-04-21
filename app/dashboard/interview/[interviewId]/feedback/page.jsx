// "use client"

// import { db } from '@/utils/db'
// import { UserAnswer } from '@/utils/schema'
// import { eq } from 'drizzle-orm'
// import { ChevronsUpDown, Lightbulb, PartyPopper } from 'lucide-react'
// import React, { useEffect, useState } from 'react'
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible"
// import { Button } from '@/components/ui/button'
// import { useRouter } from 'next/navigation'


// function Feedback({ params }) {
//   const router = useRouter()
//   const [feedbackList, setFeedbackList] = useState([])

//   const[rating,setrating]=useState(0);

//   useEffect(() => {
//     GetFeedback()
//   }, [])


//   const GetFeedback = async () => {
//     const result = await db.select()
//       .from(UserAnswer)
//       .where((eq(UserAnswer.mockIdRef, params.interviewId)))
//       .orderBy(UserAnswer.id)

//     // console.log('result eeeeeeeeeeeeeeeeeee', result)
//     setFeedbackList(result)
//   }

//   return (
//     feedbackList && feedbackList.length > 0 ? (
//       <div className='p-10 border rounded-lg my-10'>
//         <h2 className='flex gap-2 text-3xl font-bold text-green-500'><PartyPopper /> Congratulations!</h2>
//         <h2 className='text-primary text-xl my-3'>Your overall interview rating: <strong>7/10</strong> </h2>
//         <h2 className='text-sm text-gray-500'>Find below interview question with correct answer, your answer and feedback for improvment</h2>

//         {feedbackList.map((item, index) => (
//           <Collapsible key={index}>
//             <CollapsibleTrigger className='flex justify-between text-left p-2 bg-secondary rounded-lg my-2 w-full'>
//               {item.question} <ChevronsUpDown className='h-5 w-5' />
//             </CollapsibleTrigger>
//             <CollapsibleContent className='px-5'>
//               <div className='flex flex-col gap-2'>
//                 <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating:</strong>{item.rating}</h2>
//                 <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer: </strong>{item.userAns} </h2>
//                 <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer: </strong>{item.correctAns} </h2>
//                 <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-blue-900'><strong>Feedback: </strong>{item.feedback} </h2>
//               </div>
//             </CollapsibleContent>
//           </Collapsible>

//         ))}
//         <Button onClick={() => router.replace('/dashboard')}>Go Home</Button>
//       </div >
//     ) : (
//       <div className='flex flex-col items-center justify-center mt-20'>
//         <h2 className='font-bold text-xl mb-5'>No feedback avaible for this interview yet.</h2>
//         <Button onClick={() => router.replace('/dashboard')}>Go Home</Button>
//       </div>
//     )
//   );
// }

// export default Feedback

"use client"

import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { ChevronsUpDown, PartyPopper } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'


function Feedback({ params }) {
  const router = useRouter()
  const [feedbackList, setFeedbackList] = useState([])
  const [rating, setRating] = useState(0)

  useEffect(() => {
    GetFeedback()
  }, [])

  const GetFeedback = async () => {
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, params.interviewId))
        .orderBy(UserAnswer.id)

      setFeedbackList(result)

      // Calculate total rating and update state
      let totalRating = 0
      result.forEach(item => {
        totalRating += Number(item.rating) || 0 // Ensure it's a number
      })
      setRating(totalRating / (result.length || 1)) // Avoid division by zero
    } catch (error) {
      console.error("Error fetching feedback:", error)
    }
  }

  return (
    feedbackList.length > 0 ? (
      <div className='p-10 border rounded-lg my-10'>
        <h2 className='flex gap-2 text-3xl font-bold text-green-500'><PartyPopper /> Congratulations!</h2>
        <h2 className='text-primary text-xl my-3'>
          Your overall interview rating: <strong>{rating.toFixed(1)}/10</strong>
        </h2>
        <h2 className='text-sm text-gray-500'>Find below interview question with correct answer, your answer and feedback for improvement</h2>

        {feedbackList.map((item, index) => (
          <Collapsible key={index}>
            <CollapsibleTrigger className='flex justify-between text-left p-2 bg-secondary rounded-lg my-2 w-full'>
              {item.question} <ChevronsUpDown className='h-5 w-5' />
            </CollapsibleTrigger>
            <CollapsibleContent className='px-5'>
              <div className='flex flex-col gap-2'>
                <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating:</strong> {item.rating}</h2>
                <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer: </strong>{item.userAns} </h2>
                <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer: </strong>{item.correctAns} </h2>
                <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-blue-900'><strong>Feedback: </strong>{item.feedback} </h2>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
        <Button onClick={() => router.replace('/dashboard')}>Go Home</Button>
      </div>
    ) : (
      <div className='flex flex-col items-center justify-center mt-20'>
        <h2 className='font-bold text-xl mb-5'>No feedback available for this interview yet.</h2>
        <Button onClick={() => router.replace('/dashboard')}>Go Home</Button>
      </div>
    )
  )
}

export default Feedback
