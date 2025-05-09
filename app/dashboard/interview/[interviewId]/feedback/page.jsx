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

import jsPDF from 'jspdf'




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

  // const downloadFeedbackPdf = () => {
  //   const doc = new jsPDF()
  //   const margin = 10
  //   let y = margin
  
  //   doc.setFontSize(16)
  //   doc.setTextColor(0, 128, 0)
  //   doc.text("Interview Feedback Report", margin, y)
  //   y += 10
  
  //   doc.setFontSize(12)
  //   doc.setTextColor(0, 0, 0)
  
  //   feedbackList.forEach((item, index) => {
  //     const lines = doc.splitTextToSize(
  //       `Q${index + 1}: ${item.question}\n\nYour Answer: ${item.userAns}\nCorrect Answer: ${item.correctAns}\nRating: ${item.rating}\nFeedback: ${item.feedback}`,
  //       180
  //     )
  
  //     if (y + lines.length * 8 > 280) {
  //       doc.addPage()
  //       y = margin
  //     }
  
  //     doc.text(lines, margin, y)
  //     y += lines.length * 8 + 4
  //   })
  
  //   doc.save(`Interview_Feedback_${params.interviewId}.pdf`)
  // }
  
  // const downloadFeedbackPdf = () => {
  //   const doc = new jsPDF()
  //   const pageWidth = doc.internal.pageSize.getWidth()
  //   const margin = 15
  //   let y = margin
  
  //   const sectionGap = 10
  //   const lineHeight = 6
  //   const maxY = 280
  
  //   doc.setFontSize(18)
  //   doc.setTextColor(34, 139, 34)
  //   doc.text("Interview Feedback Report", margin, y)
  //   y += 12
  
  //   doc.setFontSize(14)
  //   doc.setTextColor(0, 0, 0)
  //   doc.text(`Interview ID: ${params.interviewId}`, margin, y)
  //   y += 8
  
  //   doc.setFontSize(12)
  
  //   feedbackList.forEach((item, index) => {
  //     if (y > maxY) {
  //       doc.addPage()
  //       y = margin
  //     }
  
  //     doc.setTextColor(0, 0, 255)
  //     doc.setFontSize(13)
  //     doc.text(`Q${index + 1}: ${item.question}`, margin, y)
  //     y += lineHeight
  
  //     doc.setFontSize(12)
  
  //     const wrapText = (label, value, color) => {
  //       if (y > maxY) {
  //         doc.addPage()
  //         y = margin
  //       }
  //       doc.setTextColor(100)
  //       doc.text(`${label}`, margin, y)
  //       y += 6
  //       doc.setTextColor(...color)
  //       const lines = doc.splitTextToSize(value || '-', pageWidth - 2 * margin)
  //       doc.text(lines, margin + 5, y)
  //       y += lines.length * 6
  //     }
  
  //     wrapText("Your Answer:", item.userAns, [200, 0, 0])
  //     wrapText("Correct Answer:", item.correctAns, [0, 128, 0])
  //     wrapText("Rating:", String(item.rating), [0, 0, 0])
  //     wrapText("Feedback:", item.feedback, [0, 0, 150])
  
  //     y += sectionGap
  //   })
  
  //   doc.save(`Interview_Feedback_${params.interviewId}.pdf`)
  // }
  

  const downloadFeedbackPdf = () => {
    const doc = new jsPDF()
    const margin = 20
    const pageHeight = doc.internal.pageSize.getHeight()
    const pageWidth = doc.internal.pageSize.getWidth()
    const contentWidth = pageWidth - margin * 2
    let y = margin
  
    const sectionGap = 10
    const lineHeight = 6
    const maxY = pageHeight - margin
  
    doc.setFontSize(18)
    doc.setTextColor(34, 139, 34)
    doc.text("Interview Feedback Report", margin, y)
    y += 12
  
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text(`Interview ID: ${params.interviewId}`, margin, y)
    y += 10
  
    const drawWrappedText = (label, value, color) => {
      if (y > maxY - 30) {
        doc.addPage()
        y = margin
      }
  
      doc.setFontSize(12)
      doc.setTextColor(80)
      doc.text(label, margin, y)
      y += 5
  
      doc.setTextColor(...color)
      const lines = doc.splitTextToSize(value || '-', contentWidth)
      lines.forEach((line) => {
        doc.text(line, margin, y, { maxWidth: contentWidth })
        y += lineHeight
      })
      y += 3
    }
  
    feedbackList.forEach((item, index) => {
      if (y > maxY - 60) {
        doc.addPage()
        y = margin
      }
  
      doc.setTextColor(0, 0, 180)
      doc.setFontSize(13)
      const questionLines = doc.splitTextToSize(`Q${index + 1}: ${item.question}`, contentWidth)
      questionLines.forEach((line) => {
        doc.text(line, margin, y, { maxWidth: contentWidth })
        y += lineHeight
      })
  
      y += 4
  
      drawWrappedText("Your Answer:", item.userAns, [200, 0, 0])
      drawWrappedText("Correct Answer:", item.correctAns, [0, 128, 0])
      drawWrappedText("Rating:", String(item.rating), [0, 0, 0])
      drawWrappedText("Feedback:", item.feedback, [0, 0, 150])
  
      y += sectionGap
    })
  
    doc.save(`Interview_Feedback_${params.interviewId}.pdf`)
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
        <Button onClick={downloadFeedbackPdf} className='ml-4' variant="outline">
  Download Feedback as PDF
</Button>
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
