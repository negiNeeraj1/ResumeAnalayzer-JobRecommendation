import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyAuth } from '@/lib/auth';
import UserProfile from '@/models/UserProfile';

/**
 * GET /api/profile
 * Get user profile
 */
export async function GET(request) {
  try {
    // Verify authentication
    const auth = await verifyAuth();
    
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Please login to view profile' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get user profile
    const profile = await UserProfile.findOne({ userId: auth.user.userId }).lean();

    if (!profile) {
      return NextResponse.json({
        success: true,
        exists: false,
        message: 'No profile found. Please upload a resume to create your profile.'
      });
    }

    return NextResponse.json({
      success: true,
      exists: true,
      data: {
        profileId: profile._id,
        
        // Personal info
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        
        // Professional info
        summary: profile.summary,
        objective: profile.objective,
        
        // Skills
        skills: profile.skills,
        
        // Experience
        totalYearsOfExperience: profile.totalYearsOfExperience,
        workExperience: profile.workExperience,
        
        // Education
        education: profile.education,
        
        // Certifications & Projects
        certifications: profile.certifications,
        projects: profile.projects,
        
        // Links
        links: profile.links,
        
        // Languages & Achievements
        languages: profile.languages,
        achievements: profile.achievements,
        
        // Metadata
        completeness: profile.completeness,
        lastUpdatedFromResume: profile.lastUpdatedFromResume,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      }
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/profile
 * Update user profile manually
 */
export async function PATCH(request) {
  try {
    // Verify authentication
    const auth = await verifyAuth();
    
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Please login to update profile' },
        { status: 401 }
      );
    }

    const updates = await request.json();
    
    await connectDB();

    // Update profile
    const profile = await UserProfile.findOneAndUpdate(
      { userId: auth.user.userId },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );

    // Recalculate completeness
    profile.calculateCompleteness();
    await profile.save();

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profileId: profile._id,
        completeness: profile.completeness,
      }
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

