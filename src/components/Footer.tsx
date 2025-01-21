export default function Footer() {
  return (
    <footer className="bg-blue-800 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xl mb-4">&copy; {new Date().getFullYear()} MHOSA. All rights reserved.</p>
        <p className="mb-2">Contact us: <a href="mailto:info@racingassociation.com" className="underline hover:text-blue-300">info@racingassociation.com</a></p>
        <p>Phone: (123) 456-7890</p>
      </div>
    </footer>
  )
}
