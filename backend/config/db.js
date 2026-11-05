import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas using Mongoose.
 * Reads connection string from process.env.MONGO_URI (set in backend/.env).
 * Never prints or logs the actual connection string or password.
 */
export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  // Guard 1: MONGO_URI is completely missing
  if (!mongoURI || mongoURI.trim() === '') {
    console.warn('\n======================================================');
    console.warn('\x1b[33m[MongoDB Config]\x1b[0m MONGO_URI is not set in backend/.env');
    console.warn('Add your Atlas connection string:');
    console.warn('  MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/campusbridge?retryWrites=true&w=majority');
    console.warn('======================================================\n');
    return null;
  }

  // Guard 2: Password placeholder still present — do NOT attempt connection
  const hasPlaceholderPassword =
    mongoURI.includes('YOUR_PASSWORD') ||
    mongoURI.includes('<password>') ||
    mongoURI.includes('<db_password>');

  if (hasPlaceholderPassword) {
    console.warn('\n======================================================');
    console.warn('\x1b[33m[MongoDB Config]\x1b[0m YOUR_PASSWORD placeholder detected in MONGO_URI.');
    console.warn('MongoDB Atlas authentication requires your real database user password.');
    console.warn('');
    console.warn('Action required:');
    console.warn('  1. Open: CampusBridge AI/backend/.env');
    console.warn('  2. Find the MONGO_URI line');
    console.warn('  3. Replace  YOUR_PASSWORD  with your actual Atlas database password');
    console.warn('  4. Save the file, then restart: npm run dev');
    console.warn('');
    console.warn('To reset/find your password:');
    console.warn('  MongoDB Atlas → Database Access → Edit maithilypai777_db_user → Edit Password');
    console.warn('======================================================\n');
    return null;
  }

  // Guard 3: Username placeholder still present
  const hasPlaceholderUser =
    mongoURI.includes('<username>') ||
    mongoURI.includes('YOUR_USERNAME');

  if (hasPlaceholderUser) {
    console.warn('\n======================================================');
    console.warn('\x1b[33m[MongoDB Config]\x1b[0m Username placeholder detected in MONGO_URI.');
    console.warn('Replace <username> with: maithilypai777_db_user');
    console.warn('======================================================\n');
    return null;
  }

  // Attempt connection
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 8000, // 8-second timeout before giving up
    });

    console.log(
      `\x1b[32m[MongoDB Connected]\x1b[0m` +
      ` Host: ${conn.connection.host}` +
      ` | Database: ${conn.connection.name}`
    );
    return conn;
  } catch (error) {
    console.error('\n======================================================');
    console.error(`\x1b[31m[MongoDB Connection Error]\x1b[0m ${error.message}`);
    console.error('');
    console.error('Common causes:');
    console.error('  1. Wrong password in MONGO_URI (most likely — reset in Atlas → Database Access)');
    console.error('  2. Your IP is not whitelisted (Atlas → Network Access → Add 0.0.0.0/0)');
    console.error('  3. Cluster is paused (Atlas → Clusters → Resume)');
    console.error('======================================================\n');
    return null;
  }
};
