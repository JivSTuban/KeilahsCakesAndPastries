import Link from "next/link"
import { Facebook, Instagram, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-pink-600 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <span className="font-serif text-2xl">Keilah&apos;s</span>
            </Link>
            <p className="text-pink-100 mb-4">
              Delicious handmade cakes and pastries for every occasion. Made with love in Basak, Lapu-Lapu City.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-pink-200 transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-white hover:text-pink-200 transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="mailto:contact@keilahspastries.com" className="text-white hover:text-pink-200 transition-colors">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-pink-100 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-pink-100 hover:text-white transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/featured" className="text-pink-100 hover:text-white transition-colors">
                  Featured Orders
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-pink-100 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-pink-100 hover:text-white transition-colors">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>09279835826</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>contact@keilahspastries.com</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Basak, Lapu-Lapu City, 6015, Philippines</span>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4">Business Hours</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span>9:00 AM - 5:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span>10:00 AM - 3:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-pink-400 mt-8 pt-8 text-center">
          <p className="text-pink-100">
            &copy; {new Date().getFullYear()} Keilah&apos;s Pastries and Desserts. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

