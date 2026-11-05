/**
 * Campus Bridge AI — Auth API Functional Test Suite
 * --------------------------------------------------
 * Builds a minimal Express app (same middleware stack as server.js),
 * starts it on port 5099 (isolated from the real server on 5000),
 * runs all test cases against live MongoDB Atlas, cleans up, then exits.
 *
 * Run with:  node test_auth.mjs
 */

import 'dotenv/config';
import http           from 'http';
import express        from 'express';
import cors           from 'cors';
import mongoose       from 'mongoose';
import { connectDB }  from './config/db.js';
import authRoutes     from './routes/authRoutes.js';
import Student        from './models/Student.js';

// ── Config ────────────────────────────────────────────────────────────────
const PORT   = 5099;
const BASE   = '/api/auth';
const TIMEOUT = 12_000;

/** Credentials for the throwaway test account */
const TEST_USN   = 'CBTEST99001';
const TEST_EMAIL = 'cbtest99001@campusbridge.test';
const TEST_PASS  = 'SecurePass@123';

// ── Colour helpers ────────────────────────────────────────────────────────
const G  = (s) => `\x1b[32m${s}\x1b[0m`;   // green
const R  = (s) => `\x1b[31m${s}\x1b[0m`;   // red
const Y  = (s) => `\x1b[33m${s}\x1b[0m`;   // yellow
const B  = (s) => `\x1b[1m${s}\x1b[0m`;    // bold
const C  = (s) => `\x1b[36m${s}\x1b[0m`;   // cyan
const D  = (s) => `\x1b[2m${s}\x1b[0m`;    // dim

// ── Results ledger ────────────────────────────────────────────────────────
const results = [];
let jwt = null;

function record(id, name, passed, details = '') {
  results.push({ id, name, passed, details });
  const icon = passed ? G('✔ PASS') : R('✗ FAIL');
  const det  = details ? `\n         ${D(details)}` : '';
  console.log(`   ${icon}  ${name}${det}`);
}

// ── HTTP helper ───────────────────────────────────────────────────────────
function req(method, path, body = null, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const opts = {
      hostname : 'localhost',
      port     : PORT,
      path,
      method,
      headers  : {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...extraHeaders,
      },
    };
    const r = http.request(opts, (res) => {
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        let json;
        try { json = JSON.parse(raw); } catch { json = { _raw: raw }; }
        resolve({ status: res.statusCode, body: json });
      });
    });
    r.on('error', reject);
    r.setTimeout(TIMEOUT, () => r.destroy(new Error('Request timed out')));
    if (payload) r.write(payload);
    r.end();
  });
}

/** Returns true when no bcrypt hash appears in the JSON body */
function noHashLeak(body) {
  return !/"password"\s*:\s*"\$2[aby]\$/.test(JSON.stringify(body));
}

// ── Build test Express app (mirrors server.js, no listen call) ────────────
function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use('/api/auth', authRoutes);
  // 404 fallback
  app.use((req, res) => res.status(404).json({ status: 'error', message: 'Not found' }));
  return app;
}

