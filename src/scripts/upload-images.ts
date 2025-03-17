const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PUBLIC_DIR = path.join(process.cwd(), 'public');

interface UploadResult {
  originalPath: string;
  cloudinaryPath: string;
  publicId: string;
}

async function uploadFile(filePath: string): Promise<UploadResult> {
  const relativePath = path.relative(PUBLIC_DIR, filePath);
  const folderPath = path.dirname(relativePath);
  const fileName = path.basename(relativePath);
  
  // Create a Cloudinary-friendly public ID
  const publicId = path.join(folderPath, path.parse(fileName).name)
    .replace(/\\/g, '/')
    .replace(/\s+/g, '_')
    .toLowerCase();

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      folder: 'keilahs-pastries',
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });

    return {
      originalPath: relativePath,
      cloudinaryPath: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error);
    throw error;
  }
}

async function processDirectory(dir: string): Promise<UploadResult[]> {
  const results: UploadResult[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules and .git directories
      if (entry.name !== 'node_modules' && entry.name !== '.git') {
        const subResults = await processDirectory(fullPath);
        results.push(...subResults);
      }
    } else if (entry.isFile() && /\.(jpg|jpeg|png|gif|svg)$/i.test(entry.name)) {
      const result = await uploadFile(fullPath);
      results.push(result);
      console.log(`Uploaded: ${result.originalPath} -> ${result.publicId}`);
    }
  }

  return results;
}

async function main() {
  try {
    console.log('Starting image upload to Cloudinary...');
    const results = await processDirectory(PUBLIC_DIR);
    
    // Save the mapping to a JSON file
    const mappingPath = path.join(process.cwd(), 'src/data/cloudinary-mapping.json');
    fs.writeFileSync(
      mappingPath,
      JSON.stringify({ images: results }, null, 2)
    );

    console.log(`\nUpload complete! ${results.length} images processed`);
    console.log(`Mapping saved to: ${mappingPath}`);
  } catch (error) {
    console.error('Upload failed:', error);
    process.exit(1);
  }
}

main();