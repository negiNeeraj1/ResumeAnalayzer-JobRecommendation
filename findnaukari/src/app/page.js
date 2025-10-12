
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const page = () => {
  return (
    <div className="min-h-screen flex flex-col font-poppins">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#B6AE9F' }}>
              Welcome to apniNaukari
            </h1>
            <p className="text-xl" style={{ color: '#B6AE9F' }}>
              Your AI-powered resume analysis and job recommendation system
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default page