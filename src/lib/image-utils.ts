import path from 'path';

export function getCloudinaryPublicId(localPath: string): string {
  // Remove leading slash and file extension
  const cleanPath = localPath.startsWith('/') ? localPath.slice(1) : localPath;
  const parsedPath = path.parse(cleanPath);
  
  // Create the public ID following the same format as the upload script
  const publicId = path.join(
    'keilahs-pastries',
    parsedPath.dir,
    parsedPath.name
  )
    .replace(/\\/g, '/')
    .replace(/\s+/g, '_')
    .toLowerCase();

  return publicId;
}

export function isCloudinaryId(path: string): boolean {
  return !path.startsWith('/') && !path.startsWith('http');
}