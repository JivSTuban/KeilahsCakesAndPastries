"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface CloudinaryImageProps extends Omit<ImageProps, "onLoadingComplete" | "src"> {
  publicId: string;
  overlayClassName?: string;
  transformations?: string;
}

export function CloudinaryImage({
  publicId,
  className,
  overlayClassName,
  transformations = "f_auto,q_auto",
  width,
  height,
  ...props
}: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
  const optimizedUrl = `${baseUrl}/${transformations}/v1/${publicId}`;

  return (
    <div className="relative w-full h-full" style={{ position: 'relative' }}>
      <Image
        {...props}
        src={optimizedUrl}
        width={width}
        height={height}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoadingComplete={() => setIsLoading(false)}
      />
      {isLoading && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center bg-muted/20",
          overlayClassName
        )}>
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}

export function BlurCloudinaryImage({ publicId, alt, ...props }: CloudinaryImageProps) {
  return (
    <div className="relative w-full h-full">
      <CloudinaryImage
        publicId={publicId}
        alt={alt}
        quality={90}
        {...props}
        transformations="f_auto,q_auto,e_blur:1000"
      />
    </div>
  );
}