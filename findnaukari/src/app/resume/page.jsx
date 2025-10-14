'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResumeUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    // Validate file type
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file only');
      setFile(null);
      return;
    }

    // Validate file size (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError('');
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      clearInterval(progressInterval);
      setProgress(100);

      if (data.success) {
        setResult(data);
        setTimeout(() => {
          setProgress(0);
        }, 1000);
      } else {
        setError(data.error || 'Upload failed. Please try again.');
        setProgress(0);
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError('Network error. Please check your connection and try again.');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError('');
    setProgress(0);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #FBF3D1 0%, #DEDED1 50%, #C5C7BC 100%)' }}>
      {/* Header */}
      <div className="w-full py-4 px-6" style={{ backgroundColor: '#FBF3D1' }}>
        <Link href="/" className="text-2xl font-bold" style={{ color: '#8B7D6B' }}>
          ← Back to Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl">
          {/* Title */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl lg:text-5xl font-bold mb-3" style={{ color: '#8B7D6B' }}>
              Upload Your Resume
            </h1>
            <p className="text-lg" style={{ color: '#6B5B47' }}>
              Get AI-powered job recommendations tailored to your skills
            </p>
          </div>

          {/* Upload Card */}
          <div 
            className="rounded-2xl shadow-2xl backdrop-blur-md p-8 relative overflow-hidden transition-all duration-300"
            style={{ backgroundColor: '#DEDED1' }}
          >
            {/* Decorative blobs */}
            <div
              className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 animate-blob"
              style={{ backgroundColor: '#B6AE9F' }}
            />
            <div
              className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10 animate-blob animation-delay-2000"
              style={{ backgroundColor: '#8B7D6B' }}
            />

            <div className="relative">
              {!result ? (
                <>
                  {/* Drag & Drop Area */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-3 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                      dragActive ? 'border-opacity-100 scale-105' : 'border-opacity-50'
                    }`}
                    style={{ 
                      borderColor: dragActive ? '#B6AE9F' : '#8B7D6B',
                      backgroundColor: dragActive ? 'rgba(182, 174, 159, 0.1)' : 'transparent'
                    }}
                  >
                    {/* Upload Icon */}
                    <div className="mb-4 flex justify-center">
                      <svg 
                        className="w-20 h-20 animate-bounce-slow" 
                        style={{ color: '#B6AE9F' }}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                        />
                      </svg>
                    </div>

                    {file ? (
                      <div className="space-y-2">
                        <p className="text-lg font-semibold" style={{ color: '#8B7D6B' }}>
                          📄 {file.name}
                        </p>
                        <p className="text-sm" style={{ color: '#6B5B47' }}>
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                        <button
                          onClick={handleReset}
                          className="text-sm underline hover:no-underline"
                          style={{ color: '#B6AE9F' }}
                        >
                          Change file
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-xl font-semibold" style={{ color: '#8B7D6B' }}>
                          Drag & drop your resume here
                        </p>
                        <p className="text-sm" style={{ color: '#6B5B47' }}>
                          or click to browse
                        </p>
                        <p className="text-xs" style={{ color: '#8B7D6B' }}>
                          PDF only • Max 5MB
                        </p>
                      </div>
                    )}

                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mt-4 p-4 rounded-lg animate-shake" style={{ backgroundColor: '#f8d7da', color: '#721c24' }}>
                      <p className="font-medium">⚠️ {error}</p>
                    </div>
                  )}

                  {/* Progress Bar */}
                  {uploading && (
                    <div className="mt-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium" style={{ color: '#8B7D6B' }}>
                          Analyzing your resume...
                        </span>
                        <span className="text-sm font-medium" style={{ color: '#8B7D6B' }}>
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#C5C7BC' }}>
                        <div
                          className="h-full rounded-full transition-all duration-300 animate-pulse"
                          style={{ 
                            backgroundColor: '#B6AE9F',
                            width: `${progress}%`
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="w-full mt-6 py-3 rounded-lg font-semibold text-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{ backgroundColor: '#B6AE9F', color: '#FBF3D1' }}
                  >
                    {uploading ? '⏳ Analyzing...' : '🚀 Analyze Resume'}
                  </button>
                </>
              ) : (
                /* Success Result */
                <div className="space-y-6 animate-fade-in">
                  {/* Success Header */}
                  <div className="text-center">
                    <div className="inline-block p-4 rounded-full mb-4 animate-bounce-slow" style={{ backgroundColor: '#B6AE9F' }}>
                      <svg className="w-12 h-12" style={{ color: '#FBF3D1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold mb-2" style={{ color: '#8B7D6B' }}>
                      Resume Analyzed Successfully!
                    </h2>
                    <p style={{ color: '#6B5B47' }}>
                      We found {result.data.skillCount} skills in your resume
                    </p>
                  </div>

                  {/* Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.data.email && (
                      <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(182, 174, 159, 0.2)' }}>
                        <p className="text-sm font-medium mb-1" style={{ color: '#6B5B47' }}>📧 Email</p>
                        <p className="font-semibold" style={{ color: '#8B7D6B' }}>{result.data.email}</p>
                      </div>
                    )}
                    {result.data.phone && (
                      <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(182, 174, 159, 0.2)' }}>
                        <p className="text-sm font-medium mb-1" style={{ color: '#6B5B47' }}>📱 Phone</p>
                        <p className="font-semibold" style={{ color: '#8B7D6B' }}>{result.data.phone}</p>
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  {result.data.skills.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold mb-3" style={{ color: '#8B7D6B' }}>
                        💼 Skills Detected ({result.data.skills.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.data.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-4 py-2 rounded-full text-sm font-medium shadow-md animate-fade-in-up"
                            style={{ 
                              backgroundColor: '#B6AE9F', 
                              color: '#FBF3D1',
                              animationDelay: `${i * 50}ms`
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={handleReset}
                      className="flex-1 py-3 rounded-lg font-semibold border-2 transition-all duration-200 hover:shadow-lg"
                      style={{ borderColor: '#B6AE9F', color: '#B6AE9F' }}
                    >
                      📤 Upload Another Resume
                    </button>
                    <button
                      onClick={() => router.push('/jobs/recommended')}
                      className="flex-1 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                      style={{ backgroundColor: '#B6AE9F', color: '#FBF3D1' }}
                    >
                      🎯 Find Matching Jobs
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: '#6B5B47' }}>
              🔒 Your resume is processed securely and privately
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-blob {
          animation: blob 7s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