// ── Test Cases ────────────────────────────────────────────────────────────
async function runTests() {
  console.log('\n' + B('═══════════════════════════════════════════════════════'));
  console.log(B('   Campus Bridge AI — Auth API Functional Test Suite'));
  console.log(B('═══════════════════════════════════════════════════════') + '\n');

  // ── T1: Successful registration ───────────────────────────────────────
  console.log(C('[ T1 ]  POST /api/auth/register — valid registration'));
  try {
    const res = await req('POST', `${BASE}/register`, {
      fullName       : 'Campus Bridge Tester',
      USN            : TEST_USN,
      collegeEmail   : TEST_EMAIL,
      department     : 'Computer Science',
      academicYear   : '2024-2025',
      semester       : 4,
      password       : TEST_PASS,
      confirmPassword: TEST_PASS,
    });

    const hasToken  = typeof res.body.token === 'string' && res.body.token.length > 10;
    const correctUSN = res.body.data?.student?.USN === TEST_USN.toUpperCase();
    const correctEmail = res.body.data?.student?.collegeEmail === TEST_EMAIL.toLowerCase();
    const ok = res.status === 201 && res.body.status === 'success' && hasToken && correctUSN && correctEmail;

    if (hasToken) jwt = res.body.token;

    record('T1', 'Register → 201 | token returned | USN+email normalised',
      ok, `HTTP ${res.status}  token:${hasToken ? 'yes' : 'NO'}  USN:${res.body.data?.student?.USN ?? '?'}  email:${res.body.data?.student?.collegeEmail ?? '?'}`);
  } catch (e) { record('T1', 'Register → 201', false, e.message); }

  // ── T2: Duplicate USN ─────────────────────────────────────────────────
  console.log(C('\n[ T2 ]  POST /api/auth/register — duplicate USN'));
  try {
    const res = await req('POST', `${BASE}/register`, {
      fullName       : 'Another Person',
      USN            : TEST_USN,                        // ← same USN
      collegeEmail   : 'different99@campusbridge.test',
      department     : 'ECE',
      academicYear   : '2024-2025',
      semester       : 2,
      password       : TEST_PASS,
      confirmPassword: TEST_PASS,
    });
    record('T2', 'Duplicate USN → 409 Conflict',
      res.status === 409 && res.body.status === 'error',
      `HTTP ${res.status}  msg: "${res.body.message}"`);
  } catch (e) { record('T2', 'Duplicate USN → 409', false, e.message); }

  // ── T3: Duplicate email ───────────────────────────────────────────────
  console.log(C('\n[ T3 ]  POST /api/auth/register — duplicate email'));
  try {
    const res = await req('POST', `${BASE}/register`, {
      fullName       : 'Another Person',
      USN            : 'CBTEST99002',                   // ← different USN
      collegeEmail   : TEST_EMAIL,                      // ← same email
      department     : 'ME',
      academicYear   : '2024-2025',
      semester       : 3,
      password       : TEST_PASS,
      confirmPassword: TEST_PASS,
    });
    record('T3', 'Duplicate email → 409 Conflict',
      res.status === 409 && res.body.status === 'error',
      `HTTP ${res.status}  msg: "${res.body.message}"`);
  } catch (e) { record('T3', 'Duplicate email → 409', false, e.message); }

  // ── T4: Login with USN ────────────────────────────────────────────────
  console.log(C('\n[ T4 ]  POST /api/auth/login — identifier = USN'));
  try {
    const res = await req('POST', `${BASE}/login`, {
      identifier: TEST_USN,
      password  : TEST_PASS,
    });
    const ok = res.status === 200 && res.body.status === 'success'
      && typeof res.body.token === 'string';
    if (ok && !jwt) jwt = res.body.token;
    record('T4', 'Login with USN → 200 | JWT returned',
      ok, `HTTP ${res.status}  token:${ok ? 'yes' : 'NO'}`);
  } catch (e) { record('T4', 'Login with USN → 200', false, e.message); }

  // ── T5: Login with college email ──────────────────────────────────────
  console.log(C('\n[ T5 ]  POST /api/auth/login — identifier = college email'));
  try {
    const res = await req('POST', `${BASE}/login`, {
      identifier: TEST_EMAIL,
      password  : TEST_PASS,
    });
    const ok = res.status === 200 && res.body.status === 'success'
      && typeof res.body.token === 'string';
    record('T5', 'Login with college email → 200 | JWT returned',
      ok, `HTTP ${res.status}  token:${ok ? 'yes' : 'NO'}`);
  } catch (e) { record('T5', 'Login with email → 200', false, e.message); }

  // ── T6: Incorrect password ────────────────────────────────────────────
  console.log(C('\n[ T6 ]  POST /api/auth/login — wrong password'));
  try {
    const res = await req('POST', `${BASE}/login`, {
      identifier: TEST_USN,
      password  : 'TotallyWrongPassword!',
    });
    record('T6', 'Wrong password → 401 | generic error message',
      res.status === 401 && res.body.status === 'error',
      `HTTP ${res.status}  msg: "${res.body.message}"`);
  } catch (e) { record('T6', 'Wrong password → 401', false, e.message); }

  // ── T7: GET /me with valid JWT ────────────────────────────────────────
  console.log(C('\n[ T7 ]  GET /api/auth/me — valid JWT'));
  try {
    if (!jwt) throw new Error('No JWT available (T1/T4 must pass first)');
    const res = await req('GET', `${BASE}/me`, null, { Authorization: `Bearer ${jwt}` });
    const ok  = res.status === 200 && res.body.status === 'success'
      && res.body.data?.student?.USN === TEST_USN.toUpperCase();
    record('T7', 'GET /me valid token → 200 | profile returned',
      ok, `HTTP ${res.status}  USN: ${res.body.data?.student?.USN ?? 'missing'}`);
  } catch (e) { record('T7', 'GET /me valid token → 200', false, e.message); }

  // ── T8: GET /me with invalid JWT ─────────────────────────────────────
  console.log(C('\n[ T8 ]  GET /api/auth/me — invalid JWT'));
  try {
    const res = await req('GET', `${BASE}/me`, null, {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.fake.payload',
    });
    record('T8', 'GET /me invalid token → 401',
      res.status === 401 && res.body.status === 'error',
      `HTTP ${res.status}  msg: "${res.body.message}"`);
  } catch (e) { record('T8', 'GET /me invalid token → 401', false, e.message); }

  // ── T9: Password / hash leak audit ───────────────────────────────────
  console.log(C('\n[ T9 ]  Password & hash leak audit — all three endpoints'));
  try {
    const [r1, r2, r3] = await Promise.all([
      // /register response (will 409 — that's fine)
      req('POST', `${BASE}/register`, {
        fullName: 'LeakTest User', USN: 'CBLEAK001',
        collegeEmail: 'leaktest@campusbridge.test',
        department: 'CS', academicYear: '2024-25', semester: 1,
        password: TEST_PASS, confirmPassword: TEST_PASS,
      }),
      // /login response
      req('POST', `${BASE}/login`, { identifier: TEST_USN, password: TEST_PASS }),
      // /me response
      jwt
        ? req('GET', `${BASE}/me`, null, { Authorization: `Bearer ${jwt}` })
        : Promise.resolve({ status: 0, body: {} }),
    ]);

    // Clean up leak-test account if it somehow got created
    if (r1.status === 201) {
      await Student.deleteOne({ USN: 'CBLEAK001' });
    }

    const c1 = noHashLeak(r1.body);
    const c2 = noHashLeak(r2.body);
    const c3 = noHashLeak(r3.body);

    record('T9', 'No bcrypt hash in register / login / /me responses',
      c1 && c2 && c3,
      `register:${c1 ? G('clean') : R('LEAKED')}  login:${c2 ? G('clean') : R('LEAKED')}  /me:${c3 ? G('clean') : R('LEAKED')}`);
  } catch (e) { record('T9', 'Password/hash leak audit', false, e.message); }
}

