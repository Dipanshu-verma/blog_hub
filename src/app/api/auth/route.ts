import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body;
    
    const db = await connectDB();
    
    if (action === 'logout') {
      const response = NextResponse.json({ message: 'Logged out successfully' });
      response.cookies.set('token', '', { httpOnly: true, maxAge: 0 });
      return response;
    }
    
    if (action === 'getCurrentUser') {
      const token = request.cookies.get('token')?.value;
      if (!token) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
      }
      
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      return NextResponse.json({ user: decoded });
    }
    
    if (action === 'register') {
      // Check if user exists
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const result = await db.collection('users').insertOne({
        name,
        email,
        password: hashedPassword,
        createdAt: new Date()
      });
      
      // Create token
      const token = jwt.sign(
        { userId: result.insertedId, email, name }, 
        process.env.JWT_SECRET!, 
        { expiresIn: '7d' }
      );
      
      const response = NextResponse.json({ message: 'User created' });
      response.cookies.set('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
      return response;
    }
    
    if (action === 'login') {
      // Find user
      const user = await db.collection('users').findOne({ email });
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      
      // Check password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      
      // Create token
      const token = jwt.sign(
        { userId: user._id, email: user.email, name: user.name }, 
        process.env.JWT_SECRET!, 
        { expiresIn: '7d' }
      );
      
      const response = NextResponse.json({ message: 'Login successful' });
      response.cookies.set('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
      return response;
    }
    
  } catch (error) {
    console.log('Auth error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}