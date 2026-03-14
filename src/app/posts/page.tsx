"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"
import { Cake, ImageIcon, Clock, X, ChevronLeft, ChevronRight } from "lucide-react"
import { getCloudinaryUrl } from "@/lib/cloudinary-url"
import Image from "next/image"

// ─── Types ───────────────────────────────────────────────────────────
interface PostImage {
  id: string
  image_url: string
  display_order: number
}

interface Post {
  id: number
  title: string
  content: string
  image_url?: string
  created_at: string
  post_images: PostImage[]
}

// ─── Image Viewer (Lightbox) ─────────────────────────────────────────
function ImageViewer({
  images,
  startIndex,
  onClose,
}: {
  images: string[]
  startIndex: number
  onClose: () => void
}) {
  const [current, setCurrent] = useState(startIndex)

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose, prev, next])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        onClick={onClose}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium select-none">
            {current + 1} / {images.length}
          </div>
        )}

        {/* Prev */}
        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-3 sm:left-6 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}

        {/* Image */}
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.18 }}
          className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[current]}
            alt={`Image ${current + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg select-none"
            draggable={false}
          />
        </motion.div>

        {/* Next */}
        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-3 sm:right-6 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? "bg-white w-3" : "bg-white/40"}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Photo Collage (max 3 shown, click opens viewer) ─────────────────
function PhotoCollage({
  images,
  onImageClick,
}: {
  images: string[]
  onImageClick: (index: number) => void
}) {
  if (images.length === 0) return null

  const shown = images.slice(0, 3)
  const extra = images.length - 3

  // 1 image: full width
  if (shown.length === 1) {
    return (
      <div className="w-full cursor-pointer" onClick={() => onImageClick(0)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shown[0]}
          alt="Post image"
          className="w-full max-h-[500px] object-cover"
        />
      </div>
    )
  }

  // 2 images: side by side
  if (shown.length === 2) {
    return (
      <div className="w-full grid grid-cols-2 gap-0.5">
        {shown.map((url, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={url}
            alt={`Post image ${i + 1}`}
            className="w-full h-[300px] object-cover cursor-pointer"
            onClick={() => onImageClick(i)}
          />
        ))}
      </div>
    )
  }

  // 3 images: 1 large left + 2 stacked right (max shown = 3)
  return (
    <div className="w-full grid grid-cols-2 gap-0.5" style={{ height: "400px" }}>
      {/* Large image left */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={shown[0]}
        alt="Post image 1"
        className="w-full h-full object-cover cursor-pointer"
        onClick={() => onImageClick(0)}
      />

      {/* 2 stacked right */}
      <div className="grid grid-rows-2 gap-0.5 h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shown[1]}
          alt="Post image 2"
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => onImageClick(1)}
        />
        <div
          className="relative w-full h-full cursor-pointer"
          onClick={() => onImageClick(2)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shown[2]}
            alt="Post image 3"
            className="w-full h-full object-cover"
          />
          {/* +N overlay if more than 3 total */}
          {extra > 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-3xl font-bold">+{extra}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Post Card ───────────────────────────────────────────────────────
function PostCard({ post, index }: { post: Post; index: number }) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)

  const images = (post.post_images || [])
    .sort((a, b) => a.display_order - b.display_order)
    .map((img) => img.image_url)
  const allImages = images.length > 0 ? images : post.image_url ? [post.image_url] : []

  const timeAgo = (dateStr: string) => {
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    const diffWeeks = Math.floor(diffDays / 7)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    if (diffWeeks < 4) return `${diffWeeks}w ago`
    return date.toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })
  }

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-md transition-shadow"
      >
        {/* Post Header */}
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/20 flex-shrink-0">
            <Image
              src={getCloudinaryUrl("/keilahs-logo.jpg")}
              alt="Keilah's"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm text-gray-900 truncate">Keilah&apos;s Cakes &amp; Pastries</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo(post.created_at)}
            </p>
          </div>
        </div>

        {/* Post Content */}
        <div className="px-4 pb-3">
          <h2 className="text-base font-bold text-gray-900 mb-1">{post.title}</h2>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{post.content}</p>
        </div>

        {/* Images */}
        {allImages.length > 0 && (
          <PhotoCollage
            images={allImages}
            onImageClick={(i) => setViewerIndex(i)}
          />
        )}

        {/* Post Footer */}
        <div className="px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            {new Date(post.created_at).toLocaleDateString("en-PH", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </motion.article>

      {/* Lightbox */}
      {viewerIndex !== null && (
        <ImageViewer
          images={allImages}
          startIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </>
  )
}

// ─── Loading Skeleton ────────────────────────────────────────────────
function PostSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden animate-pulse">
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 bg-gray-200 rounded" />
          <div className="h-2.5 w-20 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="px-4 pb-3 space-y-2">
        <div className="h-4 w-48 bg-gray-200 rounded" />
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-3/4 bg-gray-200 rounded" />
      </div>
      <div className="w-full h-64 bg-gray-200" />
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="h-3 w-40 bg-gray-200 rounded" />
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────
export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*, post_images(id, image_url, display_order)")
        .order("created_at", { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (err) {
      console.error("Error fetching posts:", err)
      setError("Failed to load posts. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-primary/5 via-white to-gray-50 pt-10 pb-6">
        <div className="max-w-xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center justify-center gap-2">
              <Cake className="h-7 w-7 text-primary" />
              <h1 className="text-3xl sm:text-4xl font-serif text-gray-900">
                Our Posts
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
              Stay updated with our latest creations, events, and sweet announcements
            </p>
          </motion.div>
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-xl mx-auto px-4 pb-16 space-y-4">
        {isLoading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-gray-500">{error}</p>
          </motion.div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No posts yet. Check back soon!</p>
          </motion.div>
        ) : (
          posts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))
        )}
      </div>
    </div>
  )
}
