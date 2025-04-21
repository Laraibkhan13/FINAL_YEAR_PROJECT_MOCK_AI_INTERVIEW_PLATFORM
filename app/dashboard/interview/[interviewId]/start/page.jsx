"use client"
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import QuestionsSections from './_components/QuestionsSections'
import RecordAnswerSection from './_components/RecordAnswerSection'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function StartInterview({ params }) {
  const [interviewData, setInterviewData] = useState()
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState()
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)

  useEffect(() => {
    GetInterviewDetails()
  }, [])

  const GetInterviewDetails = async () => {
    const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId))

    // console.log('#########', result)
    setInterviewData(result[0]);

    const jsonMockResp = JSON.parse(result[0].jsonMockResp)
    setMockInterviewQuestions(jsonMockResp)
    // console.log('jsonMockResp:', jsonMockResp)
  }

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 '>
        {/* Questions */}
        <QuestionsSections
          activeQuestionIndex={activeQuestionIndex}
          mockInterviewQuestions={mockInterviewQuestions}
        />

        {/* video/ audio recording */}
        <div className='mt-10'>
          <div className='flex justify-between'>
            <Button
              disabled={activeQuestionIndex < 1}
              variant='outline'
              onClick={() => {
                if (activeQuestionIndex > 0) {
                  setActiveQuestionIndex(activeQuestionIndex - 1)
                }
              }}
            >
              Previous Question
            </Button>

            <Button
              variant='outline'
              disabled={activeQuestionIndex >= mockInterviewQuestions?.length - 1}
              onClick={() => {
                if (activeQuestionIndex < mockInterviewQuestions?.length - 1) {
                  setActiveQuestionIndex(activeQuestionIndex + 1)
                }
              }}
            >
              Next Question
            </Button>

            <Link href={'/dashboard/interview/' + interviewData?.mockId + '/feedback'}>
              <Button>End InterView</Button>
            </Link>

          </div>
          <RecordAnswerSection
            activeQuestionIndex={activeQuestionIndex}
            mockInterviewQuestions={mockInterviewQuestions}
            interviewData={interviewData}
          />
        </div>
      </div>
    </div>
  )
}

export default StartInterview