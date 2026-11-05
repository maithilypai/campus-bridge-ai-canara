/**
 * Campus Bridge AI — Step 3 Integration Test
 * -------------------------------------------
 * Tests all 9 scenarios specified in the integration requirements
 * by calling the backend directly (simulating what the React frontend does).
 * Cleans up all test accounts at the end.
 */

import 'dotenv/config';
import http           from 'http';
import mongoose       from 'mongoose';
import { connectDB }  from './config/db.js';
import express        from 'express';
import cors           from 'cors';
import authRoutes     from './routes/authRoutes.js';
import Student        from './models/Student.js';

const PORT  = 5098;
const BASE  = `http://localhost:${PORT}/api/auth`;

// Two distinct test students
const S1 = {
  fullName: 'Integration Tester One', USN: 'INTG01CB001',
  collegeEmail: 'intg01cb001@campusbridge.test',
  department: 'Computer Science & Engineering', academicYear: '2024-2025',
  semester: 5, password: 'SecurePass@123', confirmPassword: 'SecurePass@123',
};
const S2 = {
  fullName: 'Integration Tester Two', USN: 'INTG02CB002',
  collegeEmail: 'intg02cb002@campusbridge.test',
  department: 'Artificial Intelligence & Machine Learning', academicYear: '2023-2024',
  semester: 3, password: 'AnotherPass@456', confirmPassword: 'AnotherPass@456',
};

const G  = (s) => `\x1b[32m${s}\x1b[0m`;
const R  = (s) => `\x1b[31m${s}\x1b[0m`;
const B  = (s) => `\x1b[1m${s}\x1b[0m`;
const C  = (s) => `\x1b[36m${s}\x1b[0m`;
const D  = (s) => `\x1b[2m${s}\x1b[0m`;
const Y  = (s) => `\x1b[33m${s}\x1b[0m`;

const results = [];
let token1 = null, token2 = null;

function record(id, name, passed, details = '') {
  results.push({ id, name, passed, details });
  const icon = passed ? G('✔ PASS') : R('✗ FAIL');
  const det  = details ? `\n         ${D(details)}` : '';
  console.log(`   ${icon}  ${name}${det}`);
}

function req(method, path, body = null, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: 'localhost', port: PORT, path, method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...extraHeaders,
      },
    };
    const r = http.request(opts, (res) => {
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        let json; try { json = JSON.parse(raw); } catch { json = { _raw: raw }; }
        resolve({ status: res.statusCode, body: json });
      });
    });
    r.on('error', reject);
    r.setTimeout(10000, () => r.destroy(new Error('timeout')));
    if (payload) r.write(payload);
    r.end();
  });
}

function noPasswordLeak(body) {
  return !/"password"\s*:\s*"\$2[aby]\$/.test(JSON.stringify(body));
}

