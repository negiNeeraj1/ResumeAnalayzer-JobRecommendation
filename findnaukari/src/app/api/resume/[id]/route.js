import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyAuth } from '@/lib/auth';
import Resume from '@/models/Resume';

/**
 * GET /api/resume/[id]
 * Get a specific resume by ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Verify authentication
    const auth = await verifyAuth();
    
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Please login to view resume' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get resume and verify it belongs to the user
    const resume = await Resume.findOne({
      _id: id,
      userId: auth.user.userId
    }).lean();

    if (!resume) {
      return NextResponse.json(
        { success: false, error: 'Resume not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: resume._id,
        filename: resume.originalName || resume.filename,
        uploadedAt: resume.uploadedAt,
        status: resume.status,
        version: resume.version,
        isLatest: resume.isLatest,
        fileSize: resume.fileSize,
        textLength: resume.textLength,
        wordCount: resume.wordCount,
        processingTime: resume.processingTime,
        
        // Extracted data
        personalInfo: {
          name: resume.extractedData?.name,
          email: resume.extractedData?.email,
          phone: resume.extractedData?.phone,
          location: resume.extractedData?.location,
        },
        
        skills: resume.extractedData?.skills || [],
        education: resume.extractedData?.education || [],
        experience: resume.extractedData?.experience || [],
        certifications: resume.extractedData?.certifications || [],
        links: resume.extractedData?.links || {},
        yearsOfExperience: resume.extractedData?.yearsOfExperience,
        
        // Raw text (first 1000 chars for preview)
        textPreview: resume.rawText ? resume.rawText.substring(0, 1000) + '...' : '',
      }
    });

  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/resume/[id]
 * Delete a specific resume by ID
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Verify authentication
    const auth = await verifyAuth();
    
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Please login to delete resume' },
        { status: 401 }
      );
    }

    await connectDB();

    // Delete resume and verify it belongs to the user
    const result = await Resume.deleteOne({
      _id: id,
      userId: auth.user.userId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Resume not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Resume deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete resume' },
      { status: 500 }
    );
  }
}

