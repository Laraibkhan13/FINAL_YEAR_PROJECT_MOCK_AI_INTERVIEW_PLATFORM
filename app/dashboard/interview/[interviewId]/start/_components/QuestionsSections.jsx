import { Lightbulb, Volume, Volume2 } from 'lucide-react'
import React from 'react'

function QuestionsSections({ mockInterviewQuestions, activeQuestionIndex }) {

    const textToSpeech = (text) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        } else {
            alert('Your browser does not support text to speech')
        }
    }

    return (
        mockInterviewQuestions &&
        <div className='p-5 border rounded-lg my-10'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {mockInterviewQuestions && mockInterviewQuestions.map((question, index) => (
                    <div key={index} className=''>
                        <h2 className={`p-2 border rounded-full text-sx md:text-sm text-center cursor-pointer ${activeQuestionIndex == index && 'bg-primary text-white'}`}>Question {index + 1}</h2>
                    </div>
                ))}
            </div>
            <h2 className='my-5 text-md md:text-lg'>{mockInterviewQuestions[activeQuestionIndex]?.question}</h2>

            <Volume2 className='cursor-pointer' onClick={() => textToSpeech(mockInterviewQuestions[activeQuestionIndex]?.question)} />

            <div className='p-5 border rounded-lg border-blue-300 bg-blue-100 mt-20'>
                <h2 className='flex gap-2 items-center text-blue-500'><Lightbulb /><strong>Information</strong></h2>
                <h2 className='my-2 text-sm text-blue-500'>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
            </div>
        </div>
    )
}

export default QuestionsSections