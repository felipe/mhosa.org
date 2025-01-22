import AboutSection from './AboutSection'
import ImageGallery from './ImageGallery'
import MembershipSection from './MembershipSection'
import RacesSection from './RacesSection'

export default function MainContent() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3">
            <AboutSection />
            <ImageGallery />
            <MembershipSection />
          </div>
          <div className="lg:w-1/3">
            <RacesSection />
          </div>
        </div>
      </div>
    </section>
  )
}

