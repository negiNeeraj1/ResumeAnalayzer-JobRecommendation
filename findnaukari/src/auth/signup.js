import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function signupUser(userData) {
  try {
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      return { success: false, message: 'Email already registered' };
    }

    // Parse skills if it's a comma-separated string
    if (userData.topSkills && typeof userData.topSkills === 'string') {
      userData.topSkills = userData.topSkills
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean);
    }

    // Create new user
    const user = await User.create(userData);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (password excluded by model)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      // Include role-specific data
      ...(user.role === 'student' && {
        headline: user.headline,
        topSkills: user.topSkills,
        experienceYears: user.experienceYears,
      }),
      ...(user.role === 'recruiter' && {
        company: user.company,
        position: user.position,
        hiringFocus: user.hiringFocus,
      }),
    };

    return { success: true, token, user: userResponse };
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return { success: false, message: messages.join(', ') };
    }
    
    return { success: false, message: error.message || 'Server error' };
  }
}

