import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyAuth } from '@/lib/auth';
import Resume from '@/models/Resume';

export async function POST(request) {
  try {
    // 1. Verify user is authenticated
    const auth = await verifyAuth();
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Please login to upload resume' },
        { status: 401 }
      );
    }

    // 2. Get the uploaded file
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // 3. Send file to Flask ML service for parsing
    const flaskFormData = new FormData();
    flaskFormData.append('file', file);

    let parsedData;
    try {
      const flaskResponse = await fetch('http://localhost:5000/parse-resume', {
        method: 'POST',
        body: flaskFormData,
      });

      if (!flaskResponse.ok) {
        throw new Error('ML service failed');
      }

      parsedData = await flaskResponse.json();
    } catch (mlError) {
      console.error('ML service error:', mlError);
      // If ML service fails, still save with basic info
      parsedData = {
        success: false,
        data: {
          raw_text: '',
          skills: [],
          email: null,
          phone: null,
        }
      };
    }

    // 4. Connect to database and save resume
    await connectDB();

    const resume = await Resume.create({
      userId: auth.user.userId,
      filename: file.name,
      rawText: parsedData.data?.raw_text || '',
      skills: parsedData.data?.skills || [],
      email: parsedData.data?.email || null,
      phone: parsedData.data?.phone || null,
      status: parsedData.success ? 'parsed' : 'failed',
      uploadedAt: new Date(),
    });

    // 5. Return success response
    return NextResponse.json({
      success: true,
      message: 'Resume uploaded and parsed successfully',
      resumeId: resume._id,
      data: {
        skills: resume.skills,
        email: resume.email,
        phone: resume.phone,
        skillCount: resume.skills.length,
        uploadedAt: resume.uploadedAt,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process resume. Please try again.' },
      { status: 500 }
    );
  }
}

