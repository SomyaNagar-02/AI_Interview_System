import { createRequire } from "module";
const require = createRequire(import.meta.url);

// 1. Force load the library using 'require'
// This fixes BOTH the runtime crash AND the editor warning
const pdf = require("pdf-parse-fork");

import { getResumeStream } from "../config/gridfs.js";

const streamToBuffer = async (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
};

export const extractTextFromResume = async (resumeId) => {
  try {
    const downloadStream = getResumeStream(resumeId);
    const dataBuffer = await streamToBuffer(downloadStream);

    // 2. Parse the PDF
    const data = await pdf(dataBuffer);
    
    return data.text; 
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to extract text from resume");
  }
};