async function runTests() {
  console.log('\n' + B('════════════════════════════════════════════════════════════'));
  console.log(B('   Campus Bridge AI — Step 3 Integration Test Suite'));
  console.log(B('════════════════════════════════════════════════════════════') + '\n');

  // ── TEST 1: New student registration (Student 1) ──────────────────────
  console.log(C('[ T1 ]  New student registration — Student 1'));
  try {
    const res = await req('POST', '/api/auth/register', S1);
    const ok = res.status === 201 && typeof res.body.token === 'string'
      && res.body.data?.student?.USN === S1.USN.toUpperCase()
      && res.body.data?.student?.collegeEmail === S1.collegeEmail.toLowerCase();
    if (ok) token1 = res.body.token;
    record('T1', 'Register Student 1 → 201 | JWT returned | fields normalised',
      ok, `HTTP ${res.status}  USN:${res.body.data?.student?.USN}  email:${res.body.data?.student?.collegeEmail}`);
  } catch (e) { record('T1', 'Register Student 1', false, e.message); }

  // ── TEST 2: Login with USN ────────────────────────────────────────────
  console.log(C('\n[ T2 ]  Login using USN — Student 1'));
  try {
    const res = await req('POST', '/api/auth/login', { identifier: S1.USN, password: S1.password });
    const ok = res.status === 200 && typeof res.body.token === 'string';
    if (ok) token1 = res.body.token;
    record('T2', 'Login with USN → 200 | JWT returned',
      ok, `HTTP ${res.status}  token:${ok ? 'yes' : 'NO'}`);
  } catch (e) { record('T2', 'Login with USN', false, e.message); }

  // ── TEST 3: Login with college email ──────────────────────────────────
  console.log(C('\n[ T3 ]  Login using college email — Student 1'));
  try {
    const res = await req('POST', '/api/auth/login', { identifier: S1.collegeEmail, password: S1.password });
    const ok = res.status === 200 && typeof res.body.token === 'string';
    record('T3', 'Login with college email → 200 | JWT returned',
      ok, `HTTP ${res.status}  token:${ok ? 'yes' : 'NO'}`);
  } catch (e) { record('T3', 'Login with college email', false, e.message); }

  // ── TEST 4: Incorrect password ────────────────────────────────────────
  console.log(C('\n[ T4 ]  Incorrect password rejection'));
  try {
    const res = await req('POST', '/api/auth/login', { identifier: S1.USN, password: 'wrongpassword!' });
    record('T4', 'Wrong password → 401 | generic message',
      res.status === 401 && res.body.status === 'error',
      `HTTP ${res.status}  msg: "${res.body.message}"`);
  } catch (e) { record('T4', 'Wrong password → 401', false, e.message); }

  // ── TEST 5: Dashboard — correct student identity from /me ─────────────
  console.log(C('\n[ T5 ]  GET /me — returns Student 1\'s own identity'));
  try {
    if (!token1) throw new Error('No token from T1/T2');
    const res = await req('GET', '/api/auth/me', null, { Authorization: `Bearer ${token1}` });
    const s = res.body.data?.student;
    const ok = res.status === 200
      && s?.USN === S1.USN.toUpperCase()
      && s?.collegeEmail === S1.collegeEmail.toLowerCase()
      && s?.fullName === S1.fullName
      && s?.department === S1.department
      && s?.semester === S1.semester;
    record('T5', 'GET /me with valid token → 200 | correct student identity returned',
      ok, `HTTP ${res.status}  USN:${s?.USN}  name:${s?.fullName}  dept:${s?.department}  sem:${s?.semester}`);
  } catch (e) { record('T5', 'GET /me correct identity', false, e.message); }

  // ── TEST 6: Page refresh simulation — session restore ─────────────────
  console.log(C('\n[ T6 ]  Session restore simulation (page refresh with saved JWT)'));
  try {
    if (!token1) throw new Error('No token for refresh simulation');
    // Simulate: browser sends the same saved token after refresh
    const res = await req('GET', '/api/auth/me', null, { Authorization: `Bearer ${token1}` });
    const ok = res.status === 200 && res.body.data?.student?.USN === S1.USN.toUpperCase();
    record('T6', 'Saved JWT re-used after "refresh" → 200 | profile reloaded',
      ok, `HTTP ${res.status}  USN:${res.body.data?.student?.USN}`);
  } catch (e) { record('T6', 'Session restore', false, e.message); }

  // ── TEST 7: Logout + dashboard access denied ──────────────────────────
  console.log(C('\n[ T7 ]  Logout — accessing /me with no token → 401'));
  try {
    // Simulate logout: token cleared from sessionStorage → no Authorization header
    const res = await req('GET', '/api/auth/me');  // no auth header
    record('T7', 'No token (after logout) → 401 | access denied',
      res.status === 401 && res.body.status === 'error',
      `HTTP ${res.status}  msg: "${res.body.message}"`);
  } catch (e) { record('T7', 'No token → 401', false, e.message); }

  // ── TEST 8: Second student — different identity, different token ───────
  console.log(C('\n[ T8 ]  Two different students show their own profiles'));
  try {
    // Register Student 2
    const regRes = await req('POST', '/api/auth/register', S2);
    if (regRes.status !== 201) throw new Error(`S2 register failed: HTTP ${regRes.status} — ${regRes.body.message}`);
    token2 = regRes.body.token;

    // Both tokens active — verify each returns the correct identity
    const [me1, me2] = await Promise.all([
      req('GET', '/api/auth/me', null, { Authorization: `Bearer ${token1}` }),
      req('GET', '/api/auth/me', null, { Authorization: `Bearer ${token2}` }),
    ]);

    const s1Ok = me1.status === 200 && me1.body.data?.student?.USN === S1.USN.toUpperCase();
    const s2Ok = me2.status === 200 && me2.body.data?.student?.USN === S2.USN.toUpperCase();
    const isolated = s1Ok && s2Ok && (me1.body.data?.student?.USN !== me2.body.data?.student?.USN);

    record('T8', 'Two students — each JWT returns only their own profile',
      isolated,
      `S1:${me1.body.data?.student?.USN} (${me1.status})  S2:${me2.body.data?.student?.USN} (${me2.status})  isolated:${isolated}`);
  } catch (e) { record('T8', 'Two student isolation', false, e.message); }

  // ── TEST 9: Password never in any response ────────────────────────────
  console.log(C('\n[ T9 ]  Password / bcrypt hash not present in any response'));
  try {
    const [r1, r2, r3] = await Promise.all([
      req('POST', '/api/auth/login', { identifier: S1.USN, password: S1.password }),
      token1 ? req('GET', '/api/auth/me', null, { Authorization: `Bearer ${token1}` }) : Promise.resolve({ body: {} }),
      token2 ? req('GET', '/api/auth/me', null, { Authorization: `Bearer ${token2}` }) : Promise.resolve({ body: {} }),
    ]);

    const c1 = noPasswordLeak(r1.body), c2 = noPasswordLeak(r2.body), c3 = noPasswordLeak(r3.body);
    record('T9', 'bcrypt hash absent from login + /me (S1) + /me (S2)',
      c1 && c2 && c3,
      `login:${c1?G('clean'):R('LEAKED')}  /me-S1:${c2?G('clean'):R('LEAKED')}  /me-S2:${c3?G('clean'):R('LEAKED')}`);
  } catch (e) { record('T9', 'Password leak audit', false, e.message); }
}

