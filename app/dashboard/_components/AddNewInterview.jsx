"use client"
import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAIModel'
import { LoaderCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid'
import { useUser } from '@clerk/nextjs'
import moment from 'moment';
import { useRouter } from 'next/navigation'

function AddNewInterview() {
  const { user } = useUser()
  const [openDialog, setOpenDialog] = useState(false)
  const [jobPosition, setJobPosition] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [jobExperience, setJobExperience] = useState('')
  const [loading, setLoading] = useState(false)
  const [jsonResponse, setJsonResponse] = useState([])

  const [isAddEnabled, setIsAddEnabled] = useState(false);

  useEffect(() => {
    const match = localStorage.getItem("percentageMatch");
    console.log(match);
    if (match && parseInt(match) > 55) {
      setIsAddEnabled(true);
    } else {
      setIsAddEnabled(false);
    }
    // localStorage.removeItem("percentageMatch"); // Optional: prevent reuse
  }, []);

  const router = useRouter()

  useEffect(() => { 
    // console.log(moment().format('DD-MM-YYYY'))
  }, [])

  const onSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()

    const InputPromt = `Job Position: ${jobPosition}, Job Description: ${jobDescription}, Years of Experience: ${jobExperience}, Depends on this information please give me ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} Interview question with Answered in Json Format, Give Question and Answer in Json`

    // console.log('InputPromt:', InputPromt)

    const result = await chatSession.sendMessage(InputPromt)
    const MockJsonResp = (result.response.text())
      .replace('```json', '').replace('```', '')
    // console.log(JSON.parse(MockJsonResp))
    setJsonResponse(MockJsonResp)

    if (MockJsonResp) {
      const resp = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonMockResp: MockJsonResp,
        jobPosition: jobPosition,
        jobDesc: jobDescription,
        jobExperience: jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-YYYY')
      }).returning({ mockId: MockInterview.mockId })

      // console.log("inserted id: ", resp)

      if(resp){
        setOpenDialog(false)
        router.push('/dashboard/interview/'+resp[0]?.mockId)
      }
    } else {
      // console.log('Error in response')
    }

    setLoading(false)
  }

  const [matchScore, setMatchScore] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("percentageMatch");
    const parsed = parseInt(stored, 10);
    if (!isNaN(parsed)) {
      setMatchScore(parsed);
    }
  }, []);
  const borderColor = matchScore > 55 ? "border-green-500" : "border-red-500";

  const ATShandler=()=>{
    localStorage.removeItem("percentageMatch");
    router.push(`/dashboard/interview/ats`)
  }

  return (
    <div>
      {/* <div className="border-2 border-green-300 bg-green-50 text-green-800 p-6 rounded-xl shadow-md max-w-xl mx-auto font-sans w-[5000px]">
  <h3 className="text-lg font-semibold mb-2">Get Ready for Your Interview</h3>
  <p>
    To proceed with your new interview, please <span className="font-bold">scan your resume first</span>. 
  </p>
</div> */}

      {/* <div className=' flex w-[900px]'>
      <div className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-sm cursor-pointer transition-all m-5"
        onClick={() => setOpenDialog(true)}>
        <h2 className="font-bold text-lg text-center">+ Add New
        </h2>
      </div>
      <div className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-sm cursor-pointer transition-all m-5"
        onClick={ATShandler}>
        <h2 className="font-bold text-lg text-center">Scan Resume📑
        </h2>
      </div>  
      </div> */}
      <div className='flex w-[900px]'>
        
      <div
        className={`p-10 border border-black rounded-lg ${isAddEnabled ? 'bg-secondary hover:scale-105 hover:shadow-sm cursor-pointer' : 'bg-gray-300 cursor-not-allowed'} transition-all m-5`}
        onClick={() => {
          if (isAddEnabled) {
            setOpenDialog(true);
          }
        }}
      >
        <h2 className="font-bold text-lg text-center">+ Add New</h2>
      </div>

      <div
        className="p-10 border border-black rounded-lg bg-secondary hover:scale-105 hover:shadow-sm cursor-pointer transition-all m-5"
        onClick={ATShandler}
      >
        <h2 className="font-bold text-lg text-center">Scan Resume📑</h2>
      </div>
      {/* <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-sm cursor-pointer transition-all m-5"
        
      >
        <h2 className="font-bold text-lg text-center">ATS score:{localStorage.getItem("percentageMatch")
        }%</h2>
      </div> */}
       <div
      className={`p-10 border-2 rounded-lg bg-secondary hover:scale-105 hover:shadow-sm cursor-pointer transition-all m-5 ${borderColor}`}
    >
      <h2 className="font-bold text-lg text-center">
        ATS score: {matchScore}%
      </h2>
    </div>
    </div>
      

      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Tell us more about your job interviwing</DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2 className='font-bold text-2xl' ></h2>
                  <h2>Add details about your job position/role, job description and years of experience.</h2>

                  <div className='mt-7 my-3'>
                    <label>Job Role/Job Position</label>
                    <Input placeholder="Eg. Full Stack Developer" required onChange={(e) => setJobPosition(e.target.value)} value={jobPosition} />
                  </div>

                  <div className='my-3'>
                    <label>Job Description</label>
                    <Textarea placeholder="Eg. React, Angular, NodeJs, MySql etc" required onChange={(e) => setJobDescription(e.target.value)} value={
                      jobDescription} />
                  </div>

                  <div className='my-3'>
                    <label>Years Of Experience</label>
                    <Input placeholder="Eg. 5" type="number" max="50" required onChange={(e) => setJobExperience(e.target.value)} value={jobExperience} />
                  </div>

                </div>
                <div className='flex gap-5 justify-end' >
                  <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>Close</Button>
                  <Button type="submit" disabled={loading}>
                    {loading ?
                      <>
                        <LoaderCircle className='animate-spin' />
                        Starting your Interview
                      </>
                      :
                      'Start Interview'}
                  </Button>

                  {/* <Button onClick={ATShandler}>Scan your resume</Button> */}
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default AddNewInterview