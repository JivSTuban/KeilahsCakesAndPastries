import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert File to base64 data URI for Cloudinary upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataUri = `data:${file.type};base64,${base64}`

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "keilahs-pastries",
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      // f_auto / q_auto are applied at delivery time via the URL — not needed here
    })

    return NextResponse.json({ url: result.secure_url })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("Cloudinary upload error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
