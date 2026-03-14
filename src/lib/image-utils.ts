import path from 'path';

const CLOUDINARY_BASE = 'https://res.cloudinary.com/';

export function getCloudinaryPublicId(localPath: string): string {
  // If it's a full Cloudinary URL, extract the public ID from it.
  // URL format: https://res.cloudinary.com/{cloud}/image/upload/{transforms}/v{ver}/{public_id}.{ext}
  if (localPath.startsWith(CLOUDINARY_BASE)) {
    const match = localPath.match(/\/v\d+\/(.+?)(?:\.[^/.]+)?$/);
    if (match) return match[1];
  }

  // For local paths, convert to a Cloudinary public ID
  const cleanPath = localPath.startsWith('/') ? localPath.slice(1) : localPath;
  const parsedPath = path.parse(cleanPath);

  return path.join('keilahs-pastries', parsedPath.dir, parsedPath.name)
    .replace(/\\/g, '/')
    .replace(/\s+/g, '_')
    .toLowerCase();
}

export function isCloudinaryId(value: string): boolean {
  return !value.startsWith('/') && !value.startsWith('http');
}