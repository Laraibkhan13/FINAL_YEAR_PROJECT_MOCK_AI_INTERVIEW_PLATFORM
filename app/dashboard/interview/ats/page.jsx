// // app/ats/page.tsx
// 'use client';
// import { useState } from 'react';

// export default function ATSPage() {
// //   const [selectedFile, setSelectedFile] = useState<File | null>(null);
// const [selectedFile, setSelectedFile] = useState(null);

//   const [jobDescription, setJobDescription] = useState('');
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showSection, setShowSection] = useState(null);

//   const handleUpload = async () => {
//     if (!selectedFile || !jobDescription) {
//       alert('Please upload a resume and enter a job description.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', selectedFile);
//     formData.append('jobDescription', jobDescription);

//     try {
//       setLoading(true);
//       const response = await fetch('/api/ats/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();
//       setResult(data);
//     } catch (err) {
//       console.error('Upload failed:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
//       <h1 className="text-3xl font-bold mb-4">ATS Resume Scanner</h1>

//       <div className="w-full max-w-md bg-white p-6 rounded shadow">
//         <input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="mb-4" />
//         <textarea
//           placeholder="Enter Job Description"
//           value={jobDescription}
//           onChange={(e) => setJobDescription(e.target.value)}
//           className="w-full h-32 p-2 border mb-4"
//         />
//         <button
//           onClick={handleUpload}
//           disabled={loading}
//           className="bg-blue-600 text-white px-4 py-2 rounded w-full"
//         >
//           {loading ? 'Processing...' : 'Upload and Scan'}
//         </button>
//       </div>

//       {result && (
//         <div className="mt-6 w-full max-w-2xl bg-white p-6 rounded shadow">
//           <h2 className="text-xl font-bold mb-4">Results</h2>
//           <p><strong>Percentage Match:</strong> {result.percentageMatch}</p>

//           <div className="flex gap-4 mt-4">
//             {['matchingKeywords', 'missingKeywords', 'specificChanges'].map((section) => (
//               <button
//                 key={section}
//                 onClick={() => setShowSection((prev) => (prev === section ? null : section))}
//                 className="bg-gray-500 text-white px-4 py-1 rounded"
//               >
//                 {section}
//               </button>
//             ))}
//           </div>

//           {showSection && (
//             <div className="mt-4">
//               <h3 className="font-bold capitalize">{showSection.replace(/([A-Z])/g, ' $1')}</h3>
//               <ul className="list-disc ml-5">
//               {result[showSection].split(',').map((item, idx) => (
//   <li key={idx}>{item.trim()}</li>
// ))}

//               </ul>
//             </div>
//           )}

//           <div className="mt-4">
//             <strong>Final Thoughts:</strong>
//             <p>{result.finalThoughts}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';
import { useState } from 'react';
import { toast } from "sonner"
// import jsPDF from 'jspdf';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useRouter } from 'next/navigation'



export default function ATSPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSection, setShowSection] = useState(null);

  

  const router = useRouter()

  const handleUpload = async () => {
    if (!selectedFile || !jobDescription) {
      alert('Please upload a resume and enter a job description.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('jobDescription', jobDescription);

    try {
      setLoading(true);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload resume');
      }

      const data = await response.json();
      setResult(data);
      toast("Resume uploaded sucessfully")
      localStorage.setItem("percentageMatch",data.percentageMatch );
      console.log(localStorage.getItem)

    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const dashboardHandler=()=>{
    router.push('/dashboard')
  }

  const handleDownloadReport = () => {
    if (!result) return;
  
    const doc = new jsPDF();
    let currentY = 20;
  
    doc.setFontSize(18);
    doc.text('ATS Resume Report', 14, currentY);
    currentY += 10;
  
    doc.setFontSize(12);
    doc.text(`Percentage Match: ${result.percentageMatch}`, 14, currentY);
    currentY += 10;
  
    // Matching Keywords Table
    autoTable(doc, {
      startY: currentY,
      head: [['Matching Keywords']],
      body: result.matchingKeywords?.split(',').map((item) => [item.trim()]) || [],
      theme: 'striped',
    });
    currentY = doc.lastAutoTable.finalY + 10;
  
    // Missing Keywords Table
    autoTable(doc, {
      startY: currentY,
      head: [['Missing Keywords']],
      body: result.missingKeywords?.split(',').map((item) => [item.trim()]) || [],
      theme: 'striped',
    });
    currentY = doc.lastAutoTable.finalY + 10;
  
    // Specific Changes Table
    autoTable(doc, {
      startY: currentY,
      head: [['Specific Changes']],
      body: result.specificChanges?.split(',').map((item) => [item.trim()]) || [],
      theme: 'striped',
    });
    currentY = doc.lastAutoTable.finalY + 10;
  
    // Final Thoughts
    autoTable(doc, {
      startY: currentY,
      head: [['Final Thoughts']],
      body: [[result.finalThoughts || '']],
      theme: 'plain',
      styles: { cellPadding: 5, fontStyle: 'italic' },
    });
  
    doc.save('ATS_Resume_Report.pdf');
    toast('report downloaded sucessfully')
  };
  
  

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
    {result?.percentageMatch < 55 ? (
    <div className="w-full max-w-xl bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded mb-6 shadow-md">
      <p className="font-semibold">
        ⚠️ Your resume needs to qualify above <span className="text-black font-bold">55%</span> ATS score to access our Mock Interview System.
      </p>
      <button
        onClick={dashboardHandler}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Go to your Dashboard
      </button>
    </div>
  ) : result ? (
    <div className="w-full max-w-xl bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded mb-6 shadow-md">
      <p className="font-semibold mb-2">
        ✅ Your resume passed the ATS screening with a score of <span className="text-black font-bold">{result.percentageMatch}%</span>! You're eligible to proceed.
      </p>
      <button
        onClick={dashboardHandler}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Go to Interview Dashboard
      </button>
    </div>
  ) : null}

        


      <h1 className="text-3xl font-bold mb-4">Upload your resume here</h1>

      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="mb-4"
        />
        <textarea
          placeholder="Enter Job Description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full h-32 p-2 border mb-4"
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? 'Processing...' : 'Upload and Scan'}
        </button>
      </div>

      {result && (
        <div className="mt-6 w-full max-w-2xl bg-white p-6 rounded shadow">
            
            <h2 className="text-xl font-bold ">Results</h2>
            
            
          
          <p><strong>Percentage Match:</strong> {result.percentageMatch}%</p>

          <div className="flex gap-4 mt-4">
            {['matchingKeywords', 'missingKeywords', 'specificChanges'].map((section) => (
              <button
                key={section}
                onClick={() => setShowSection((prev) => (prev === section ? null : section))}
                className="bg-gray-500 text-white px-4 py-1 rounded"
              >
                {section}
              </button>
            ))}
          </div>

          {showSection && (
            <div className="mt-4">
              <h3 className="font-bold capitalize">{showSection.replace(/([A-Z])/g, ' $1')}</h3>
              <ul className="list-disc ml-5">
                {result[showSection].split(',').map((item, idx) => (
                  <li key={idx}>{item.trim()}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <strong>Final Thoughts:</strong>
            <p>{result.finalThoughts}</p>
          </div>

          <button
  onClick={handleDownloadReport}
  className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
>
  Download Report as PDF
</button>


        </div>
      )}
    </div>
  );
}

