import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'


function Dashboard() {

  return (
    <div className='p-10'>
      <h2 className='font-bold text-2xl'>Dashboard</h2>
      <h2 className="text-gray-500">Create and Start your AI Mockup Interview</h2>
      <div className="border-2 border-green-300 bg-green-50 text-green-800 p-2 rounded-xl shadow-md mx-auto font-sans m-5">
  <h3 className="text-sm font-semibold mb-2">Get Ready for Your Interview</h3>
  <p className=' text-lg'>
    To proceed with your new interview, please <span className="font-bold">scan your resume first</span>. 
  </p>
</div>

      <div className="grid grid-cols-1 md:grid-cols-3 my-5">
        <AddNewInterview />
      </div>

      {/* prev list of interviews */}
      <InterviewList />
    </div>
  )
}

export default Dashboard