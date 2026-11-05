/**
 * Campus Bridge AI — Step 4 Admin Resource System Test Suite
 * -----------------------------------------------------------
 * Validates:
 *  1. Student registration always sets role = 'student' (ignoring role in payload).
 *  2. Student token rejected with 403 Forbidden for POST /api/resources.
 *  3. Student token rejected with 403 Forbidden for PUT /api/resources/:id.
 *  4. Student token rejected with 403 Forbidden for DELETE /api/resources/:id.
 *  5. Unauthenticated request rejected with 401 Unauthorized.
 *  6. Non-PDF file upload rejected with 400 Bad Request.
 *  7. Admin upload of valid PDF returns 201 Created & persists to MongoDB and disk.
 *  8. Student listing resources via GET /api/resources returns 200 and published resources.
 *  9. Student viewing PDF via GET /api/resources/:id/view streams application/pdf.
 * 10. Student downloading PDF via GET /api/resources/:id/download.
 * 11. Admin edit via PUT /api/resources/:id updates metadata.
 * 12. Admin delete via DELETE /api/resources/:id deletes MongoDB record and unlinks file.
 * 13. Automatic cleanup of test users and test files.
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

import http from 'http';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import Student from './models/Student.js';
import Resource from './models/Resource.js';
import { UPLOAD_DIR } from './middleware/uploadMiddleware.js';

const PORT = 5097;
const BASE = `http://localhost:${PORT}`;

// Colors
const G = (s) => `\x1b[32m${s}\x1b[0m`;
const R = (s) => `\x1b[31m${s}\x1b[0m`;
const B = (s) => `\x1b[1m${s}\x1b[0m`;
const C = (s) => `\x1b[36m${s}\x1b[0m`;
const D = (s) => `\x1b[2m${s}\x1b[0m`;
const Y = (s) => `\x1b[33m${s}\x1b[0m`;

const results = [];
function record(id, name, passed, details = '') {
  results.push({ id, name, passed, details });
  const icon = passed ? G('✔ PASS') : R('✗ FAIL');
  const det = details ? `\n         ${D(details)}` : '';
  console.log(`   ${icon}  ${name}${det}`);
}

// Simple multipart form builder for Node
function buildMultipart(fields, file) {
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  const crlf = '\r\n';
  let parts = [];

  for (const [key, val] of Object.entries(fields)) {
    parts.push(
      `--${boundary}${crlf}` +
      `Content-Disposition: form-data; name="${key}"${crlf}${crlf}` +
      `${val}${crlf}`
    );
  }

  if (file) {
    parts.push(
      `--${boundary}${crlf}` +
      `Content-Disposition: form-data; name="${file.fieldname}"; filename="${file.filename}"${crlf}` +
      `Content-Type: ${file.mimetype}${crlf}${crlf}`
    );
  }

  const headerBuffer = Buffer.from(parts.join(''), 'utf-8');
  const footerBuffer = Buffer.from(`${crlf}--${boundary}--${crlf}`, 'utf-8');
  const bodyBuffer = file
    ? Buffer.concat([headerBuffer, file.buffer, footerBuffer])
    : Buffer.concat([headerBuffer, footerBuffer]);

  return { boundary, bodyBuffer };
}

// HTTP helper
function req(method, path, body = null, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    let payload = null;
    const headers = { ...extraHeaders };

    if (body instanceof Buffer) {
      payload = body;
      headers['Content-Length'] = body.length;
    } else if (body && typeof body === 'object') {
      payload = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const opts = {
      hostname: 'localhost',
      port: PORT,
      path,
      method,
      headers,
    };

    const r = http.request(opts, (res) => {
      let raw = [];
      res.on('data', (c) => raw.push(c));
      res.on('end', () => {
        const fullBuf = Buffer.concat(raw);
        let json = null;
        try {
          json = JSON.parse(fullBuf.toString('utf-8'));
        } catch {
          json = { _rawText: fullBuf.toString('utf-8').slice(0, 200) };
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: json,
          buffer: fullBuf,
        });
      });
    });

    r.on('error', reject);
    r.setTimeout(15000, () => r.destroy(new Error('Request timed out')));
    if (payload) r.write(payload);
    r.end();
  });
}

// Minimal PDF buffer for testing
const SAMPLE_PDF_BUFFER = Buffer.from(
  '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n190\n%%EOF'
);

async function runTestSuite() {
  console.log('\n' + B('════════════════════════════════════════════════════════════'));
  console.log(B('   Campus Bridge AI — Step 4 Resource Management Test Suite'));
  console.log(B('════════════════════════════════════════════════════════════') + '\n');

  let studentToken = null;
  let adminToken = null;
  let createdResourceId = null;
  let uploadedFilenameOnDisk = null;

  // ── TEST 1: Public Registration assigns role = "student" ──────────────────
  console.log(C('[ T1 ]  Public student registration (tampering role: admin)'));
  try {
    const res = await req('POST', '/api/auth/register', {
      fullName: 'Regular Student One',
      USN: 'STUROLE001',
      collegeEmail: 'sturole001@canaraengineering.in',
      department: 'Artificial Intelligence & Machine Learning',
      academicYear: '2024-2025',
      semester: 3,
      password: 'StudentPass@123',
      confirmPassword: 'StudentPass@123',
      role: 'admin', // Attack attempt: trying to register directly as admin
    });

    const studentRecord = await Student.findOne({ USN: 'STUROLE001' });
    const ok =
      res.status === 201 &&
      res.body.data?.student?.role === 'student' &&
      studentRecord?.role === 'student';

    studentToken = res.body.token;

    record(
      'T1',
      'Registration assigns role="student" (ignores role="admin")',
      ok,
      `HTTP ${res.status} | API role: ${res.body.data?.student?.role} | DB role: ${studentRecord?.role}`
    );
  } catch (e) {
    record('T1', 'Registration role check', false, e.message);
  }

  // ── TEST 2: Seed Admin & Login ──────────────────────────────────────────
  console.log(C('\n[ T2 ]  Create Admin via seed logic & Login'));
  try {
    await Student.deleteOne({ USN: 'ADMTEST001' });
    const admin = await Student.create({
      fullName: 'Faculty Admin Head',
      USN: 'ADMTEST001',
      collegeEmail: 'admtest001@canaraengineering.in',
      department: 'Artificial Intelligence & Machine Learning',
      academicYear: 'Faculty',
      semester: 1,
      password: 'AdminPassword@2025',
      role: 'admin',
    });

    const loginRes = await req('POST', '/api/auth/login', {
      identifier: 'ADMTEST001',
      password: 'AdminPassword@2025',
    });

    const ok =
      loginRes.status === 200 &&
      loginRes.body.data?.student?.role === 'admin' &&
      typeof loginRes.body.token === 'string';

    adminToken = loginRes.body.token;

    record(
      'T2',
      'Admin login returns role="admin" and valid JWT',
      ok,
      `HTTP ${loginRes.status} | role: ${loginRes.body.data?.student?.role}`
    );
  } catch (e) {
    record('T2', 'Admin seed and login', false, e.message);
  }

  // ── TEST 3: Student blocked with 403 on upload ───────────────────────────
  console.log(C('\n[ T3 ]  Security: Student attempting POST /api/resources'));
  try {
    const { boundary, bodyBuffer } = buildMultipart(
      {
        title: 'Hacked Notes',
        subjectName: 'Math',
        subjectCode: '22MATS11',
        category: 'notes',
        academicYear: '1st Year',
        semester: '1',
      },
      {
        fieldname: 'file',
        filename: 'sample.pdf',
        mimetype: 'application/pdf',
        buffer: SAMPLE_PDF_BUFFER,
      }
    );

    const res = await req('POST', '/api/resources', bodyBuffer, {
      Authorization: `Bearer ${studentToken}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    });

    const ok = res.status === 403 && res.body.status === 'error';
    record(
      'T3',
      'Student blocked from uploading resources (HTTP 403)',
      ok,
      `HTTP ${res.status} | msg: "${res.body.message}"`
    );
  } catch (e) {
    record('T3', 'Student upload block', false, e.message);
  }

  // ── TEST 4: Unauthenticated request rejected with 401 ───────────────────
  console.log(C('\n[ T4 ]  Security: Unauthenticated POST /api/resources'));
  try {
    const res = await req('POST', '/api/resources', {});
    const ok = res.status === 401 && res.body.status === 'error';
    record(
      'T4',
      'Unauthenticated upload rejected (HTTP 401)',
      ok,
      `HTTP ${res.status} | msg: "${res.body.message}"`
    );
  } catch (e) {
    record('T4', 'Unauthenticated block', false, e.message);
  }

  // ── TEST 5: Non-PDF file upload rejected with 400 ─────────────────────────
  console.log(C('\n[ T5 ]  Validation: Non-PDF upload rejection'));
  try {
    const { boundary, bodyBuffer } = buildMultipart(
      {
        title: 'Invalid Text File',
        subjectName: 'C Programming',
        subjectCode: '22POP12',
        category: 'notes',
        academicYear: '1st Year',
        semester: '1',
      },
      {
        fieldname: 'file',
        filename: 'notes.txt',
        mimetype: 'text/plain',
        buffer: Buffer.from('This is not a PDF file.'),
      }
    );

    const res = await req('POST', '/api/resources', bodyBuffer, {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    });

    const ok = res.status === 400 && res.body.message.includes('PDF');
    record(
      'T5',
      'Non-PDF upload rejected with 400 Bad Request',
      ok,
      `HTTP ${res.status} | msg: "${res.body.message}"`
    );
  } catch (e) {
    record('T5', 'Non-PDF validation', false, e.message);
  }

  // ── TEST 6: Admin uploads valid PDF resource ─────────────────────────────
  console.log(C('\n[ T6 ]  Admin: Upload valid autonomous PDF resource'));
  try {
    const { boundary, bodyBuffer } = buildMultipart(
      {
        title: 'Autonomous Mathematics-I Course Syllabus & Primer',
        description: 'Official autonomous curriculum syllabus copy and formula sheet.',
        academicYear: '1st Year',
        semester: '1',
        department: 'Artificial Intelligence & Machine Learning',
        subjectName: 'Mathematics-I for AIML Stream',
        subjectCode: '22MATS11',
        category: 'syllabus',
      },
      {
        fieldname: 'file',
        filename: 'Autonomous_Math1_Syllabus.pdf',
        mimetype: 'application/pdf',
        buffer: SAMPLE_PDF_BUFFER,
      }
    );

    const res = await req('POST', '/api/resources', bodyBuffer, {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    });

    const resource = res.body.data?.resource;
    createdResourceId = resource?._id;
    uploadedFilenameOnDisk = resource?.storedFilename;

    const fileExistsOnDisk =
      uploadedFilenameOnDisk &&
      fs.existsSync(path.join(UPLOAD_DIR, uploadedFilenameOnDisk));

    const ok =
      res.status === 201 &&
      Boolean(createdResourceId) &&
      resource.category === 'syllabus' &&
      resource.subjectCode === '22MATS11' &&
      fileExistsOnDisk;

    record(
      'T6',
      'Admin PDF upload → 201 | MongoDB record & disk file created',
      ok,
      `HTTP ${res.status} | ID: ${createdResourceId} | File on disk: ${fileExistsOnDisk ? 'YES' : 'NO'}`
    );
  } catch (e) {
    record('T6', 'Admin upload', false, e.message);
  }

  // ── TEST 7: Student lists published resources ───────────────────────────
  console.log(C('\n[ T7 ]  Student: GET /api/resources'));
  try {
    const res = await req('GET', '/api/resources?category=syllabus&subjectCode=22MATS11');
    const resources = res.body.data?.resources;
    const found = resources?.find((r) => r._id === createdResourceId);

    const ok = res.status === 200 && Boolean(found) && found.subjectCode === '22MATS11';
    record(
      'T7',
      'Student queries published resources → 200 | Resource found',
      ok,
      `HTTP ${res.status} | Count: ${resources?.length || 0} | Found: ${found ? 'YES' : 'NO'}`
    );
  } catch (e) {
    record('T7', 'Student query', false, e.message);
  }

  // ── TEST 8: Stream PDF inline (View) ────────────────────────────────────
  console.log(C('\n[ T8 ]  Student: GET /api/resources/:id/view'));
  try {
    const res = await req('GET', `/api/resources/${createdResourceId}/view`);
    const isPdfContentType = res.headers['content-type'] === 'application/pdf';
    const isInline = res.headers['content-disposition']?.includes('inline');

    const ok = res.status === 200 && isPdfContentType && isInline;
    record(
      'T8',
      'Student views PDF stream → 200 | Content-Type: application/pdf',
      ok,
      `HTTP ${res.status} | Type: ${res.headers['content-type']} | Disposition: ${res.headers['content-disposition']}`
    );
  } catch (e) {
    record('T8', 'PDF view stream', false, e.message);
  }

  // ── TEST 9: Download PDF attachment ──────────────────────────────────────
  console.log(C('\n[ T9 ]  Student: GET /api/resources/:id/download'));
  try {
    const res = await req('GET', `/api/resources/${createdResourceId}/download`);
    const isAttachment = res.headers['content-disposition']?.includes('attachment');

    const ok = res.status === 200 && isAttachment;
    record(
      'T9',
      'Student downloads PDF attachment → 200 | Content-Disposition: attachment',
      ok,
      `HTTP ${res.status} | Disposition: ${res.headers['content-disposition']}`
    );
  } catch (e) {
    record('T9', 'PDF download stream', false, e.message);
  }

  // ── TEST 10: Admin edits resource metadata ───────────────────────────────
  console.log(C('\n[ T10 ] Admin: PUT /api/resources/:id (Update metadata)'));
  try {
    const res = await req(
      'PUT',
      `/api/resources/${createdResourceId}`,
      {
        title: 'Autonomous Mathematics-I Course Syllabus - 2025 Edition',
        semester: 1,
      },
      {
        Authorization: `Bearer ${adminToken}`,
      }
    );

    const updated = res.body.data?.resource;
    const ok =
      res.status === 200 &&
      updated?.title === 'Autonomous Mathematics-I Course Syllabus - 2025 Edition';

    record(
      'T10',
      'Admin updates resource metadata → 200 | Title updated',
      ok,
      `HTTP ${res.status} | Updated title: "${updated?.title}"`
    );
  } catch (e) {
    record('T10', 'Admin update', false, e.message);
  }

  // ── TEST 11: Student blocked from editing & deleting ─────────────────────
  console.log(C('\n[ T11 ] Security: Student blocked from PUT & DELETE'));
  try {
    const [putRes, delRes] = await Promise.all([
      req('PUT', `/api/resources/${createdResourceId}`, { title: 'Hacked' }, { Authorization: `Bearer ${studentToken}` }),
      req('DELETE', `/api/resources/${createdResourceId}`, null, { Authorization: `Bearer ${studentToken}` }),
    ]);

    const ok = putRes.status === 403 && delRes.status === 403;
    record(
      'T11',
      'Student blocked from edit (PUT) & delete (DELETE) → Both 403',
      ok,
      `PUT: ${putRes.status} | DELETE: ${delRes.status}`
    );
  } catch (e) {
    record('T11', 'Student edit/delete block', false, e.message);
  }

  // ── TEST 12: Admin deletes resource (DB + Disk cleanup) ─────────────────
  console.log(C('\n[ T12 ] Admin: DELETE /api/resources/:id'));
  try {
    const res = await req('DELETE', `/api/resources/${createdResourceId}`, null, {
      Authorization: `Bearer ${adminToken}`,
    });

    const docInDb = await Resource.findById(createdResourceId);
    const fileStillOnDisk =
      uploadedFilenameOnDisk &&
      fs.existsSync(path.join(UPLOAD_DIR, uploadedFilenameOnDisk));

    const ok =
      res.status === 200 &&
      docInDb === null &&
      fileStillOnDisk === false;

    record(
      'T12',
      'Admin deletes resource → 200 | DB document & disk file unlinked',
      ok,
      `HTTP ${res.status} | DB Doc exists: ${docInDb !== null} | Disk File exists: ${fileStillOnDisk}`
    );
  } catch (e) {
    record('T12', 'Admin delete and file unlink', false, e.message);
  }
}

async function cleanup() {
  console.log(C('\n[ ♻  ]  Cleanup — removing temporary test accounts'));
  try {
    const delUsers = await Student.deleteMany({
      USN: { $in: ['STUROLE001', 'ADMTEST001'] },
    });
    console.log(`         ${G('✔')} Deleted ${delUsers.deletedCount} test user document(s).`);
  } catch (e) {
    console.log(`         ${R('✗')} Cleanup error: ${e.message}`);
  }
}

function summary() {
  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  console.log('\n' + B('════════════════════════════════════════════════════════════'));
  console.log(B('   STEP 4 TEST SUMMARY'));
  console.log(B('════════════════════════════════════════════════════════════'));
  console.log(`   Total  : ${results.length}`);
  console.log(`   ${G('Passed')} : ${G(passed)}`);
  console.log(`   ${failed ? R('Failed') : 'Failed'} : ${failed ? R(failed) : failed}`);
  console.log(B('════════════════════════════════════════════════════════════') + '\n');
  if (failed) {
    console.log(Y('   Failed tests:'));
    results
      .filter((r) => !r.passed)
      .forEach((r) =>
        console.log(`     ${R('✗')} [${r.id}] ${r.name}${r.details ? '\n         ' + D(r.details) : ''}`)
      );
    console.log('');
  }
}

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use('/api/auth', authRoutes);
  app.use('/api/resources', resourceRoutes);
  return app;
}

(async () => {
  await connectDB();
  const app = buildApp();
  const server = app.listen(PORT, async () => {
    console.log(D(`\n   Step 4 Test Server active on port ${PORT}`));
    try {
      await runTestSuite();
    } finally {
      await cleanup();
      summary();
      await mongoose.connection.close();
      server.close(() => process.exit(0));
    }
  });

  server.on('error', (e) => {
    console.error(R(`\nServer error on port ${PORT}: ${e.message}`));
    process.exit(1);
  });
})();
