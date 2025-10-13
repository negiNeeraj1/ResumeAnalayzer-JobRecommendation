import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function loginUser(email, password) {
  try {
    await connectDB();

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return { success: false, message: 'Invalid credentials' };
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    const userData = {
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

    return { success: true, token, user: userData };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Server error' };
  }
}

