import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyAuth } from '@/lib/auth';
import Resume from '@/models/Resume';

/**
 * GET /api/resume/list
 * Get all resumes for the authenticated user
 */
export async function GET(request) {
  try {
    // Verify authentication
    const auth = await verifyAuth();
    
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Please login to view resumes' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get all resumes for this user, sorted by upload date (newest first)
    const resumes = await Resume.find({ userId: auth.user.userId })
      .select('-rawText -fileBuffer') // Exclude large text fields
      .sort({ uploadedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: resumes.length,
      data: resumes.map(resume => ({
        id: resume._id,
        filename: resume.originalName || resume.filename,
        uploadedAt: resume.uploadedAt,
        status: resume.status,
        version: resume.version,
        isLatest: resume.isLatest,
        skillCount: resume.extractedData?.skills?.length || 0,
        educationCount: resume.extractedData?.education?.length || 0,
        experienceCount: resume.extractedData?.experience?.length || 0,
        name: resume.extractedData?.name,
        email: resume.extractedData?.email,
        phone: resume.extractedData?.phone,
        yearsOfExperience: resume.extractedData?.yearsOfExperience,
      }))
    });

  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}

