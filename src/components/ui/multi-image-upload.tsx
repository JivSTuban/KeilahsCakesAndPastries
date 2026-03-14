"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, X, ImageIcon, Loader2, Plus } from "lucide-react"

interface MultiImageUploadProps {
  values: string[]
  onChange: (urls: string[]) => void
}

export function MultiImageUpload({ values, onChange }: MultiImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadingCount, setUploadingCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!file.type.startsWith("image/")) {
      setError("Please select image files only.")
      return null
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Each file must be under 10 MB.")
      return null
    }

    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/upload", { method: "POST", body: formData })
    const data = await res.json()

    if (!res.ok) throw new Error(data.error || "Upload failed")
    return data.url
  }

  const handleFiles = async (files: FileList | File[]) => {
    setError(null)
    const fileArray = Array.from(files)
    setUploadingCount(fileArray.length)

    try {
      const results = await Promise.all(fileArray.map(uploadFile))
      const successUrls = results.filter((u): u is string => u !== null)
      if (successUrls.length > 0) {
        onChange([...values, ...successUrls])
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.")
    } finally {
      setUploadingCount(0)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) handleFiles(files)
    e.target.value = ""
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files && files.length > 0) handleFiles(files)
  }, [values])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const removeImage = (index: number) => {
    onChange(values.filter((_, i) => i !== index))
  }

  const isUploading = uploadingCount > 0

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Image Preview Grid */}
      {values.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {values.map((url, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden border border-border aspect-square">
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Add More Button */}
          <button
            type="button"
            onClick={() => !isUploading && inputRef.current?.click()}
            disabled={isUploading}
            className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Add</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Drop Zone (shown when no images yet) */}
      {values.length === 0 && (
        <button
          type="button"
          onClick={() => !isUploading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          disabled={isUploading}
          className={`
            w-full h-36 rounded-lg border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-2
            ${isDragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/50 hover:bg-gray-50"
            }
            ${isUploading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
          `}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading {uploadingCount} image{uploadingCount > 1 ? "s" : ""}…</p>
            </>
          ) : (
            <>
              <div className="p-2.5 rounded-full bg-primary/10">
                <ImageIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  Drop images here or{" "}
                  <span className="text-primary underline underline-offset-2">browse</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG, WebP — max 10 MB each • Multiple allowed</p>
              </div>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <X className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  )
}
