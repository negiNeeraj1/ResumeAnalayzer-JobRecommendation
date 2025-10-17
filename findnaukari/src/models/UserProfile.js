import mongoose from 'mongoose';

/**
 * UserProfile Schema
 * Stores detailed profile information extracted from resume
 * Separate from Resume model for better organization
 */
const UserProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // One profile per user
  },
  
  // Basic Information
  fullName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  
  // Professional Summary
  summary: {
    type: String,
  },
  objective: {
    type: String,
  },
  
  // Skills - categorized
  skills: {
    technical: {
      type: [String],
      default: [],
    },
    soft: {
      type: [String],
      default: [],
    },
    all: {
      type: [String],
      default: [],
    },
  },
  
  // Experience
  totalYearsOfExperience: {
    type: Number,
    default: 0,
  },
  workExperience: [{
    company: String,
    position: String,
    duration: String,
    description: String,
    startDate: String,
    endDate: String,
    current: {
      type: Boolean,
      default: false,
    },
  }],
  
  // Education
  education: [{
    institution: String,
    degree: String,
    field: String,
    year: String,
    grade: String,
    description: String,
  }],
  
  // Certifications
  certifications: [{
    name: String,
    issuer: String,
    date: String,
    credentialId: String,
  }],
  
  // Projects
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    url: String,
  }],
  
  // Links/URLs
  links: {
    linkedin: String,
    github: String,
    portfolio: String,
    other: [String],
  },
  
  // Languages
  languages: [{
    name: String,
    proficiency: String, // Native, Fluent, Intermediate, Basic
  }],
  
  // Achievements & Awards
  achievements: [String],
  
  // Resume metadata
  lastResumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
  },
  lastUpdatedFromResume: {
    type: Date,
  },
  
  // Profile completeness
  completeness: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  
}, {
  timestamps: true,
});

// Index for faster queries
UserProfileSchema.index({ userId: 1 });
UserProfileSchema.index({ email: 1 });

// Method to calculate profile completeness
UserProfileSchema.methods.calculateCompleteness = function() {
  let score = 0;
  const weights = {
    fullName: 10,
    email: 10,
    phone: 10,
    skills: 15,
    workExperience: 20,
    education: 15,
    summary: 10,
    links: 10,
  };
  
  if (this.fullName) score += weights.fullName;
  if (this.email) score += weights.email;
  if (this.phone) score += weights.phone;
  if (this.skills.all.length > 0) score += weights.skills;
  if (this.workExperience.length > 0) score += weights.workExperience;
  if (this.education.length > 0) score += weights.education;
  if (this.summary) score += weights.summary;
  if (this.links.linkedin || this.links.github) score += weights.links;
  
  this.completeness = score;
  return score;
};

export default mongoose.models.UserProfile || mongoose.model('UserProfile', UserProfileSchema);

