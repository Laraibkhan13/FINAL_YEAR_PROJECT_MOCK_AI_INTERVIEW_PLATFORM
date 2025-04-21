import { Button } from '@/components/ui/button'
import { db } from '@/utils/db';
import { chatSession } from '@/utils/GeminiAIModel';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { Mic, StopCircle } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import useSpeechToText from 'react-hook-speech-to-text';
import Webcam from 'react-webcam'
import { toast } from 'sonner';

function RecordAnswerSection({ activeQuestionIndex, mockInterviewQuestions, interviewData }) {

    const { user } = useUser()
    const [userAnswer, setUserAnswer] = useState('')
    const [loading, setLoading] = useState(false)

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    useEffect(() => {
        results.map((result) => (
            setUserAnswer(prevAns => prevAns + result?.transcript)
        ))
    }, [results])

    useEffect(() => {
        if (!isRecording && userAnswer?.length > 10) {
            UpdateUserAnswer()
        }
    }, [userAnswer])


    const StartStopRecording = async () => {
        if (isRecording) {
            stopSpeechToText()
        } else {
            startSpeechToText()
        }
    }

    const UpdateUserAnswer = async () => {
        setLoading(true)
        const feedbackPrompt = 'Question: ' + mockInterviewQuestions[activeQuestionIndex]?.question + ', User Answer: ' + userAnswer + ', depending upon question and user answer for the given interview question please give us rating for answer and feedback as area of imporvement if any in just 3-5 lines to imporve it in JSON format with rating field and feedback field.'

        // console.log('feedbackPrompt:', feedbackPrompt)

        const result = await chatSession.sendMessage(feedbackPrompt)

        const mockJsonResp = (result.response.text())
            .replace('```json', '').replace('```', '')
        // console.log(mockJsonResp)
        const JsonFeedbackResp = JSON.parse(mockJsonResp)

        const resp = await db.insert(UserAnswer).values({
            mockIdRef: interviewData?.mockId,
            question: mockInterviewQuestions[activeQuestionIndex]?.question,
            correctAns: mockInterviewQuestions[activeQuestionIndex]?.answer,
            userAns: userAnswer,
            feedback: JsonFeedbackResp?.feedback,
            rating: JsonFeedbackResp?.rating,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD-MM-YYYY')
        })

        if (resp) {
            toast('User Answer Recorded Successfully')
            setUserAnswer('')
        }
        setResults([])
        setLoading(false)
    }


    return (
        <div className='flex flex-col justify-center items-center'>

            <div className='flex flex-col mt-10 justify-center items-center bg-black rounded-lg p-5'>
                <Image src={'/webcam.png'} width={200} height={200} className="absolute" alt="microphone" />
                <Webcam
                    mirrored={true}
                    style={{
                        height: 300,
                        width: '100%',
                        zIndex: 10
                    }}
                />
            </div>

            <div className='flex my-10 gap-10'>
                <Button
                    disbabled={loading}
                    variant="outline"
                    onClick={StartStopRecording}
                >
                    {
                        isRecording ?
                            <h2 className='text-red-600 animate-pulse flex gap-2'>
                                <StopCircle size={20} /> Stop Recording...
                            </h2>
                            :
                            <h2 className='text-primary flex gap-2'>
                                <Mic size={20} /> Record Answer
                            </h2>
                    }
                </Button>

                <Button variant="outline" onClick={() => console.log(userAnswer)}>Show User Answer</Button>
            </div>
        </div>
    )
}

export default RecordAnswerSection