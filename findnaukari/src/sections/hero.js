import Image from 'next/image';
import hero1 from '@/assets/hero1.png';

export const Hero = () => {
  return (
    <div className="font-poppins h-screen flex items-center mt-[-80px]">
         <section className="w-full py-4 lg:py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full">
              {/* Left Side - Text Content */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h1 className="text-4xl lg:text-5xl font-bold leading-tight" style={{ color: '#B6AE9F' }}>
                    Find Your
                    <span className="block" style={{ color: '#8B7D6B' }}>Dream Job</span>
                  </h1>
                  <p className="text-base lg:text-lg leading-relaxed" style={{ color: '#8B7D6B' }}>
                    Get personalized job recommendations based on your skills and experience. 
                    Our AI analyzes your resume and matches you with the perfect opportunities.
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#B6AE9F' }}></div>
                    <span className="text-lg" style={{ color: '#8B7D6B' }}>AI-powered resume analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#B6AE9F' }}></div>
                    <span className="text-lg" style={{ color: '#8B7D6B' }}>Smart job matching</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#B6AE9F' }}></div>
                    <span className="text-lg" style={{ color: '#8B7D6B' }}>Skill gap analysis</span>
                  </div>
          
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="px-6 py-2 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl" 
                          style={{ backgroundColor: '#B6AE9F', color: '#FBF3D1' }}>
                    Get Started Free
                  </button>
                  <button className="px-6 py-2 rounded-lg text-lg font-semibold border-2 transition-all duration-200 hover:shadow-lg" 
                          style={{ borderColor: '#B6AE9F', color: '#B6AE9F' }}>
                    Learn More
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-5 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: '#B6AE9F' }}>10K+</div>
                    <div className="text-xs" style={{ color: '#8B7D6B' }}>Jobs Matched</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: '#B6AE9F' }}>95%</div>
                    <div className="text-xs" style={{ color: '#8B7D6B' }}>Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: '#B6AE9F' }}>5K+</div>
                    <div className="text-xs" style={{ color: '#8B7D6B' }}>Happy Users</div>
                  </div>
                </div>
              </div>

              {/* Right Side - Hero Image */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  {/* Hero Image */}
                  <Image 
                    src={hero1} 
                    alt="Hero illustration showing job search and career opportunities"
                    className="w-full h-auto object-cover"
                    width={600}
                    height={400}
                    priority
                  />
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20" 
                       style={{ backgroundColor: '#B6AE9F' }}></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full opacity-10" 
                       style={{ backgroundColor: '#8B7D6B' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>
    </div>
  )
}