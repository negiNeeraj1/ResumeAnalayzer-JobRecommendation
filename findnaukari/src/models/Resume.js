import mongoose from 'mongoose';

/**
 * Resume Schema
 * Stores uploaded resume files and extracted raw data
 */
const ResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number, // in bytes
  },
  mimeType: {
    type: String,
    default: 'application/pdf',
  },
  
  // Extracted Text Content
  rawText: {
    type: String,
    required: true,
  },
  textLength: {
    type: Number,
  },
  wordCount: {
    type: Number,
  },
  
  // Extracted Information (structured)
  extractedData: {
    name: String,
    email: String,
    phone: String,
    
    skills: {
      type: [String],
      default: [],
    },
    
    education: [{
      degree: String,
      institution: String,
      year: String,
      field: String,
    }],
    
    experience: [{
      position: String,
      company: String,
      duration: String,
    }],
    
    certifications: [{
      name: String,
      issuer: String,
    }],
    
    links: {
      linkedin: String,
      github: String,
      portfolio: String,
      other: [String],
    },
    
    yearsOfExperience: Number,
    location: String,
  },
  
  // File Storage
  fileUrl: {
    type: String, // For cloud storage URL
  },
  fileBuffer: {
    type: Buffer, // For storing file directly in MongoDB (optional)
  },
  
  // Parsing Metadata
  status: {
    type: String,
    enum: ['uploaded', 'parsing', 'parsed', 'failed'],
    default: 'uploaded',
  },
  parsingError: {
    type: String,
  },
  parsedAt: {
    type: Date,
  },
  
  // ML Service Response
  mlServiceVersion: {
    type: String,
    default: '1.0.0',
  },
  processingTime: {
    type: Number, // in milliseconds
  },
  
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  
  // Version control (if user uploads multiple resumes)
  version: {
    type: Number,
    default: 1,
  },
  isLatest: {
    type: Boolean,
    default: true,
  },
  
}, {
  timestamps: true,
});

// Indexes for faster queries
ResumeSchema.index({ userId: 1, uploadedAt: -1 });
ResumeSchema.index({ userId: 1, isLatest: 1 });
ResumeSchema.index({ status: 1 });

// Pre-save middleware to mark previous resumes as not latest
ResumeSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Mark all previous resumes of this user as not latest
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { isLatest: false }
    );
    
    // Get version number
    const count = await this.constructor.countDocuments({ userId: this.userId });
    this.version = count + 1;
  }
  next();
});

export default mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);

