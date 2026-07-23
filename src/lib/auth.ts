// lib/auth.ts
import { betterAuth } from 'better-auth';
import { MongoClient } from 'mongodb';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';

// ✅ Environment variable check with fallback
const getMongoUri = () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    // Build time এ error না দেওয়ার জন্য
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️ MONGODB_URI is not defined, using fallback');
    }
    return 'mongodb://localhost:27017/reusehub_db';
  }
  return uri;
};

// ১. গ্লোবাল ভেরিয়েবল সেট করা (যাতে Next.js হট-রিলোডে কানেকশন না হারায়)
const globalForMongo = global as unknown as {
  mongoClient?: MongoClient;
};

// ২. ক্লায়েন্ট চেক এবং তৈরি
const uri = getMongoUri();

// ✅ Try to create client with error handling
let client: MongoClient;
try {
  client = globalForMongo.mongoClient || new MongoClient(uri);
  if (process.env.NODE_ENV !== 'production') {
    globalForMongo.mongoClient = client;
  }
} catch (error) {
  console.error('❌ MongoDB Client Error:', error);
  // Fallback client for build
  client = new MongoClient('process.env.MONGODB_URI');
}

// ৩. ডাটাবেস ইন্সট্যান্স
const db = client.db('agroVision_db');

// ✅ Export auth with error handling
export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user',
      },
      plan: {
        type: 'string',
        defaultValue: 'free',
      },
    },
  },
});

export default auth;
