import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

let db: any;

export async function connectDB() {
  if (db) return db;
  
  try {
    await client.connect();
    db = client.db('blogdb');
    return db;
  } catch (error) {
    console.log('DB connection error:', error);
    throw error;
  }
}