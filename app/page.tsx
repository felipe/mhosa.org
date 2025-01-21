import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import NewsBanner from '../components/NewsBanner'
import MainContent from '../components/MainContent'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <NewsBanner />
        <MainContent />
      </main>
      <Footer />
    </div>
  )
}

