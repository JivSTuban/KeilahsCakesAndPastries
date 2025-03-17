export function getCloudinaryUrl(localPath: string): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const publicId = getCloudinaryPublicId(localPath);
  
  // Construct the Cloudinary URL with optimization parameters
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/v1/${publicId}`;
}

export function getCloudinaryPublicId(localPath: string): string {
  // Remove leading slash and file extension
  const cleanPath = localPath.startsWith('/') ? localPath.slice(1) : localPath;
  const pathParts = cleanPath.split('.');
  const pathWithoutExtension = pathParts[0];
  
  // Create the public ID following the same format as the upload script
  const publicId = `keilahs-pastries/${pathWithoutExtension}`
    .replace(/\s+/g, '_')
    .toLowerCase();

  return publicId;
}