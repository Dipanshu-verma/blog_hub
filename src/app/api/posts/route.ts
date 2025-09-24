import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const db = await connectDB();
    const posts = await db.collection('posts').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    
    const body = await request.json();
    const { title, content, action, id } = body;
    
    const db = await connectDB();
    
    if (action === 'create') {
      const result = await db.collection('posts').insertOne({
        title,
        content,
        authorId: decoded.userId,
        authorName: decoded.name,
        createdAt: new Date()
      });
      
      return NextResponse.json({ message: 'Post created', id: result.insertedId });
    }

    if (action === 'getOne') {
      const post = await db.collection('posts').findOne({ _id: new ObjectId(id) });
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json({ post });
    }
    
    if (action === 'update') {
      await db.collection('posts').updateOne(
        { _id: new ObjectId(id), authorId: decoded.userId },
        { $set: { title, content, updatedAt: new Date() } }
      );
      
      return NextResponse.json({ message: 'Post updated' });
    }
    
    if (action === 'delete') {
      await db.collection('posts').deleteOne({
        _id: new ObjectId(id),
        authorId: decoded.userId
      });
      
      return NextResponse.json({ message: 'Post deleted' });
    }
    
  } catch (error) {
    console.log('Posts error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}