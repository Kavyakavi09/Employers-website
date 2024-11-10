import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Employer from '@/models/employerSchema';

export async function POST(req) {
  try {
    const { businessEmail, password } = await req.json();

    // Connect to the database
    await dbConnect();

    // Validate input
    if (!businessEmail || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), { status: 400 });
    }

    // Check if employer exists
    const employer = await Employer.findOne({ businessEmail });
    if (!employer) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, employer.passwordHash);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign(
      { employerId: employer._id, businessEmail: employer.businessEmail },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return token to client
    return new Response(
      JSON.stringify({ message: 'Login successful', token,employer }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
  }
}
