import Image from 'next/image'

const images = [
  { src: '/placeholder.svg?height=300&width=400', alt: 'Racing car on track' },
  { src: '/placeholder.svg?height=300&width=400', alt: 'Pit crew in action' },
  { src: '/placeholder.svg?height=300&width=400', alt: 'Checkered flag' },
  { src: '/placeholder.svg?height=300&width=400', alt: 'Podium celebration' },
]

export default function ImageGallery() {
  return (
    <section className="my-12">
      <h2 className="text-3xl font-bold mb-6">Image Gallery</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative h-48 overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 hover:scale-110"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

