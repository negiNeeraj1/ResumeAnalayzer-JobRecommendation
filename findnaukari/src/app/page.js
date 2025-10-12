
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Hero } from '@/sections/hero';
const page = () => {
  return (
    <div className="min-h-screen flex flex-col font-poppins">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />  
      </main>
      <Footer />
    </div>
  )
}

export default page