// ── Cleanup ───────────────────────────────────────────────────────────────
async function cleanup() {
  console.log(C('\n[ ♻  ]  Cleanup — deleting test accounts from MongoDB'));
  try {
    const del = await Student.deleteMany({
      USN: { $in: ['CBTEST99001', 'CBTEST99002', 'CBLEAK001'] },
    });
    console.log(`         ${G('✔')} Deleted ${del.deletedCount} test document(s).`);
  } catch (e) {
    console.log(`         ${R('✗')} Cleanup error: ${e.message}`);
  }
}

// ── Summary ───────────────────────────────────────────────────────────────
function summary() {
  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  console.log('\n' + B('═══════════════════════════════════════════════════════'));
  console.log(B('   TEST SUMMARY'));
  console.log(B('═══════════════════════════════════════════════════════'));
  console.log(`   Total  : ${results.length}`);
  console.log(`   ${G('Passed')} : ${G(passed)}`);
  console.log(`   ${failed ? R('Failed') : 'Failed'} : ${failed ? R(failed) : failed}`);
  console.log(B('═══════════════════════════════════════════════════════') + '\n');
  if (failed) {
    console.log(Y('   Failed tests:'));
    results.filter((r) => !r.passed).forEach((r) =>
      console.log(`     ${R('✗')} [${r.id}] ${r.name}${r.details ? '\n         ' + D(r.details) : ''}`)
    );
    console.log('');
  }
}

// ── Entry ─────────────────────────────────────────────────────────────────
(async () => {
  await connectDB();

  const app    = buildApp();
  const server = app.listen(PORT, async () => {
    console.log(D(`\n   Test server started on port ${PORT}`));
    try {
      await runTests();
    } finally {
      await cleanup();
      summary();
      await mongoose.connection.close();
      server.close(() => process.exit(0));
    }
  });

  server.on('error', (e) => {
    console.error(R(`\nFailed to start test server on ${PORT}: ${e.message}`));
    process.exit(1);
  });
})();
