// import { GoogleGenerativeAI } from '@google/generative-ai';
// import multer from 'multer';
// import fs from 'fs';
// import pdfParse from 'pdf-parse';
// import cors from 'cors';
// import { NextApiRequest, NextApiResponse } from 'next';

// const upload = multer({ dest: 'uploads/' });

// const handler = async (req, res) => {
//   try {
//     if (req.method === 'POST') {
//       // Step 1: Handle the file upload using Multer
//       const form = new multiparty.Form();
//       form.parse(req, async (err, fields, files) => {
//         if (err) {
//           return res.status(500).json({ message: 'Error parsing form data.' });
//         }

//         const file = files.file[0]; // Get the uploaded file
//         const filePath = file.path; // File path from Multer

//         // Step 2: Read the PDF file
//         const pdfData = await fs.promises.readFile(filePath);
//         const parsedPdf = await pdfParse(pdfData);
//         const resumeText = parsedPdf.text;

//         // Optional: Job description from frontend
//         const jobDescription = fields.jobDescription ? fields.jobDescription[0] : 'Default job description here...';

//         // Step 3: Prepare the prompt for Gemini API
//         const prompt = `
//           You are an expert ATS (Applicant Tracking System) scanner. Evaluate the following resume against the provided job description:

//           Resume: ${resumeText}
//           Job Description: ${jobDescription}

//           Provide the following outputs:
//           - Percentage Match
//           - Matching Keywords
//           - Missing Keywords
//           - Specific Changes to Improve Match
//           - Final Thoughts
//         `;

//         // Step 4: Initialize Google Generative AI with API key
//         const geminiAPI = new GoogleGenerativeAI('AIzaSyD09yhOyIkVKu0YZAdvbBl9ppVyRhSi22U');

//         // Step 5: Call the model
//         const model = geminiAPI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//         const result = await model.generateContent(prompt);

//         // Extract and format the response
//         const evaluationParts = result.response.candidates[0].content.parts;
//         const evaluationText = evaluationParts
//           .map((part) => part.text.trim())
//           .join('\n\n'); // Join all parts with double line breaks

//         // Format the evaluation response
//         const formattedEvaluation = {
//           percentageMatch: evaluationText.match(/Percentage Match:\s*(.*)/)?.[1]?.trim().replace(/\*\*|\*/g, '') || 'N/A',
//           matchingKeywords: evaluationText.match(/Matching Keywords:\s*([\s\S]*?)(?=\*\s*Missing Keywords:)/)?.[1]?.trim().replace(/\*\*|\*/g, '').replace(/\n/g, ' ') || 'N/A',
//           missingKeywords: evaluationText.match(/Missing Keywords:\s*([\s\S]*?)(?=\*\s*Specific Changes to Improve Match:)/)?.[1]?.trim().replace(/\*\*|\*/g, '').replace(/\n/g, ' ') || 'N/A',
//           specificChanges: evaluationText.match(/Specific Changes to Improve Match:\s*([\s\S]*?)(?=\*\s*Final Thoughts:)/)?.[1]?.trim().replace(/\*\*|\*/g, '').replace(/\n/g, ' ') || 'N/A',
//           finalThoughts: evaluationText.match(/Final Thoughts:\s*([\s\S]*)/)?.[1]?.trim().replace(/\*\*|\*/g, '').replace(/\n/g, ' ') || 'N/A',
//         };

//         // Step 6: Send the formatted evaluation response back to the frontend
//         res.status(200).json(formattedEvaluation);
//       });
//     } else {
//       // If the method is not POST, return a 405 Method Not Allowed error
//       res.status(405).json({ message: 'Method Not Allowed' });
//     }
//   } catch (error) {
//     console.error('Error processing file or calling Gemini API:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// export default handler;

import { GoogleGenerativeAI } from '@google/generative-ai';
import multer from 'multer';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import path from 'path';

// Set up multer for file uploads
const upload = multer({
  dest: 'uploads/', // File destination
});

