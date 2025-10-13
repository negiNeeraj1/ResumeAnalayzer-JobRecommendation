import { NextResponse } from 'next/server';
import { signupUser } from '@/auth/signup';

export async function POST(request) {
  try {
    const userData = await request.json();

    const { name, email, password, role } = userData;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate role-specific fields
    if (role === 'student' && !userData.headline) {
      return NextResponse.json(
        { success: false, message: 'Headline is required for students' },
        { status: 400 }
      );
    }

    if (role === 'recruiter' && (!userData.company || !userData.position)) {
      return NextResponse.json(
        { success: false, message: 'Company and position are required for recruiters' },
        { status: 400 }
      );
    }

    const result = await signupUser(userData);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    const response = NextResponse.json(result, { status: 201 });

    // Set HTTP-only cookie with token
    response.cookies.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Signup route error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

