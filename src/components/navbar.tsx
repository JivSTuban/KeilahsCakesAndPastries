"use client"

import { useState } from "react"
import { useScrollDirection } from "@/hooks/use-scroll-direction"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Featured Orders", href: "/featured" },
  { name: "About", href: "/about" },
  { name: "Feedback", href: "/feedback" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { isScrolled, isScrollingUp } = useScrollDirection()
  const isAdminPage = pathname === "/admin"

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? `${isScrollingUp ? "top-0" : "-top-24"} bg-white/90 backdrop-blur-md shadow-md py-2` 
          : "top-0 bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="relative h-12 w-12 mr-2 rounded-full overflow-hidden"
              >
                <Image
                  src="/keilahs-logo.jpg"
                  alt="Keilah's Pastries Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`font-serif text-2xl ${isScrolled ? "text-pink-600" : "text-white"}`}
              >
                Keilah&apos;s
              </motion.span>
            </Link>
            <Link 
              href="https://www.facebook.com/keilahspastriesndesserts" 
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-2 transition-colors duration-300",
                isScrolled ? "text-gray-700 hover:text-pink-600" : "text-white hover:text-pink-100"
              )}
            >
              <Image
                src="/keilahs-logo.jpg"
                alt="Visit us on Facebook"
                width={40}
                height={40}
                className="rounded-full transition-transform duration-300 hover:scale-110"
              />
              <span className="text-sm font-medium hidden md:inline">Follow us on Facebook</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors hover:text-pink-500 group ${
                    isScrolled ? "text-gray-700" : "text-white"
                  } ${pathname === link.href ? "text-pink-600" : ""}`}
                >
                  {link.name}
                  <span 
                    className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-300 group-hover:w-full
                      ${pathname === link.href ? "w-full" : ""}
                    `}
                  />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Order Button */}
          {!isAdminPage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="hidden md:block"
            >
              <Button
                asChild
                className={`${isScrolled ? "bg-pink-600 hover:bg-pink-700" : "bg-white text-pink-600 hover:bg-pink-100"}`}
              >
                <Link href="/menu">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Order Now
                </Link>
              </Button>
            </motion.div>
          )}

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className={`h-6 w-6 ${isScrolled ? "text-gray-700" : "text-white"}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isScrolled ? "text-gray-700" : "text-white"}`} />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="block text-gray-700 font-medium hover:text-pink-500"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              {!isAdminPage && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.5 }}>
                  <Button asChild className="w-full bg-pink-600 hover:bg-pink-700">
                    <Link href="/menu" onClick={() => setIsOpen(false)}>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Order Now
                    </Link>
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