export const config = {
  api: {
    bodyParser: false, // Disable bodyParser to handle file uploads
  },
};

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      // Step 1: Handle file upload using multer
      upload.single('file')(req, res, async (err) => {
        if (err) {
          console.error('Error during file upload:', err);
          return res.status(500).json({ message: 'Error during file upload' });
        }

        // Get the file path from multer
        const file = req.file;
        if (!file) {
          return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = path.join(process.cwd(), 'uploads', file.filename);

        // Step 2: Read the PDF file
        const pdfData = await fs.promises.readFile(filePath);
        const parsedPdf = await pdfParse(pdfData);
        const resumeText = parsedPdf.text;

        // Step 3: Prepare the job description (from form data)
        const jobDescription = req.body.jobDescription || 'Default job description here...';

        // Step 4: Prepare the prompt for Gemini API
        const prompt = `
          You are an expert ATS (Applicant Tracking System) scanner. Evaluate the following resume against the provided job description:

          Resume: ${resumeText}
          Job Description: ${jobDescription}

          Provide the following outputs:
          - Percentage Match (only the percentage,dont give percentage symbol)
          - Matching Keywords
          - Missing Keywords
          - Specific Changes to Improve Match
          - Final Thoughts
        `;

        // Step 5: Initialize Google Generative AI with API key
        const geminiAPI = new GoogleGenerativeAI('AIzaSyD09yhOyIkVKu0YZAdvbBl9ppVyRhSi22U'); // Use environment variable for the API key in production

        // Step 6: Call the model
        const model = geminiAPI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);

        // Extract and format the response
        const evaluationParts = result.response.candidates[0].content.parts;
        const evaluationText = evaluationParts
          .map((part) => part.text.trim())
          .join('\n\n'); // Join all parts with double line breaks

        // Format the evaluation response
        const formattedEvaluation = {
        //   percentageMatch: evaluationText.match(/Percentage Match:\s*(.*)/)?.[1]?.trim() || 'N/A',
        //   matchingKeywords: evaluationText.match(/Matching Keywords:\s*([\s\S]*?)(?=\*\s*Missing Keywords:)/)?.[1]?.trim() || 'N/A',
        //   missingKeywords: evaluationText.match(/Missing Keywords:\s*([\s\S]*?)(?=\*\s*Specific Changes to Improve Match:)/)?.[1]?.trim() || 'N/A',
        //   specificChanges: evaluationText.match(/Specific Changes to Improve Match:\s*([\s\S]*?)(?=\*\s*Final Thoughts:)/)?.[1]?.trim() || 'N/A',
        //   finalThoughts: evaluationText.match(/Final Thoughts:\s*([\s\S]*)/)?.[1]?.trim() || 'N/A',
        percentageMatch: evaluationText.match(/Percentage Match:\s*(.*)/)?.[1]?.trim().replace(/\*\*|\*/g, '') || 'N/A',
        matchingKeywords: evaluationText.match(/Matching Keywords:\s*([\s\S]*?)(?=\*\s*Missing Keywords:)/)?.[1]?.trim().replace(/\*\*|\*/g, '').replace(/\n/g, ' ') || 'N/A',
        missingKeywords: evaluationText.match(/Missing Keywords:\s*([\s\S]*?)(?=\*\s*Specific Changes to Improve Match:)/)?.[1]?.trim().replace(/\*\*|\*/g, '').replace(/\n/g, ' ') || 'N/A',
        specificChanges: evaluationText.match(/Specific Changes to Improve Match:\s*([\s\S]*?)(?=\*\s*Final Thoughts:)/)?.[1]?.trim().replace(/\*\*|\*/g, '').replace(/\n/g, ' ') || 'N/A',
        finalThoughts: evaluationText.match(/Final Thoughts:\s*([\s\S]*)/)?.[1]?.trim().replace(/\*\*|\*/g, '').replace(/\n/g, ' ') || 'N/A',
        };

        // Step 7: Send the formatted evaluation response back to the frontend
        res.status(200).json(formattedEvaluation);
      });
    } else {
      // If the method is not POST, return a 405 Method Not Allowed error
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error processing file or calling Gemini API:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default handler;
