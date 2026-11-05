import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import resourceRoutes from '../routes/resourceRoutes.js';
import Student from '../models/Student.js';
import Resource from '../models/Resource.js';
import { UPLOAD_DIR } from '../middleware/uploadMiddleware.js';

const PORT = 5098;
const BASE_URL = `http://localhost:${PORT}`;
const DOWNLOADS_DIR = 'C:\\Users\\paima\\Downloads';

const uploadJobs = [
  // ── Subject 1: Software Engineering & Project Management (BCS501) ──
  {
    filename: 'Module - 1 Notes_ SEPM(BCS501).pdf',
    title: 'Software Engineering & Project Management (BCS501) - Module 1 Notes',
    description: 'Autonomous Course Notes covering Module 1: Software processes, prescriptive process models (Waterfall, Incremental, Evolutionary, Concurrent) and professional software engineering practices.',
    academicYear: '3rd Year AIML',
    semester: 5,
    department: 'Artificial Intelligence & Machine Learning',
    subjectName: 'Software Engineering & Project Management',
    subjectCode: 'BCS501',
    category: 'notes'
  },
  {
    filename: 'Module 2_Notes_BCS501.pdf',
    title: 'Software Engineering & Project Management (BCS501) - Module 2 Notes',
    description: 'Autonomous Course Notes covering Module 2: Requirements engineering, groundwork, eliciting requirements, use cases, requirements modeling, and requirement validation.',
    academicYear: '3rd Year AIML',
    semester: 5,
    department: 'Artificial Intelligence & Machine Learning',
    subjectName: 'Software Engineering & Project Management',
    subjectCode: 'BCS501',
    category: 'notes'
  },
  {
    filename: 'Module - 3 Notes_ SEPM(BCS501) (1).pdf',
    title: 'Software Engineering & Project Management (BCS501) - Module 3 Notes',
    description: 'Autonomous Course Notes covering Module 3: Agile development, agility principles, Extreme Programming (XP), agile process models, and practice guidelines.',
    academicYear: '3rd Year AIML',
    semester: 5,
    department: 'Artificial Intelligence & Machine Learning',
    subjectName: 'Software Engineering & Project Management',
    subjectCode: 'BCS501',
    category: 'notes'
  },
  {
    filename: 'Question Bank for IA-1(SEPM_BCS501).pdf',
    title: 'Software Engineering & Project Management (BCS501) - IA-1 Question Bank',
    description: 'Official Canara Engineering College Question Bank for Internal Assessment 1 covering Modules 1, 2, and 3 with question paper pattern and marks allocation.',
    academicYear: '3rd Year AIML',
    semester: 5,
    department: 'Artificial Intelligence & Machine Learning',
    subjectName: 'Software Engineering & Project Management',
    subjectCode: 'BCS501',
    category: 'question-papers'
  },

  // ── Subject 2: Computer Networks (BCS502) ──────────────────────────
  {
    filename: 'CNBCS502-Module1-Notes.pdf',
    title: 'Computer Networks (BCS502) - Module 1 Notes',
    description: 'Autonomous Course Notes covering Module 1: Data communications, networks, TCP/IP protocol suite, OSI model, transmission media (guided and wireless), and packet switching.',
    academicYear: '3rd Year AIML',
    semester: 5,
    department: 'Artificial Intelligence & Machine Learning',
    subjectName: 'Computer Networks',
    subjectCode: 'BCS502',
    category: 'notes'
  },
  {
    filename: 'BCS502-MODULE2-NOTES.pdf',
    title: 'Computer Networks (BCS502) - Module 2 Notes',
    description: 'Autonomous Course Notes covering Module 2: Data link layer, error detection and correction, block coding, Hamming distance, and cyclic redundancy checks.',
    academicYear: '3rd Year AIML',
    semester: 5,
    department: 'Artificial Intelligence & Machine Learning',
    subjectName: 'Computer Networks',
    subjectCode: 'BCS502',
    category: 'notes'
  },
  {
    filename: 'BCS-502-Module 3 - Notes.pdf',
    title: 'Computer Networks (BCS502) - Module 3 Notes',
    description: 'Autonomous Course Notes covering Module 3: Network layer services, host-to-host datagram delivery, IP addressing, and routing architectures.',
    academicYear: '3rd Year AIML',
    semester: 5,
    department: 'Artificial Intelligence & Machine Learning',
    subjectName: 'Computer Networks',
    subjectCode: 'BCS502',
    category: 'notes'
  },
  {
    filename: 'Question_Bank_CN_M1_M2_M3.pdf',
    title: 'Computer Networks (BCS502) - Question Bank Modules 1, 2 & 3',
    description: 'Official Canara Engineering College Question Bank for Computer Networks covering Modules 1, 2, and 3 comprehensive exam questions.',
    academicYear: '3rd Year AIML',
    semester: 5,
    department: 'Artificial Intelligence & Machine Learning',
    subjectName: 'Computer Networks',
    subjectCode: 'BCS502',
    category: 'question-papers'
  },

  // ── Subject 3: Exploratory Data Analysis (BAI515E) ─────────────────
  {
    filename: 'EDA NOTES.pdf',
    title: 'Exploratory Data Analysis (BAI515E) - Python Data Science Handbook Course Reference',
    description: 'Official Autonomous Reference Handbook: Python Data Science Handbook (2nd Edition) by Jake VanderPlas covering Numpy, Pandas, Matplotlib, and Scikit-Learn tools.',
    academicYear: '3rd Year AIML',
    semester: 5,
    department: 'Artificial Intelligence & Machine Learning',
    subjectName: 'Exploratory Data Analysis',
    subjectCode: 'BAI515E',
    category: 'notes'
  },
  {
    filename: 'EDA_QB.pdf',
    title: 'Exploratory Data Analysis (BAI515E) - Department Question Bank',
    description: 'Official Canara Engineering College Department of AIML Question Bank for BAI515E Exploratory Data Analysis covering all syllabus modules.',
    academicYear: '3rd Year AIML',
    semester: 5,
    department: 'Artificial Intelligence & Machine Learning',
    subjectName: 'Exploratory Data Analysis',
    subjectCode: 'BAI515E',
    category: 'question-papers'
  },

  // ── Subject 4: Research Methodology and Intellectual Property Rights (BRMK557) ──
  {
    filename: 'Module 1_enotes.pdf',
    title: 'Research Methodology & IPR (BRMK557) - Module 1 Notes',
    description: 'Autonomous Course Notes covering Module 1: Meaning of research, objectives, types of engineering research, ethics, misconduct, and authorship issues.',
    academicYear: '3rd Year AIML',
    semester: 5,
    department: 'Artificial Intelligence & Machine Learning',
    subjectName: 'Research Methodology and Intellectual Property Rights',
    subjectCode: 'BRMK557',
    category: 'notes'
  },
  {
    filename: 'rm qb.pdf',
    title: 'Research Methodology & IPR (BRMK557) - Question Bank Modules 1-5',
    description: 'Official Canara Engineering College Question Bank for BRMK557 covering Research Methodology, Research Ethics, Patents, Copyrights, Trademarks, and GI Case Studies.',
    academicYear: '3rd Year AIML',
    semester: 5,
    department: 'Artificial Intelligence & Machine Learning',
    subjectName: 'Research Methodology and Intellectual Property Rights',
    subjectCode: 'BRMK557',
    category: 'question-papers'
  }
];

