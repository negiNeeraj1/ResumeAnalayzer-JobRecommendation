import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyAuth } from '@/lib/auth';
import Resume from '@/models/Resume';

export async function POST(request) {
  try {
    console.log('🚀 API: Resume upload request received');
    
    // 1. Verify user is authenticated
    const auth = await verifyAuth();
    console.log('🔐 API: Auth check result:', auth);
    
    if (!auth.authenticated) {
      console.log('❌ API: User not authenticated');
      return NextResponse.json(
        { success: false, error: 'Please login to upload resume' },
        { status: 401 }
      );
    }
    
    console.log('✅ API: User authenticated:', auth.user.userId);

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
      console.log('🔄 API: Calling Flask ML service at http://localhost:5000/parse-resume');
      console.log('📊 API: File size:', file.size, 'bytes');
      
      const flaskResponse = await fetch('http://localhost:5000/parse-resume', {
        method: 'POST',
        body: flaskFormData,
        headers: {
          // Don't set Content-Type, let browser set it with boundary for FormData
        },
      });

      console.log('📥 API: Flask response status:', flaskResponse.status);

      if (!flaskResponse.ok) {
        const errorText = await flaskResponse.text();
        console.error('❌ Flask error response:', errorText);
        throw new Error(`ML service error (${flaskResponse.status}): ${errorText}`);
      }

      parsedData = await flaskResponse.json();
      console.log('✅ Flask parsed data successfully');
      console.log('📊 Skills found:', parsedData.data?.skills?.length || 0);
    } catch (mlError) {
      console.error('❌ ML service error:', mlError);
      
      // Check if Flask is running
      const errorMessage = mlError.message.includes('fetch failed') || mlError.message.includes('ECONNREFUSED')
        ? 'Flask ML service is not running. Please start Flask server on port 5000.'
        : `ML service error: ${mlError.message}`;
      
      return NextResponse.json({
        success: false,
        error: errorMessage
      }, { status: 503 });
    }

    // 4. Connect to database and save resume
    console.log('💾 API: Connecting to MongoDB...');
    await connectDB();
    console.log('✅ API: MongoDB connected');

    const resumeData = {
      userId: auth.user.userId,
      filename: file.name,
      rawText: parsedData.data?.raw_text || '',
      skills: parsedData.data?.skills || [],
      email: parsedData.data?.email || null,
      phone: parsedData.data?.phone || null,
      status: parsedData.success ? 'parsed' : 'failed',
      uploadedAt: new Date(),
    };

    console.log('💾 API: Saving resume to MongoDB...');
    console.log('📊 API: Resume data:', {
      userId: resumeData.userId,
      filename: resumeData.filename,
      skillCount: resumeData.skills.length,
      status: resumeData.status
    });

    const resume = await Resume.create(resumeData);
    console.log('✅ API: Resume saved to MongoDB with ID:', resume._id);

    // 5. Return success response
    return NextResponse.json({
      success: true,
      message: 'Resume uploaded successfully and saved to MongoDB',
      resumeId: resume._id,
      data: {
        skills: resume.skills,
        email: resume.email,
        phone: resume.phone,
        skillCount: resume.skills.length,
        uploadedAt: resume.uploadedAt,
        status: resume.status,
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

