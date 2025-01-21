import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-800">MHOSA</Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="#about" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">About</Link></li>
            <li><Link href="#membership" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">Membership</Link></li>
            <li><Link href="#races" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">Races</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