async function cleanup() {
  console.log(C('\n[ ♻  ]  Cleanup — removing test accounts'));
  try {
    const del = await Student.deleteMany({
      USN: { $in: ['INTG01CB001', 'INTG02CB002'] },
    });
    console.log(`         ${G('✔')} Deleted ${del.deletedCount} test document(s).`);
  } catch (e) {
    console.log(`         ${R('✗')} Cleanup error: ${e.message}`);
  }
}

function summary() {
  const passed = results.filter(r => r.passed).length;
  const failed = results.length - passed;
  console.log('\n' + B('════════════════════════════════════════════════════════════'));
  console.log(B('   TEST SUMMARY'));
  console.log(B('════════════════════════════════════════════════════════════'));
  console.log(`   Total  : ${results.length}`);
  console.log(`   ${G('Passed')} : ${G(passed)}`);
  console.log(`   ${failed ? R('Failed') : 'Failed'} : ${failed ? R(failed) : failed}`);
  console.log(B('════════════════════════════════════════════════════════════') + '\n');
  if (failed) {
    console.log(Y('   Failed tests:'));
    results.filter(r => !r.passed).forEach(r =>
      console.log(`     ${R('✗')} [${r.id}] ${r.name}${r.details ? '\n         ' + D(r.details) : ''}`)
    );
    console.log('');
  }
}

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use('/api/auth', authRoutes);
  app.use((req, res) => res.status(404).json({ status: 'error', message: 'Not found' }));
  return app;
}

(async () => {
  await connectDB();
  const app    = buildApp();
  const server = app.listen(PORT, async () => {
    console.log(D(`\n   Integration test server on port ${PORT}`));
    try {
      await runTests();
    } finally {
      await cleanup();
      summary();
      await mongoose.connection.close();
      server.close(() => process.exit(0));
    }
  });
  server.on('error', (e) => { console.error(R(`\nServer error: ${e.message}`)); process.exit(1); });
})();
