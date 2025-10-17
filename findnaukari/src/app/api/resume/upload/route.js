import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyAuth } from '@/lib/auth';
import Resume from '@/models/Resume';
import UserProfile from '@/models/UserProfile';

export async function POST(request) {
  const startTime = Date.now();
  
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
      console.log('📊 API: File info:', { name: file.name, size: file.size, type: file.type });
      
      const flaskResponse = await fetch('http://localhost:5000/parse-resume', {
        method: 'POST',
        body: flaskFormData,
      });

      console.log('📥 API: Flask response status:', flaskResponse.status);

      if (!flaskResponse.ok) {
        const errorText = await flaskResponse.text();
        console.error('❌ Flask error response:', errorText);
        throw new Error(`ML service failed with status ${flaskResponse.status}`);
      }

      parsedData = await flaskResponse.json();
      console.log('✅ Flask parsed data received');
    } catch (mlError) {
      console.error('❌ ML service error:', mlError.message);
      
      return NextResponse.json({
        success: false,
        error: `ML service unavailable: ${mlError.message}. Please make sure Flask is running on port 5000.`
      }, { status: 503 });
    }

    if (!parsedData.success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to parse resume'
      }, { status: 500 });
    }

    // 4. Connect to database
    await connectDB();

    const extractedData = parsedData.data;
    const processingTime = Date.now() - startTime;

    // 5. Save to Resume collection (stores raw data and file info)
    const resume = await Resume.create({
      userId: auth.user.userId,
      filename: `resume_${Date.now()}_${file.name}`,
      originalName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      
      // Text content
      rawText: extractedData.full_text || extractedData.raw_text || '',
      textLength: extractedData.text_length || 0,
      wordCount: extractedData.word_count || 0,
      
      // Extracted structured data
      extractedData: {
        name: extractedData.name,
        email: extractedData.email,
        phone: extractedData.phone,
        location: extractedData.location,
        skills: extractedData.skills || [],
        education: extractedData.education || [],
        experience: extractedData.experience || [],
        certifications: extractedData.certifications || [],
        links: extractedData.urls || {},
        yearsOfExperience: extractedData.years_of_experience,
      },
      
      // Status and metadata
      status: 'parsed',
      parsedAt: new Date(),
      processingTime: processingTime,
      uploadedAt: new Date(),
      isLatest: true,
    });

    console.log('✅ Resume saved to database:', resume._id);

    // 6. Update or Create UserProfile collection (stores user's current profile)
    try {
      const profileData = {
        userId: auth.user.userId,
        
        // Basic info
        fullName: extractedData.name || undefined,
        email: extractedData.email || undefined,
        phone: extractedData.phone || undefined,
        location: extractedData.location || undefined,
        
        // Skills
        'skills.all': extractedData.skills || [],
        'skills.technical': extractedData.skills || [],
        
        // Experience
        totalYearsOfExperience: extractedData.years_of_experience || 0,
        workExperience: (extractedData.experience || []).map(exp => ({
          position: exp.position || '',
          company: exp.company || '',
          duration: exp.duration || '',
          description: '',
        })),
        
        // Education
        education: (extractedData.education || []).map(edu => ({
          degree: edu.degree || '',
          institution: edu.institution || '',
          field: edu.field || '',
          year: edu.year || '',
        })),
        
        // Certifications
        certifications: (extractedData.certifications || []).map(cert => ({
          name: cert.name || '',
          issuer: cert.issuer || '',
        })),
        
        // Links
        links: {
          linkedin: extractedData.urls?.linkedin || undefined,
          github: extractedData.urls?.github || undefined,
          portfolio: extractedData.urls?.portfolio || undefined,
        },
        
        // Metadata
        lastResumeId: resume._id,
        lastUpdatedFromResume: new Date(),
      };

      // Remove undefined values
      Object.keys(profileData).forEach(key => {
        if (profileData[key] === undefined) {
          delete profileData[key];
        }
      });

      // Update existing profile or create new one
      const profile = await UserProfile.findOneAndUpdate(
        { userId: auth.user.userId },
        { $set: profileData },
        { upsert: true, new: true, runValidators: true }
      );

      // Calculate and update profile completeness
      profile.calculateCompleteness();
      await profile.save();

      console.log('✅ UserProfile updated:', profile._id, 'Completeness:', profile.completeness + '%');

      // 7. Return comprehensive success response
      return NextResponse.json({
        success: true,
        message: 'Resume uploaded and parsed successfully',
        data: {
          resumeId: resume._id,
          profileId: profile._id,
          
          // Extracted information
          personalInfo: {
            name: extractedData.name,
            email: extractedData.email,
            phone: extractedData.phone,
            location: extractedData.location,
          },
          
          skills: extractedData.skills || [],
          skillCount: (extractedData.skills || []).length,
          
          education: extractedData.education || [],
          educationCount: (extractedData.education || []).length,
          
          experience: extractedData.experience || [],
          experienceCount: (extractedData.experience || []).length,
          yearsOfExperience: extractedData.years_of_experience,
          
          certifications: extractedData.certifications || [],
          certificationCount: (extractedData.certifications || []).length,
          
          links: extractedData.urls || {},
          
          // Metadata
          profileCompleteness: profile.completeness,
          processingTime: processingTime,
          uploadedAt: resume.uploadedAt,
        }
      }, { status: 201 });

    } catch (profileError) {
      console.error('⚠️ Profile update error:', profileError);
      
      // Resume was saved successfully, but profile update failed
      // Still return success but with a warning
      return NextResponse.json({
        success: true,
        message: 'Resume uploaded successfully, but profile update had issues',
        data: {
          resumeId: resume._id,
          skills: extractedData.skills || [],
          skillCount: (extractedData.skills || []).length,
          uploadedAt: resume.uploadedAt,
        },
        warning: 'Profile could not be updated completely'
      }, { status: 201 });
    }

  } catch (error) {
    console.error('❌ Resume upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process resume. Please try again.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

