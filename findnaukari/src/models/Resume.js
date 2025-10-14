import mongoose from 'mongoose';

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
  rawText: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  summary: {
    type: String,
  },
  experience: {
    type: String,
  },
  education: {
    type: String,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  // For storing file URL (S3/cloud storage - optional)
  fileUrl: {
    type: String,
  },
  // Parsing status
  status: {
    type: String,
    enum: ['uploaded', 'parsing', 'parsed', 'failed'],
    default: 'uploaded',
  },
}, {
  timestamps: true,
});

// Index for faster queries
ResumeSchema.index({ userId: 1, uploadedAt: -1 });

export default mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);