async function main() {
  console.log('===========================================================');
  console.log('  Campus Bridge AI — 5th Semester AIML Materials Ingestion');
  console.log('===========================================================');

  await connectDB();

  // Find admin user Maithily (4CB24AI053)
  const admin = await Student.findOne({ USN: '4CB24AI053' });
  if (!admin) {
    throw new Error('Admin user 4CB24AI053 not found in database!');
  }
  if (admin.role !== 'admin') {
    throw new Error(`User ${admin.USN} does not have role="admin" (current: ${admin.role})`);
  }

  console.log(`[Admin Identity Verified] ${admin.fullName} (${admin.USN}) | Role: ${admin.role}`);

  // Generate Admin JWT
  const adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  // Spin up Express server on port 5098
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/resources', resourceRoutes);

  const server = app.listen(PORT);
  console.log(`[Ingestion Server Ready] Listening on http://localhost:${PORT}`);

  const results = [];

  for (const [idx, job] of uploadJobs.entries()) {
    console.log(`\n-----------------------------------------------------------`);
    console.log(`[${idx + 1}/${uploadJobs.length}] Processing: ${job.filename}`);
    console.log(`      Subject : [${job.subjectCode}] ${job.subjectName}`);
    console.log(`      Category: ${job.category} | Title: ${job.title}`);

    const filePath = path.join(DOWNLOADS_DIR, job.filename);
    if (!fs.existsSync(filePath)) {
      console.error(`      [ERROR] Source file not found: ${filePath}`);
      results.push({ ...job, status: 'FILE_NOT_FOUND' });
      continue;
    }

    // Check duplicate
    const existing = await Resource.findOne({
      $or: [
        { originalFilename: job.filename },
        { title: job.title }
      ]
    });

    if (existing) {
      console.log(`      [SKIPPED - DUPLICATE] Resource already exists with ID: ${existing._id}`);
      results.push({ ...job, id: existing._id, status: 'ALREADY_EXISTS', size: existing.fileSize });
      continue;
    }

    // Build native FormData payload
    const fileBuffer = fs.readFileSync(filePath);
    const formData = new FormData();
    formData.append('file', new Blob([fileBuffer], { type: 'application/pdf' }), job.filename);
    formData.append('title', job.title);
    formData.append('description', job.description);
    formData.append('academicYear', job.academicYear);
    formData.append('semester', String(job.semester));
    formData.append('department', job.department);
    formData.append('subjectName', job.subjectName);
    formData.append('subjectCode', job.subjectCode);
    formData.append('category', job.category);

    try {
      const res = await fetch(`${BASE_URL}/api/resources`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`
        },
        body: formData
      });

      const body = await res.json();
      if (res.status === 201 && body.status === 'success') {
        const doc = body.data.resource;
        console.log(`      ✔ [UPLOADED] HTTP 201 | ID: ${doc._id} | Stored: ${doc.storedFilename} | Size: ${(doc.fileSize / 1024 / 1024).toFixed(2)} MB`);
        results.push({ ...job, id: doc._id, status: 'UPLOADED', size: doc.fileSize });
      } else {
        console.error(`      ✗ [FAILED] HTTP ${res.status}:`, body.message);
        results.push({ ...job, status: 'FAILED', error: body.message });
      }
    } catch (err) {
      console.error(`      ✗ [REQUEST ERROR]:`, err.message);
      results.push({ ...job, status: 'FAILED', error: err.message });
    }
  }

  // ── Verification Tests ─────────────────────────────────────────────────
  console.log('\n===========================================================');
  console.log('  Post-Upload Verification Checks');
  console.log('===========================================================');

  // Test 1: Public student query
  const listRes = await fetch(`${BASE_URL}/api/resources?academicYear=3rd Year AIML&semester=5`);
  const listJson = await listRes.json();
  const uploadedCount = listJson.data?.resources?.length || 0;
  console.log(`1. Student Query (GET /api/resources?academicYear=3rd Year AIML&semester=5):`);
  console.log(`   HTTP ${listRes.status} | Total 5th Sem AIML Resources Returned: ${uploadedCount}`);

  // Test 2: View PDF stream
  if (uploadedCount > 0) {
    const sample = listJson.data.resources[0];
    const viewRes = await fetch(`${BASE_URL}/api/resources/${sample._id}/view`);
    const cType = viewRes.headers.get('content-type');
    const disp = viewRes.headers.get('content-disposition');
    console.log(`2. PDF Preview Test (GET /api/resources/${sample._id}/view):`);
    console.log(`   HTTP ${viewRes.status} | Content-Type: ${cType} | Disposition: ${disp}`);

    // Test 3: Download PDF stream
    const dlRes = await fetch(`${BASE_URL}/api/resources/${sample._id}/download`);
    const dlDisp = dlRes.headers.get('content-disposition');
    console.log(`3. PDF Download Test (GET /api/resources/${sample._id}/download):`);
    console.log(`   HTTP ${dlRes.status} | Content-Disposition: ${dlDisp}`);
  }

  // Test 4: Security test - unauthenticated upload blocked
  const testForm = new FormData();
  testForm.append('file', new Blob([Buffer.from('%PDF-1.4 test')], { type: 'application/pdf' }), 'unauth.pdf');
  testForm.append('title', 'Unauthorized Test');
  const unauthRes = await fetch(`${BASE_URL}/api/resources`, { method: 'POST', body: testForm });
  console.log(`4. Security Guard Test (Unauthenticated POST /api/resources):`);
  console.log(`   HTTP ${unauthRes.status} (Expected: 401 Unauthorized)`);

  // Close server and mongo
  server.close();
  await mongoose.disconnect();
  console.log('\n[Done] All tasks completed successfully.');
}

main().catch(err => {
  console.error('\n[FATAL ERROR]:', err);
  process.exit(1);
});
