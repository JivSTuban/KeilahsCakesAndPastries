"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/ui/image-upload"
import { MultiImageUpload } from "@/components/ui/multi-image-upload"
import { toast } from "sonner"
import { ImageIcon } from "lucide-react"

export function HeroManagement() {
  const [displayMode, setDisplayMode] = useState<"single" | "slideshow">("slideshow")
  const [imageUrl, setImageUrl] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchHeroSetting()
  }, [])

  const fetchHeroSetting = async () => {
    try {
      const { data, error } = await supabase
        .from("hero_settings")
        .select("display_mode, image_url, images")
        .eq("id", 1)
        .single()

      if (error && error.code !== "PGRST116") throw error // Ignore "not found"
      
      if (data) {
        if (data.display_mode) setDisplayMode(data.display_mode as "single" | "slideshow")
        if (data.image_url) setImageUrl(data.image_url)
        if (data.images && Array.isArray(data.images)) setImages(data.images)
      }
    } catch (error) {
      console.error("Error fetching hero setting:", error)
      toast.error("Failed to load hero setting")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (displayMode === "slideshow" && (!images || images.length === 0)) {
      toast.error("Please upload at least one image for the slideshow")
      return
    }
    if (displayMode === "single" && !imageUrl) {
      toast.error("Please upload an image for the hero section")
      return
    }

    setIsSaving(true)
    try {
      // Upsert the row with id = 1
      const { error } = await supabase
        .from("hero_settings")
        .upsert({ 
          id: 1, 
          display_mode: displayMode,
          image_url: imageUrl,
          images: images, 
          updated_at: new Date().toISOString() 
        })

      if (error) throw error

      toast.success("Hero image updated successfully")
    } catch (error) {
      console.error("Error updating hero setting:", error)
      toast.error("Failed to update hero setting")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-primary" />
          Homepage Hero Image
        </h2>
      </div>

      <div className="bg-white p-6 rounded-lg border max-w-xl space-y-4">
        <div className="space-y-3 pb-4">
          <label className="text-sm font-medium leading-none">
            Display Mode
          </label>
          <select 
            value={displayMode} 
            onChange={(e) => setDisplayMode(e.target.value as "single" | "slideshow")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer 
            bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] 
            bg-[length:12px_12px] bg-[right_1rem_center] bg-no-repeat appearance-none"
          >
            <option value="slideshow">Slideshow</option>
            <option value="single">Single Picture</option>
          </select>
        </div>

        {displayMode === "slideshow" ? (
          <>
            <p className="text-sm text-muted-foreground">
              Upload pictures for your homepage slideshow.
              We recommend high-resolution, wide-aspect ratio images for best results.
            </p>
            <MultiImageUpload
              values={images}
              onChange={setImages}
            />
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Upload a single static background picture for the homepage hero section.
            </p>
            <ImageUpload
              value={imageUrl}
              onChange={setImageUrl}
              required={true}
            />
          </>
        )}

        <div className="pt-4 flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isSaving || (displayMode === "slideshow" ? images.length === 0 : !imageUrl)}
            className="w-full sm:w-auto min-w-[120px]"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
