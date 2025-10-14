'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RecruiterDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'recruiter') {
        router.push('/dashboard/student');
        return;
      }
      setUser(parsedUser);
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FBF3D1 0%, #DEDED1 50%, #C5C7BC 100%)' }}>
        <div className="text-2xl font-semibold" style={{ color: '#8B7D6B' }}>Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const quickActions = [
    {
      title: 'Post a Job',
      description: 'Create and publish new job openings',
      icon: '➕',
      link: '/dashboard/recruiter/post-job',
      color: '#B6AE9F'
    },
    {
      title: 'View Candidates',
      description: 'Browse and filter potential candidates',
      icon: '👥',
      link: '/dashboard/recruiter/candidates',
      color: '#8B7D6B'
    },
    {
      title: 'My Job Posts',
      description: 'Manage your active job listings',
      icon: '📋',
      link: '/dashboard/recruiter/jobs',
      color: '#B6AE9F'
    },
    {
      title: 'Applications',
      description: 'Review received applications',
      icon: '📨',
      link: '/dashboard/recruiter/applications',
      color: '#8B7D6B'
    }
  ];

  const stats = [
    { label: 'Active Jobs', value: '5', icon: '💼' },
    { label: 'Total Applications', value: '127', icon: '📩' },
    { label: 'Shortlisted', value: '23', icon: '✅' },
    { label: 'Interviews', value: '8', icon: '🎯' }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FBF3D1 0%, #DEDED1 50%, #C5C7BC 100%)' }}>
      {/* Header */}
      <header className="backdrop-blur-md shadow-lg sticky top-0 z-50" style={{ backgroundColor: 'rgba(251, 243, 209, 0.9)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold" style={{ color: '#8B7D6B' }}>
              FindNaukari
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold" style={{ color: '#8B7D6B' }}>{user.name}</div>
                <div className="text-xs" style={{ color: '#6B5B47' }}>{user.company} • {user.position}</div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-lg"
                style={{ backgroundColor: '#B6AE9F', color: '#FBF3D1' }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl lg:text-5xl font-bold mb-3" style={{ color: '#8B7D6B' }}>
            Recruiter Dashboard
          </h1>
          <p className="text-lg" style={{ color: '#6B5B47' }}>
            {user.company ? `Hiring for ${user.company}` : 'Manage your recruitment process efficiently'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-6 rounded-xl shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 animate-fade-in-up"
              style={{ 
                backgroundColor: '#DEDED1',
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold mb-1" style={{ color: '#B6AE9F' }}>
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: '#6B5B47' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#8B7D6B' }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.link}
                className="group"
              >
                <div
                  className="p-6 rounded-xl shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up"
                  style={{ 
                    backgroundColor: '#DEDED1',
                    animationDelay: `${(index + 4) * 100}ms`
                  }}
                >
                  <div className="text-4xl mb-3">{action.icon}</div>
                  <h3 className="text-lg font-bold mb-2 group-hover:underline" style={{ color: action.color }}>
                    {action.title}
                  </h3>
                  <p className="text-sm" style={{ color: '#6B5B47' }}>
                    {action.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold" style={{ color: '#8B7D6B' }}>
              Recent Applications
            </h2>
            <Link 
              href="/dashboard/recruiter/applications"
              className="text-sm font-medium hover:underline"
              style={{ color: '#B6AE9F' }}
            >
              View All →
            </Link>
          </div>
          <div className="rounded-xl shadow-lg backdrop-blur-md p-6" style={{ backgroundColor: '#DEDED1' }}>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg transition-colors hover:bg-white/20 cursor-pointer">
                <div className="text-2xl">👨‍💻</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold" style={{ color: '#8B7D6B' }}>John Doe</p>
                      <p className="text-sm" style={{ color: '#6B5B47' }}>Applied for: Senior Frontend Developer</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#B6AE9F', color: '#FBF3D1' }}>React</span>
                        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#B6AE9F', color: '#FBF3D1' }}>TypeScript</span>
                        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#B6AE9F', color: '#FBF3D1' }}>5 years exp</span>
                      </div>
                    </div>
                    <span className="text-xs" style={{ color: '#6B5B47' }}>2 hours ago</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-lg transition-colors hover:bg-white/20 cursor-pointer">
                <div className="text-2xl">👩‍💻</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold" style={{ color: '#8B7D6B' }}>Sarah Smith</p>
                      <p className="text-sm" style={{ color: '#6B5B47' }}>Applied for: Backend Engineer</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#B6AE9F', color: '#FBF3D1' }}>Python</span>
                        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#B6AE9F', color: '#FBF3D1' }}>Django</span>
                        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#B6AE9F', color: '#FBF3D1' }}>3 years exp</span>
                      </div>
                    </div>
                    <span className="text-xs" style={{ color: '#6B5B47' }}>5 hours ago</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg transition-colors hover:bg-white/20 cursor-pointer">
                <div className="text-2xl">👨‍💼</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold" style={{ color: '#8B7D6B' }}>Mike Johnson</p>
                      <p className="text-sm" style={{ color: '#6B5B47' }}>Applied for: Full Stack Developer</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#B6AE9F', color: '#FBF3D1' }}>Node.js</span>
                        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#B6AE9F', color: '#FBF3D1' }}>React</span>
                        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#B6AE9F', color: '#FBF3D1' }}>4 years exp</span>
                      </div>
                    </div>
                    <span className="text-xs" style={{ color: '#6B5B47' }}>1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hiring Focus */}
        {user.hiringFocus && (
          <div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#8B7D6B' }}>
              Your Hiring Focus
            </h2>
            <div className="rounded-xl shadow-lg backdrop-blur-md p-6" style={{ backgroundColor: '#DEDED1' }}>
              <p className="text-lg" style={{ color: '#6B5B47' }}>
                {user.hiringFocus}
              </p>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

