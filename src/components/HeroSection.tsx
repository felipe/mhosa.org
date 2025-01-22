import Image from 'next/image'
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white overflow-hidden">
      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Experience the Thrill of Racing</h1>
          <p className="text-xl mb-6">Join our community of passionate racers and push your limits on the track.</p>
          <Button className="bg-white text-blue-800 hover:bg-blue-100 font-bold py-3 px-6 rounded-full text-lg">
            Join Now
          </Button>
        </div>
        <div className="lg:w-1/2 mt-8 lg:mt-0">
          <Image
            src="/static/lexan-body.png"
            alt="Racing car cutout"
            width={600}
            height={400}
            className="w-full h-auto object-cover rounded-lg transform -rotate-6"
          />
        </div>
      </div>
    </section>
  )
}
