export function getCloudinaryUrl(localPath: string, options?: { circular?: boolean }): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const publicId = getCloudinaryPublicId(localPath);
  
  // Build transformation parameters
  const transforms = ['f_auto', 'q_auto'];
  if (options?.circular) {
    transforms.push('c_fill', 'r_max');
  }
  
  // Construct the Cloudinary URL with optimization parameters
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(',')}/v1/${publicId}`;
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
