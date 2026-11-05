/**
 * Campus Bridge AI — Admin Seed & Promotion CLI
 * ---------------------------------------------
 * Creates or promotes an administrator account using environment variables.
 * Never hardcodes administrative credentials.
 *
 * Usage:
 *   ADMIN_NAME="Academic Dean" ADMIN_EMAIL="dean@canaraengineering.in" ADMIN_USN="ADMIN001" ADMIN_PASSWORD="SecureAdminPass@2025" node scripts/seedAdmin.js
 *
 * Or set ADMIN_EMAIL / ADMIN_PASSWORD in backend/.env temporarily and run:
 *   node scripts/seedAdmin.js
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Student from '../models/Student.js';

async function seedAdmin() {
  const email    = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name     = process.env.ADMIN_NAME || 'Campus Bridge Administrator';
  const usn      = process.env.ADMIN_USN  || 'ADMIN001';
  const dept     = process.env.ADMIN_DEPT || 'Artificial Intelligence & Machine Learning';
  const year     = process.env.ADMIN_YEAR || 'Faculty / Staff';
  const semester = Number(process.env.ADMIN_SEM) || 1;

  if (!email || !password) {
    console.error('\n\x1b[31m[SeedAdmin Error]\x1b[0m Missing required environment variables.');
    console.error('Please specify ADMIN_EMAIL and ADMIN_PASSWORD.');
    console.error('\nExample usage:');
    console.error('  ADMIN_EMAIL="admin@canaraengineering.in" ADMIN_PASSWORD="MySecretPassword123" node scripts/seedAdmin.js\n');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('\n\x1b[31m[SeedAdmin Error]\x1b[0m ADMIN_PASSWORD must be at least 8 characters long.\n');
    process.exit(1);
  }

  console.log('\nConnecting to MongoDB Atlas...');
  await connectDB();

  try {
    const normalisedEmail = email.trim().toLowerCase();
    const normalisedUSN   = usn.trim().toUpperCase();

    // Check if account already exists
    let user = await Student.findOne({
      $or: [{ collegeEmail: normalisedEmail }, { USN: normalisedUSN }],
    });

    if (user) {
      console.log(`\nExisting user found: ${user.fullName} (${user.collegeEmail})`);
      user.role = 'admin';
      user.password = password; // Pre-save hook will hash this securely
      await user.save();
      console.log(`\x1b[32m✔ Account successfully promoted to administrator role!\x1b[0m`);
    } else {
      user = await Student.create({
        fullName: name.trim(),
        USN: normalisedUSN,
        collegeEmail: normalisedEmail,
        department: dept.trim(),
        academicYear: year.trim(),
        semester,
        password, // Pre-save hook will hash this securely
        role: 'admin',
      });
      console.log(`\x1b[32m✔ New administrator account created successfully!\x1b[0m`);
    }

    console.log(`  Name  : ${user.fullName}`);
    console.log(`  Email : ${user.collegeEmail}`);
    console.log(`  USN   : ${user.USN}`);
    console.log(`  Role  : ${user.role}\n`);
  } catch (error) {
    console.error('\x1b[31m[SeedAdmin Execution Failed]\x1b[0m', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedAdmin();
