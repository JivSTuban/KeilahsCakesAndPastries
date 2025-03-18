import { v2 as cloudinary } from 'cloudinary';
import * as path from 'path';

// Configure cloudinary
cloudinary.config({
  cloud_name: "denm8lsia",
  api_key: "624794215421246",
  api_secret: "5t7WUkf1mkQ9N4HBJCWHIXXbtAY"
});

async function uploadLogo() {
  const filePath = path.join(process.cwd(), 'public', 'LogoCircle.png');
  
  try {
    console.log('Starting logo upload to Cloudinary...');
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'keilahs-pastries',
      public_id: 'logo_circle',
      overwrite: true
    });

    console.log('Upload successful!');
    console.log('Cloudinary URL:', result.secure_url);
    console.log('Public ID:', result.public_id);
    return result;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

// Execute the upload
console.log('Starting upload process...');
uploadLogo()
  .then(() => console.log('Upload process completed'))
  .catch(error => console.error('Upload process failed:', error));
